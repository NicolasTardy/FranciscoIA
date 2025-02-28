import type { NextApiRequest, NextApiResponse } from "next";

// handler = fonction gérant la requête
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // On n’accepte que les requêtes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  // Récupération du prompt depuis le body
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  try {
    // Appel à l’API Mistral
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Clé d'API stockée dans vos variables d'environnement
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409", // ou autre nom de modèle si nécessaire
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error("Erreur de l'API Mistral :", response.statusText);
      return res.status(response.status).json({ error: "Erreur lors de la génération." });
    }

    // Parsing de la réponse JSON
    const data = await response.json();

    // Récupération du texte généré
    const suggestions = data.choices?.[0]?.message?.content || "Aucune proposition reçue.";

    return res.status(200).json({ response: suggestions });
  } catch (error) {
    console.error("Erreur interne Mistral AI :", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}