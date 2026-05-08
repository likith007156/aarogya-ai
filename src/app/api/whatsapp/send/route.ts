import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const bodyJson = await req.json();
    const Body = bodyJson.Body;
    const targetNumber = bodyJson.To || bodyJson.From;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    let fromNumber = process.env.TWILIO_PHONE_NUMBER || "whatsapp:+14155238886";
    if (fromNumber && !fromNumber.startsWith("whatsapp:")) {
      fromNumber = `whatsapp:${fromNumber.startsWith('+') ? fromNumber : '+' + fromNumber}`;
    }

    let toNumber = targetNumber;
    if (toNumber && !toNumber.startsWith("whatsapp:")) {
      toNumber = `whatsapp:${toNumber.startsWith('+') ? toNumber : '+' + toNumber}`;
    }

    if (!accountSid || accountSid.length < 10 || !authToken || authToken.length < 10) {
      // Mock mode: simulate success without real Twilio credentials
      return NextResponse.json({ success: true, isMock: true, message: "Mock message sent successfully!" });
    }

    // Use Twilio REST API directly — no SDK needed, saves ~50MB bundle
    const formData = new URLSearchParams({ Body, From: fromNumber, To: toNumber });
    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    const data = await twilioRes.json();
    if (!twilioRes.ok) {
      return NextResponse.json({ success: false, error: data.message || "Twilio API error" }, { status: 400 });
    }
    return NextResponse.json({ success: true, messageSid: data.sid, isMock: false });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to send message" }, { status: 500 });
  }
}
