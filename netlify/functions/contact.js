exports.handler = async function(event) {

    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse the request body
    let name, email, subject, message, recaptchaToken;
    try {
        const body = JSON.parse(event.body);
        name           = body.name;
        email          = body.email;
        subject        = body.subject;
        message        = body.message;
        recaptchaToken = body.recaptchaToken;
    } catch(e) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
    }

    // Basic validation
    if (!name || !email || !message || !recaptchaToken) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid email address" }) };
    }

    // Step 1 — Verify reCAPTCHA v3 token
    try {
        const verifyResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`,
            { method: "POST" }
        );
        const verifyData = await verifyResponse.json();

        if (!verifyData.success || verifyData.score < 0.5) {
            console.warn("reCAPTCHA failed:", verifyData);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Failed bot check. Please try again." })
            };
        }
    } catch(err) {
        console.error("reCAPTCHA error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not verify reCAPTCHA" })
        };
    }

    // Step 2 — Send email via Brevo transactional API
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: {
                    name: "Once Upon A Dice Contact Form",
                    email: "hello@onceuponadice.com"
                },
                to: [{ email: "hello@onceuponadice.com", name: "Once Upon A Dice" }],
                replyTo: { email: email, name: name },
                subject: `Contact Form: ${subject || "New Message"} — from ${name}`,
                textContent: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\n\nMessage:\n${message}`,
                htmlContent: `
                    <h2 style="font-family:Georgia,serif;color:#1a1a1a;">New Contact Form Submission</h2>
                    <table style="font-family:Arial,sans-serif;font-size:14px;color:#444;border-collapse:collapse;width:100%;max-width:600px;">
                        <tr><td style="padding:8px 12px;background:#f5f5f0;font-weight:bold;width:120px;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td></tr>
                        <tr><td style="padding:8px 12px;background:#f5f5f0;font-weight:bold;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
                        <tr><td style="padding:8px 12px;background:#f5f5f0;font-weight:bold;">Subject</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${subject || "N/A"}</td></tr>
                        <tr><td style="padding:8px 12px;background:#f5f5f0;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px 12px;">${message.replace(/\n/g, '<br>')}</td></tr>
                    </table>
                    <p style="font-family:Arial,sans-serif;font-size:12px;color:#999;margin-top:24px;">Sent from onceuponadice.com contact form</p>
                `
            })
        });

        if (response.status === 201) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true })
            };
        }

        const data = await response.json();
        console.error("Brevo send error:", data);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send message" })
        };

    } catch(err) {
        console.error("Contact function error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
};
