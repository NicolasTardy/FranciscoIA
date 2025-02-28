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

const LoisirsWeekend = () => {
  const router = useRouter();
  const username = typeof router.query.user === "string" ? router.query.user : "invité";

  // États
  const [nombre, setNombre] = useState("");
  const [enfants, setEnfants] = useState("");
  const [adolescents, setAdolescents] = useState("");
  const [mobility, setMobility] = useState("");
  const [activite, setActivite] = useState("");
  const [ville, setVille] = useState("");
  const [sportif, setSportif] = useState("");

  // Suggestion renvoyée par l'API
  const [sortieSuggestion, setSortieSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  // Référence pour jouer un son
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction pour proposer une sortie
  const proposeSortie = async () => {
    // Jouer le son "go.wav"
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Erreur de lecture du son:", error);
      });
    }
    setLoading(true);

    const prompt = `Génère quelques idées de sorties à faire le week-end en fonction des réponses suivantes :

- Nombre de personnes : ${nombre}
- Enfants de moins de 5 ans : ${enfants}
- Adolescents : ${adolescents}
- Personnes à mobilité réduite : ${mobility}
- Activité (gratuite ou payante) : ${activite}
- Ville : ${ville}
- Sortie sportive ? (oui/non) : ${sportif}

Réponds sous la forme suivante :
1. <b>Nom de la sortie
2. <b>Description de l'activité
3. <b>Pourquoi cette sortie est adaptée (ajoute des emojis adaptés)

N'utilise pas de symboles Markdown (pas de "###" ou "**") et n'utilise QUE la balise <b>.`;

    try {
      const response = await fetch("/api/loisirs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setSortieSuggestion(data.response || "Aucune suggestion générée.");
      } else {
        console.error("Erreur de l'API :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la demande de suggestion :", error);
    } finally {
      setLoading(false);
    }
  };

  // Styles pour les TextField
  const textFieldStyles = {
    "& .MuiInputLabel-root": {
      color: "#000", // label noir
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff", // champs blancs
      "& fieldset": {
        borderColor: "#aaa", // gris clair au repos
      },
      "&:hover fieldset": {
        borderColor: "#000", // au survol, bordure noire
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2196f3", // au focus, bordure bleue
      },
      "& input": {
        color: "#000", // texte saisi en noir
      },
    },
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        backgroundColor: "#f4f4f4",
        borderRadius: 2,
        color: "#000" // Texte global en noir
      }}
    >
      {/* Son go.wav */}
      <audio ref={audioRef} src="/go.wav" preload="auto" />

      <Typography variant="h4" align="center" gutterBottom>
        Loisirs Week-end
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Bonjour {username}, je suis Francisco. Réponds aux questions ci-dessous pour trouver la sortie idéale !
      </Typography>

      {/* Formulaire */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Combien êtes-vous ?"
              variant="outlined"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Y a-t-il des enfants de moins de 5 ans ? (oui/non)"
              variant="outlined"
              fullWidth
              value={enfants}
              onChange={(e) => setEnfants(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Y a-t-il des adolescents ? (oui/non)"
              variant="outlined"
              fullWidth
              value={adolescents}
              onChange={(e) => setAdolescents(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Personnes à mobilité réduite ? (oui/non)"
              variant="outlined"
              fullWidth
              value={mobility}
              onChange={(e) => setMobility(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Activité gratuite ou payante ?"
              variant="outlined"
              fullWidth
              value={activite}
              onChange={(e) => setActivite(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ville concernée ?"
              variant="outlined"
              fullWidth
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Sortie sportive ? (oui/non)"
              variant="outlined"
              fullWidth
              value={sportif}
              onChange={(e) => setSportif(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={proposeSortie} disabled={loading}>
            Propose-moi une sortie
          </Button>
        </Box>
      </Box>

      {/* Chargement */}
      {loading && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Résultat */}
      {sortieSuggestion && (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Suggestions de sorties :
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
            {sortieSuggestion}
          </Typography>
        </Box>
      )}

      {/* Bouton de retour */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Link href={`/?user=${encodeURIComponent(username)}`} passHref legacyBehavior>
          <Button component="a" variant="outlined" color="secondary">
            Retour à l&apos;accueil
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default LoisirsWeekend;