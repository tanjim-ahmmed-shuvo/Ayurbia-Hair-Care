export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    
    // Vercel Environment Variables থেকে টোকেনগুলো নিবে (কোডে দেখা যাবে না)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Validate Server Configuration
    if (!botToken || !chatId) {
      console.error("Missing Environment Variables");
      return res.status(500).json({ status: "error", message: "Server configuration error. API keys missing." });
    }

    const orderMessage = `*নতুন অর্ডার এসেছে!* 🎉\n\n` +
                         `*নাম:* ${data.name}\n` +
                         `*মোবাইল:* ${data.phone}\n` +
                         `*ঠিকানা:* ${data.address}\n` +
                         `*প্যাকেজ:* ${data.packageName}\n` +
                         `*ডেলিভারি চার্জ:* ফ্রি\n` +
                         `*সর্বমোট বিল:* ৳${data.totalPrice}`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: orderMessage,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();

    if (result.ok) {
      return res.status(200).json({ status: "success" });
    } else {
      console.error("Telegram API Error:", result);
      return res.status(500).json({ status: "error", message: "Telegram API Error" });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ status: "error", message: error.toString() });
  }
}
