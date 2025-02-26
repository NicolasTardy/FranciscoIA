import React, { useState, useRef } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const RecettesCuisine = () => {
  const router = useRouter();
  const username = typeof router.query.user === "string" ? router.query.user : "invité";

  // États pour stocker les valeurs saisies
  const [frigoItems, setFrigoItems] = useState<string[]>(Array(15).fill(""));
  const [placardItems, setPlacardItems] = useState<string[]>(Array(15).fill(""));
  const [appareilItems, setAppareilItems] = useState<string[]>(Array(3).fill(""));
  const [nombrePersonnes, setNombrePersonnes] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Référence pour le son "go.wav"
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction pour mettre à jour les champs du frigo
  const handleFrigoChange = (index: number, value: string) => {
    const newItems = [...frigoItems];
    newItems[index] = value;
    setFrigoItems(newItems);
  };

  // Fonction pour mettre à jour les champs du placard
  const handlePlacardChange = (index: number, value: string) => {
    const newItems = [...placardItems];
    newItems[index] = value;
    setPlacardItems(newItems);
  };

  // Fonction pour mettre à jour les appareils de cuisson
  const handleAppareilChange = (index: number, value: string) => {
    const newItems = [...appareilItems];
    newItems[index] = value;
    setAppareilItems(newItems);
  };

  // Fonction pour envoyer les données à l'API et obtenir une recette
  const proposeRecipe = async () => {
    // Lancer le son "go.wav" immédiatement
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Erreur de lecture du son:", error));
    }
    setLoading(true);

    // Ne conserver que les champs renseignés
    const frigoFiltered = frigoItems.filter(item => item.trim() !== "");
    const placardFiltered = placardItems.filter(item => item.trim() !== "");
    const appareilFiltered = appareilItems.filter(item => item.trim() !== "");

    // Construire le prompt en intégrant les données saisies
    const prompt = `Génère une recette simple et rapide à préparer en fonction des ingrédients disponibles.

Contraintes:
- Utilise uniquement les ingrédients fournis.
- Prends en compte les appareils de cuisson disponibles.
- La recette doit être prévue pour ${nombrePersonnes.trim() || "un nombre indéfini"} personnes.
- Donne des instructions claires et faciles à suivre.
- Propose une suggestion de présentation ou d'accompagnement si possible.

Données:
- Ingrédients du frigo: ${frigoFiltered.join(", ") || "aucun"}
- Ingrédients du placard: ${placardFiltered.join(", ") || "aucun"}
- Appareils de cuisson disponibles: ${appareilFiltered.join(", ") || "aucun"}

Réponds sous la forme suivante:
1. <b>Nom de la recette</b>
2. <b>Ingrédients avec quantités approximatives</b>
3. <b>Instructions pas à pas</b>
4. <b>Suggestion de présentation ou d’accompagnement</b>

N'utilise pas de symboles Markdown (pas de "###" ou "**") et n'utilise QUE la balise <b> pour mettre en valeur les passages importants (aucune balise de fermeture). Ajoute de nombreux emojis (ex. 🍴, 🔥, 😊, 😋, 👍) pour rendre la réponse attrayante.`;

    try {
      const response = await fetch("/api/recettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setRecipe(data.recipe);
      } else {
        console.error("Erreur de l'API :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la demande de recette :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Élement audio pour le son "go.wav" */}
      <audio ref={audioRef} src="/go.wav" preload="auto" />

      <Typography variant="h4" align="center" gutterBottom>
        Recettes de cuisine
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Bonjour {username}, je suis Francisco. Pour que je te propose une recette, indique-moi ce que tu as en stock.
      </Typography>

      {/* Section Frigo */}
      <Box sx={{ marginY: 2, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Dis-moi ce que tu as dans ton frigo (tu n’es pas obligé de remplir toutes les lignes :) :
        </Typography>
        {frigoItems.map((item, index) => (
          <TextField
            key={`frigo-${index}`}
            label={`Aliment ${index + 1}`}
            variant="outlined"
            fullWidth
            margin="dense"
            value={item}
            onChange={(e) => handleFrigoChange(index, e.target.value)}
            InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
          />
        ))}
      </Box>

      {/* Section Placard */}
      <Box sx={{ marginY: 2, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Dis-moi ce que tu as dans ton placard (tu n’es pas obligé de remplir toutes les lignes :) :
        </Typography>
        {placardItems.map((item, index) => (
          <TextField
            key={`placard-${index}`}
            label={`Aliment ${index + 1}`}
            variant="outlined"
            fullWidth
            margin="dense"
            value={item}
            onChange={(e) => handlePlacardChange(index, e.target.value)}
            InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
          />
        ))}
      </Box>

      {/* Section Appareils */}
      <Box sx={{ marginY: 2, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Dis-moi avec quoi tu peux faire cuire :
        </Typography>
        {appareilItems.map((item, index) => (
          <TextField
            key={`appareil-${index}`}
            label={`Appareil ${index + 1}`}
            variant="outlined"
            fullWidth
            margin="dense"
            value={item}
            onChange={(e) => handleAppareilChange(index, e.target.value)}
            InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
          />
        ))}
      </Box>

      {/* Section Nombre de personnes */}
      <Box sx={{ marginY: 2, maxWidth: 600, mx: "auto" }}>
        <TextField
          label="Combien êtes-vous pour déguster ?"
          variant="outlined"
          fullWidth
          margin="dense"
          type="number"
          value={nombrePersonnes}
          onChange={(e) => setNombrePersonnes(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />
      </Box>

      {/* Bouton pour envoyer la demande */}
      <Box sx={{ textAlign: "center", marginY: 2 }}>
        <Button variant="contained" color="primary" onClick={proposeRecipe} disabled={loading}>
          Propose moi une recette avec ça
        </Button>
      </Box>

      {/* Affichage du sablier pendant le chargement */}
      {loading && (
        <Box sx={{ textAlign: "center", marginY: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Affichage de la recette générée */}
      {recipe && (
        <Box sx={{ marginTop: 4, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Recette proposée :
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-line",
              color: "#000000",
              backgroundColor: "#f0f0f0",
              padding: 2,
              borderRadius: 2,
            }}
          >
            {recipe}
          </Typography>
        </Box>
      )}

      {/* Bouton de retour à l'accueil */}
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Link href={`/?user=${encodeURIComponent(username)}`} passHref legacyBehavior>
          <Button component="a" variant="outlined" color="secondary">
            Retour à l'accueil
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default RecettesCuisine;
