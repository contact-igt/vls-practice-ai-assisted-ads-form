import { programConfig } from "@/constants/Home";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !secret) {
      console.error("create-order: Razorpay env variables are missing");
      return res.status(500).json({ error: "Payment is not configured" });
    }

    // Amount is always taken from server-side config, never from the client.
    const amount = Number(programConfig.fee);
    if (!amount || Number.isNaN(amount)) {
      return res.status(500).json({ error: "Invalid amount" });
    }

    const auth =
      "Basic " + Buffer.from(`${key_id}:${secret}`).toString("base64");

    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // rupees -> paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("Razorpay API Error:", data);
      return res.status(r.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
