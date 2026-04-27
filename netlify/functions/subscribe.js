exports.handler = async function(event) {

    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse the request body
    let email, recaptchaToken;
    try {
        const body = JSON.parse(event.body);
        email = body.email;
        recaptchaToken = body.recaptchaToken;
    } catch(e) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
    }

    if (!email || !recaptchaToken) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid email address" }) };
    }

    // Step 1 — Verify reCAPTCHA token with Google
    try {
        const verifyResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`,
            { method: "POST" }
        );
        const verifyData = await verifyResponse.json();

        // v3 returns a score 0.0 - 1.0. Below 0.5 is likely a bot
        if (!verifyData.success || verifyData.score < 0.5) {
            console.warn("reCAPTCHA failed:", verifyData);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Failed bot check. Please try again." })
            };
        }
    } catch(err) {
        console.error("reCAPTCHA verification error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not verify reCAPTCHA" })
        };
    }

    // Step 2 — Add contact to Brevo
    try {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email: email,
                listIds: [4],
                updateEnabled: true
            })
        });

        // 201 = created, 204 = already exists — both are success
        if (response.status === 201 || response.status === 204) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true })
            };
        }

        const data = await response.json();
        console.error("Brevo error:", data);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Subscription failed" })
        };

    } catch(err) {
        console.error("Brevo API error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
};
