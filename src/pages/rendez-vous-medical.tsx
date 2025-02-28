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

  // États pour recueillir les infos
  const [professionnel, setProfessionnel] = useState(""); // ex: généraliste, dentiste, ophtalmo, etc.
  const [localisation, setLocalisation] = useState("");   // ex: "Paris 12e"
  const [disponibilites, setDisponibilites] = useState(""); // ex: "Plutôt en soirée, en semaine"
  const [motif, setMotif] = useState(""); // ex: "contrôle annuel", "douleurs dentaires", etc.
  const [assurance, setAssurance] = useState(""); // ex: "Mutuelle X, carte vitale", etc.

  // Réponse de l'API
  const [suggestionRDV, setSuggestionRDV] = useState("");
  const [loading, setLoading] = useState(false);

  // Son
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction d'envoi
  const proposeRdv = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Erreur audio:", err));
    }
    setLoading(true);

    const prompt = `
Tu es Francisco, un assistant qui aide à planifier un rendez-vous médical, sans donner de conseils de santé ou de diagnostic.
Voici les informations :
- Type de professionnel recherché : ${professionnel || "non précisé"}
- Lieu souhaité : ${localisation || "non précisé"}
- Disponibilités : ${disponibilites || "non précisées"}
- Motif principal du rendez-vous : ${motif || "non précisé"}
- Informations d'assurance ou mutuelle : ${assurance || "non précisé"}

Propose :
1) Le type de docteur adapté à la situation (si différent de celui indiqué)
2) Les créneaux ou options possibles (journées/horaires) 
3) Les éventuels papiers ou documents à apporter (ordonnances, carte vitale, etc.)
4) Les questions à poser au professionnel pour clarifier le motif 
5) Rappelle que ce n'est pas un diagnostic ni un avis médical, juste une aide pour organiser le RDV

N'utilise pas de symboles Markdown. Tu peux utiliser la balise <b> (sans fermeture) pour souligner un titre ou un mot.
Ajoute des emojis adaptés (🏥, 📅, 🩺...) si tu veux rendre le texte plus convivial.
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

  // Styles pour TextField
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
      <audio ref={audioRef} src="/go.wav" preload="auto" />

      <Typography variant="h4" gutterBottom>
        Rendez-vous médical
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Organisez et suivez vos consultations pour une gestion simplifiée
        de votre santé. Je ne donne pas de conseils médicaux, mais je peux t&apos;aider à préparer ton RDV.
      </Typography>

      {/* Formulaire */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Type de professionnel (généraliste, dentiste...)"
              variant="outlined"
              fullWidth
              value={professionnel}
              onChange={(e) => setProfessionnel(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Localisation (ville, arrondissement...)"
              variant="outlined"
              fullWidth
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Disponibilités (ex: soirées, WE...)"
              variant="outlined"
              fullWidth
              value={disponibilites}
              onChange={(e) => setDisponibilites(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Motif (ex: contrôle annuel, douleurs, etc.)"
              variant="outlined"
              fullWidth
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Assurance ou mutuelle (ex: carte vitale, mutuelle X...)"
              variant="outlined"
              fullWidth
              value={assurance}
              onChange={(e) => setAssurance(e.target.value)}
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

export default RendezVousMedical;