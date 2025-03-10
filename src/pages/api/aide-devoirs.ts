import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("Erreur de l'API Mistral :", response.statusText);
      return res.status(response.status).json({ error: "Erreur lors de la génération." });
    }

    const data = await response.json();
    let contenu = data.choices?.[0]?.message?.content || "";

    // Si la matière est Mathématiques, ajouter une note sur LaTeX
    if (prompt.includes("Matière : Mathématiques")) {
      contenu += "\n\nNote : Les formules ci-dessus sont écrites en LaTeX pour faciliter leur lecture.";
    }

    return res.status(200).json({ response: contenu });
  } catch (error) {
    console.error("Erreur interne AideDevoirs Mistral AI :", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}
