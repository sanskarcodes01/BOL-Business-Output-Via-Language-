import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState, 
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import pino from "pino";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });
  const PORT = 3000;

  app.use(express.json());

  // --- WhatsApp Multi-Device (Baileys) Setup ---
  const AUTH_FOLDER = path.join(process.cwd(), "whatsapp_auth");
  if (!fs.existsSync(AUTH_FOLDER)) fs.mkdirSync(AUTH_FOLDER);

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
  const { version } = await fetchLatestBaileysVersion();

  let sock: any = null;
  let qrCodeData: string | null = null;
  let connectionStatus: "connecting" | "open" | "close" | "qr" = "connecting";

  const connectToWhatsApp = async () => {
    sock = makeWASocket({
      version,
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      browser: Browsers.macOS("Desktop"),
      logger: pino({ level: "silent" }),
    });

    sock.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        qrCodeData = await QRCode.toDataURL(qr);
        connectionStatus = "qr";
        io.emit("whatsapp:qr", qrCodeData);
      }

      if (connection === "close") {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
        connectionStatus = "close";
        qrCodeData = null;
        io.emit("whatsapp:status", "disconnected");
        if (shouldReconnect) connectToWhatsApp();
      } else if (connection === "open") {
        connectionStatus = "open";
        qrCodeData = null;
        io.emit("whatsapp:status", "connected");
        console.log("WhatsApp connection opened!");
      }
    });

    sock.ev.on("creds.update", saveCreds);

    // Listen for incoming messages (optional: can be used for "get data through whatsapp")
    sock.ev.on("messages.upsert", async (m: any) => {
      // console.log(JSON.stringify(m, undefined, 2));
      // This is where we could parse incoming messages to update the ledger!
    });
  };

  connectToWhatsApp();

  // Socket.io Events
  io.on("connection", (socket) => {
    console.log("Client connected to socket:", socket.id);
    if (qrCodeData) socket.emit("whatsapp:qr", qrCodeData);
    socket.emit("whatsapp:status", connectionStatus === "open" ? "connected" : connectionStatus === "qr" ? "qr" : "disconnected");
  });

  // WhatsApp API Endpoints
  app.post("/api/whatsapp/send", async (req, res) => {
    const { to, message } = req.body;

    // Try Linked Account first
    if (connectionStatus === "open" && sock) {
      try {
        const jid = to.includes("@") ? to : `${to.replace(/\D/g, "")}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text: message });
        return res.json({ success: true, method: "linked_account" });
      } catch (err: any) {
        console.error("Linked Account Error:", err.message);
      }
    }

    // Fallback to Official API if configured
    const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
    if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const response = await axios.post(
          `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: to,
            type: "text",
            text: { body: message },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        return res.json({ success: true, method: "official_api", data: response.data });
      } catch (error: any) {
        console.error("Official API Error:", error.response?.data || error.message);
        return res.status(500).json({ 
          error: "Failed to send WhatsApp message via both methods.", 
          details: error.response?.data || error.message 
        });
      }
    }

    res.status(400).json({ error: "WhatsApp not linked and Official API not configured." });
  });

  // Logout Endpoint
  app.post("/api/whatsapp/logout", async (req, res) => {
    if (sock) {
      await sock.logout();
      if (fs.existsSync(AUTH_FOLDER)) {
        fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
      }
      res.json({ success: true });
      setTimeout(() => connectToWhatsApp(), 1000);
    } else {
      res.status(400).json({ error: "No active session." });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
