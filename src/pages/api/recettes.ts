import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Le prompt est requis." });
    }

    // Enrichir le prompt avec des instructions claires pour le formatage
    const promptWithFormatting = `${prompt}

Veuillez NE PAS utiliser de symboles Markdown tels que "###", "**", etc.  
Utilisez uniquement la balise <b> (uniquement l'ouverture, sans aucune balise </b>) pour mettre en valeur les passages importants.  
N'incluez absolument aucun caractère '*' dans votre réponse.  
Ajoutez de nombreux emojis adaptés pour rendre la réponse plus engageante, par exemple 🍴, 🔥, 😊, 😋, 👍, etc.`;

    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "pixtral-12b-2409",
          messages: [{ role: "user", content: promptWithFormatting }],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });
      if (!response.ok) {
        console.error("Erreur de l'API Mistral :", response.statusText);
        return res.status(response.status).json({
          error: "Erreur lors de la génération de la recette.",
        });
      }
      const data = await response.json();
      // On suppose que la réponse a une structure similaire à celle d'OpenAI.
      const recipe = data.choices[0]?.message?.content || "Aucune recette générée.";
      res.status(200).json({ recipe });
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Mistral :", error);
      res.status(500).json({ error: "Erreur lors de la génération de la recette." });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée." });
  }
}
