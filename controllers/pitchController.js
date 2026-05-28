const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generatePitch = async (req, res) => {
  const { name, category, city, hasWebsite, rating, service } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Write a short, personalized cold outreach message (WhatsApp/SMS style, max 100 words) for a web developer reaching out to this business:

Business name: ${name}
Category: ${category}
City: ${city}
Has website: ${hasWebsite ? "Yes" : "No"}
Rating: ${rating > 0 ? rating + "/5" : "Unknown"}
Service to pitch: ${service || "Website & online presence"}

Rules:
- Sound human, friendly, not salesy
- Mention their business name
- If no website, highlight the opportunity
- End with a simple call to action
- No subject line, no formal greeting, just the message body`,
        },
      ],
    });

    const pitch = completion.choices[0]?.message?.content || "";
    res.json({ pitch });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { generatePitch };
