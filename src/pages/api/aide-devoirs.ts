import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  // On ajoute un message spécifique pour supprimer Markdown et caractères
  const promptWithFormatting = `${prompt}

Veuillez NE PAS utiliser de symboles Markdown tels que ###, **, *, etc.
N'utilisez aucune forme d'astérisque ou de dièse dans votre réponse.
Utilisez uniquement la balise <b> (sans fermeture) pour mettre en relief les passages importants.
Ajoutez autant d'émojis pertinents que possible (ex: 📚, 📝, 😊, 📖, etc.) pour illustrer le propos.
`;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}` // Assurez-vous d'avoir votre clé d'API
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409",
        messages: [{ role: "user", content: promptWithFormatting }],
        max_tokens: 700,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error("Erreur de l'API Mistral :", response.statusText);
      return res.status(response.status).json({ error: "Erreur lors de la génération." });
    }

    const data = await response.json();
    let contenu = data.choices?.[0]?.message?.content || "Aucune réponse générée.";

    // Optionnel : on peut nettoyer le contenu pour supprimer d'éventuels restes de * ou #
    contenu = contenu.replace(/[*#]+/g, "");

    return res.status(200).json({ response: contenu });
  } catch (error) {
    console.error("Erreur interne AideDevoirs Mistral AI :", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}