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

const AssistantSportif = () => {
  const router = useRouter();
  const rawUser = router.query.user;
  const username = typeof rawUser === "string" ? rawUser : "invité";

  // États pour recueillir les infos sportives
  const [objectif, setObjectif] = useState(""); // exemple: "Perdre 5kg", "Gagner en endurance"
  const [niveau, setNiveau] = useState("");    // "Débutant", "Intermédiaire", "Avancé"
  const [frequence, setFrequence] = useState(""); // "3 fois/semaine", "Tous les jours", ...
  const [temps, setTemps] = useState(""); // "30 minutes", "1 heure", ...
  const [materiel, setMateriel] = useState(""); // "tapis de yoga, haltères, élastiques..."
  const [contraintes, setContraintes] = useState(""); // "Mal de dos", "Genou fragile", etc.
  
  // Réponse de l'API
  const [programme, setProgramme] = useState("");
  const [loading, setLoading] = useState(false);

  // Son
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction d'envoi du prompt
  const genereProgramme = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Erreur audio:", err));
    }
    setLoading(true);

    const prompt = `
Tu es Francisco, un coach sportif bienveillant. 
Voici les informations :
- Objectif : ${objectif || "non défini"}
- Niveau actuel : ${niveau || "inconnu"}
- Fréquence d'entraînement souhaitée : ${frequence || "non précisé"}
- Temps disponible par séance : ${temps || "non précisé"}
- Matériel disponible : ${materiel || "aucun matériel spécial"}
- Contraintes physiques : ${contraintes || "aucune"}

Propose un programme d'entraînement adapté, en précisant :
1) Échauffement
2) Exercices (avec variations selon le niveau)
3) Étirements finaux
4) Conseils d'hydratation et de nutrition
5) Encouragement et progression dans le temps

N'utilise pas de symboles Markdown. Tu peux utiliser la balise <b> (sans fermeture) pour souligner certaines parties. 
Ajoute des emojis adaptés (🏋️, 🤸, 🏃, 🍏...) pour illustrer les exercices.
    `;

    try {
      const response = await fetch("/api/assistant-sportif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error("Erreur de l'API Sportif:", response.statusText);
      }
      const data = await response.json();
      setProgramme(data.response || "Aucun plan reçu.");
    } catch (error) {
      console.error("Erreur lors de la demande de programme sportif:", error);
    } finally {
      setLoading(false);
    }
  };

  // Styles pour champs
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#aaa" },
      "&:hover fieldset": { borderColor: "#000" },
      "&.Mui-focused fieldset": { borderColor: "#2196f3" },
      "& input, & textarea": { color: "#000" },
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
        Assistant sportif
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Intégrez le sport dans votre quotidien grâce à un programme express
        conçu pour s&apos;adapter à vos contraintes.
      </Typography>

      {/* Formulaire */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Votre objectif sportif"
              variant="outlined"
              fullWidth
              value={objectif}
              onChange={(e) => setObjectif(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Niveau actuel (débutant, intermédiaire, avancé...)"
              variant="outlined"
              fullWidth
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fréquence souhaitée (ex: 3 fois/semaine)"
              variant="outlined"
              fullWidth
              value={frequence}
              onChange={(e) => setFrequence(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Temps dispo par séance (ex: 30 min, 1h)"
              variant="outlined"
              fullWidth
              value={temps}
              onChange={(e) => setTemps(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Matériel disponible (ex: tapis, haltères...)"
              variant="outlined"
              fullWidth
              value={materiel}
              onChange={(e) => setMateriel(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contraintes ou blessures"
              variant="outlined"
              fullWidth
              value={contraintes}
              onChange={(e) => setContraintes(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={genereProgramme}
            disabled={loading}
          >
            Obtenir un programme
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {programme && (
        <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Programme sportif :
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
            {programme}
          </Typography>
        </Box>
      )}

      {/* Retour */}
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

export default AssistantSportif;