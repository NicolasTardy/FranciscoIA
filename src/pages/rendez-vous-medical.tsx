import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
  Grid
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const RendezVousMedical = () => {
  const router = useRouter();
  const rawUser = router.query.user;
  const username = typeof rawUser === "string" ? rawUser : "invité";

  // États pour recueillir les informations du nouveau questionnaire
  const [symptoms, setSymptoms] = useState("");
  const [ville, setVille] = useState("");
  const [delais, setDelais] = useState("");

  // Réponse de l'API
  const [suggestionRDV, setSuggestionRDV] = useState("");
  const [loading, setLoading] = useState(false);

  // Référence pour le son
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction d'envoi de la demande
  const proposeRdv = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) =>
        console.error("Erreur audio:", err)
      );
    }
    setLoading(true);

    const prompt = `
Tu es Francisco, un assistant pour organiser un rendez-vous médical.
Voici les informations du patient :
- Symptômes ou douleurs : ${symptoms || "non précisé"}
- Ville souhaitée pour consulter : ${ville || "non précisée"}
- Délai souhaité : ${delais || "non précisé"}

En fonction de ces informations, indique :
1) La spécialité médicale à consulter (même si différente des symptômes indiqués).
2) Quelques liens pour trouver un spécialiste dans la ville indiquée, y compris un lien vers Doctolib.
3) Si les symptômes suggèrent une urgence, fournis les numéros d’urgence correspondant à la localisation du patient.

N'utilise pas de symboles Markdown et n'utilise que la balise <b> (sans fermeture) pour souligner les titres.
Ajoute des emojis adaptés (🏥, 📅, 🚑, etc.) pour rendre le texte plus convivial.
`;

    try {
      const response = await fetch("/api/rendez-vous-medical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error("Erreur de l'API RDV médical:", response.statusText);
      }

      const data = await response.json();
      setSuggestionRDV(data.response || "Aucune suggestion reçue.");
    } catch (error) {
      console.error("Erreur lors de la demande de RDV:", error);
    } finally {
      setLoading(false);
    }
  };

  // Styles pour les TextField
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#aaa" },
      "&:hover fieldset": { borderColor: "#000" },
      "&.Mui-focused fieldset": { borderColor: "#2196f3" },
      "& input": { color: "#000" },
    },
    "& .MuiInputLabel-root": { color: "#000" },
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        backgroundColor: "#f4f4f4",
        borderRadius: 2,
        color: "#000"
      }}
    >
      <audio ref={audioRef} src="/parfait.mp3" preload="auto" />

      <Typography variant="h4" gutterBottom>
        Rendez-vous médical
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Organisez vos consultations pour un rendez-vous bien préparé.
        Je ne donne pas de conseils médicaux, mais je peux vous aider à organiser votre RDV en recueillant quelques informations.
      </Typography>

      {/* Formulaire */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Où avez-vous mal ou quels sont vos symptômes ?"
              variant="outlined"
              fullWidth
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dans quelle ville souhaitez-vous consulter ?"
              variant="outlined"
              fullWidth
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Sous quels délais ?"
              variant="outlined"
              fullWidth
              value={delais}
              onChange={(e) => setDelais(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={proposeRdv} disabled={loading}>
            Propose-moi un RDV
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {suggestionRDV && (
        <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Suggestion de RDV :
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
            {suggestionRDV}
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
  );
};

export default RendezVousMedical;