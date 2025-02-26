import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "'messages' est requis et doit être un tableau." });
  }

  // Ajoute un message système indiquant le format attendu
  const newMessages = [
    {
      role: "system",
      content:
        "Ne pas utiliser de symboles Markdown (ex. ### ou **). Utilisez uniquement la balise <b> pour mettre en gras (sans fermeture). Ajoutez des emojis adaptés (ex. 🍴, 🔥, 😊).",
    },
    ...messages,
  ];

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409",
        messages: newMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    if (!response.ok) {
      console.error("Erreur de l'API Mistral :", response.statusText);
      return res.status(response.status).json({ error: "Erreur lors de la génération de la réponse." });
    }
    const data = await response.json();
    return res.status(200).json({ response: data.choices[0]?.message || {} });
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Mistral :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
