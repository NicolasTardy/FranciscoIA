import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Container,
  Grid
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const RecettesCuisine = () => {
  const router = useRouter();
  const username = typeof router.query.user === "string" ? router.query.user : "invité";

  // État pour stocker les saisies
  const [frigoItems, setFrigoItems] = useState<string[]>(Array(5).fill(""));
  const [placardItems, setPlacardItems] = useState<string[]>(Array(5).fill(""));
  const [nombrePersonnes, setNombrePersonnes] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Référence pour le son
  const audioRef = useRef<HTMLAudioElement>(null);

  // Gestion frigo
  const handleFrigoChange = (index: number, value: string) => {
    const newItems = [...frigoItems];
    newItems[index] = value;
    setFrigoItems(newItems);
  };

  // Gestion placard
  const handlePlacardChange = (index: number, value: string) => {
    const newItems = [...placardItems];
    newItems[index] = value;
    setPlacardItems(newItems);
  };

  // Génération de la recette
  const proposeRecipe = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) =>
        console.error("Erreur de lecture du son:", error)
      );
    }
    setLoading(true);

    const frigoFiltered = frigoItems.filter((item) => item.trim() !== "");
    const placardFiltered = placardItems.filter((item) => item.trim() !== "");

    const prompt = `Génère une recette simple et rapide à préparer en fonction des ingrédients disponibles.

Contraintes:
- Utilise uniquement les ingrédients fournis.
- La recette doit être prévue pour ${nombrePersonnes.trim() || "un nombre indéfini"} personnes.
- Donne des instructions claires et faciles à suivre.
- Propose une suggestion de présentation ou d'accompagnement si possible.

Données:
- Ingrédients du frigo: ${frigoFiltered.join(", ") || "aucun"}
- Ingrédients du placard: ${placardFiltered.join(", ") || "aucun"}

Réponds sous la forme suivante:
1. <b>Nom de la recette
2. <b>Ingrédients avec quantités approximatives
3. <b>Instructions pas à pas
4. <b>Suggestion de présentation ou d’accompagnement

N'utilise pas de symboles Markdown (pas de "###" ou "**") et n'utilise QUE la balise <b> (sans fermeture). Ajoute des emojis (🍴, 🔥, 😊, 😋, 👍).`;

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

  // Styles pour les TextField : fond blanc, texte noir, label noir
  const textFieldStyles = {
    "& .MuiInputLabel-root": {
      color: "#000", // label en noir
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff", // champ en blanc
      "& fieldset": {
        borderColor: "#aaa", // gris clair
      },
      "&:hover fieldset": {
        borderColor: "#000", // survol noir
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2196f3", // focus bleu
      },
      "& input": {
        color: "#000", // texte en noir
      }
    },
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          mb: 8, // marge en bas pour éviter le chevauchement avec la vidéo
          backgroundColor: "#f4f4f4",
          borderRadius: 2,
          color: "#000",
        }}
      >
        {/* Audio pour le son */}
        <audio ref={audioRef} src="/parfait.mp3" preload="auto" />

        <Typography variant="h4" align="center" gutterBottom>
          Recettes de cuisine
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Bonjour {username}, je suis Francisco. Indiquez-moi ce que vous avez en stock dans votre frigo et vos placards... Pas la peine de tout mettre si vous voulez gagner du temps :
        </Typography>

        <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
          {/* Ingrédients du frigo */}
          <Typography variant="h6" gutterBottom>
            Ingrédients du frigo :
          </Typography>
          <Grid container spacing={2}>
            {frigoItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={`frigo-${index}`}>
                <TextField
                  label={`Aliment ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={item}
                  onChange={(e) => handleFrigoChange(index, e.target.value)}
                  sx={textFieldStyles}
                />
              </Grid>
            ))}
          </Grid>

          {/* Ingrédients du placard */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Ingrédients du placard :
          </Typography>
          <Grid container spacing={2}>
            {placardItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={`placard-${index}`}>
                <TextField
                  label={`Aliment ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={item}
                  onChange={(e) => handlePlacardChange(index, e.target.value)}
                  sx={textFieldStyles}
                />
              </Grid>
            ))}
          </Grid>

          {/* Nombre de personnes */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Nombre de personnes :
          </Typography>
          <TextField
            label="Combien êtes-vous pour déguster ?"
            variant="outlined"
            fullWidth
            type="number"
            value={nombrePersonnes}
            onChange={(e) => setNombrePersonnes(e.target.value)}
            sx={textFieldStyles}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={proposeRecipe} disabled={loading}>
              Propose-moi une recette
            </Button>
          </Box>
        </Box>

        {/* Sablier si on attend la réponse */}
        {loading && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Affichage de la recette */}
        {recipe && (
          <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" gutterBottom>
              Recette proposée :
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-line",
                backgroundColor: "#f0f0f0",
                p: 2,
                borderRadius: 2,
              }}
            >
              {recipe}
            </Typography>
          </Box>
        )}

        {/* Bouton de retour à l'accueil */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Link href={`/?user=${encodeURIComponent(username)}`} passHref legacyBehavior>
            <Button component="a" variant="outlined" color="secondary">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </Box>
      </Container>

      {/* Intégration de la vidéo "meal.mp4" en bas à gauche, en dehors du rectangle */}
      <video
        src="/meal.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          bottom: "16px", // ajustez si nécessaire pour aligner avec le bas du rectangle blanc
          left: "16px",
          width: "200px"
        }}
        controls
      />
    </>
  );
};

export default RecettesCuisine;