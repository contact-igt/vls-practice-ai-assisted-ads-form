import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body || {};

  if (!secret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ verified: false });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  const verified = a.length === b.length && crypto.timingSafeEqual(a, b);

  return res.status(200).json({ verified });
}
