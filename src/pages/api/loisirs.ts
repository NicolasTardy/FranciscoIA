import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai"; // Vous pouvez adapter pour Mistral ou autre API

const openai = new OpenAI({
  apiKey: process.env.MISTRAL_API_KEY, // Ou une autre clé, selon votre intégration
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Le prompt est requis." });
    }
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "pixtral-12b-2409",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });
      if (!response.ok) {
        console.error("Erreur de l'API Mistral :", response.statusText);
        return res.status(response.status).json({ error: "Erreur lors de la génération des suggestions." });
      }
      const data = await response.json();
      const suggestions = data.choices[0]?.message?.content || "Aucune idée trouvée.";
      res.status(200).json({ response: suggestions });
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée." });
  }
}
