export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    const response = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, message }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to send WhatsApp message.");
    }
    return data;
  } catch (error: any) {
    console.error("WhatsApp Service Error:", error.message);
    throw error;
  }
};
