import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  const promptWithFormatting = `${prompt}

Veuillez NE PAS utiliser de symboles Markdown (###, **, etc.). 
N'insérez aucun caractère '*' ni '#'.
Utilisez seulement <b> (sans la fermer) pour mettre en relief un mot ou un titre.
Ajoutez des émojis liés au domaine médical ou à la planification (🏥, 📅, 🩺, etc.) pour rendre le texte plus chaleureux.
`;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409",
        messages: [{ role: "user", content: promptWithFormatting }],
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      console.error("Erreur de l'API Mistral :", response.statusText);
      return res.status(response.status).json({ error: "Erreur lors de la génération." });
    }

    const data = await response.json();
    let contenu = data.choices?.[0]?.message?.content || "Aucune suggestion reçue.";

    // Retirer d'éventuels caractères interdits
    contenu = contenu.replace(/[*#]+/g, "");

    res.status(200).json({ response: contenu });
  } catch (error) {
    console.error("Erreur interne rendez-vous médical:", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}