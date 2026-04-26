exports.handler = async function(event) {

    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse the email from the request body
    let email;
    try {
        const body = JSON.parse(event.body);
        email = body.email;
    } catch(e) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
    }

    if (!email) {
        return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid email address" }) };
    }

    // Call Brevo API
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
                updateEnabled: true  // Updates contact if they already exist
            })
        });

        // 201 = created, 204 = already exists (both are fine)
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
        console.error("Function error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
};
