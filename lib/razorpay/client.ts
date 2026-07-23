import Razorpay from "razorpay";

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  console.log("RAZORPAY_KEY_ID:", keyId ? "FOUND" : "MISSING");
  console.log("RAZORPAY_KEY_SECRET:", keySecret ? "FOUND" : "MISSING");

  if (!keyId || !keySecret) {
    throw new Error(
      `Missing Razorpay credentials.
      KEY_ID=${keyId ? "FOUND" : "MISSING"},
      KEY_SECRET=${keySecret ? "FOUND" : "MISSING"}`
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}