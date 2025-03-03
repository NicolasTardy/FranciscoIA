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

const BienEtre = () => {
  const router = useRouter();
  const rawUser = router.query.user;
  const username = typeof rawUser === "string" ? rawUser : "invité";

  // États pour recueillir les informations liées au bien-être
  const [situation, setSituation] = useState(""); // Ex: "J'ai un conflit avec un ami", "Je cherche une idée de cadeau..."
  const [objectif, setObjectif] = useState("");  // Ex: "Résoudre le conflit", "Améliorer ma communication", ...
  const [hobbies, setHobbies] = useState("");    // Ex: "J'aime la pop music, la photographie..."
  const [budget, setBudget] = useState("");      // Pour idées de cadeau, par ex.
  const [etatEmotif, setEtatEmotif] = useState(""); // Ex: "stressé", "heureux mais en manque d'inspiration", etc.

  const [reponseBienEtre, setReponseBienEtre] = useState("");
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction pour envoyer le prompt
  const proposeIdees = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Erreur audio:", err));
    }
    setLoading(true);

    // Exemple de prompt
    const prompt = `
Tu es Francisco, un assistant bien-être qui propose des idées et du soutien dans la vie de tous les jours. 
Tu n'es pas un thérapeute professionnel, juste un ami qui donne des conseils pratiques et des pistes positives.

Informations :
- Contexte / problème : ${situation || "non précisé"}
- Objectif recherché : ${objectif || "non défini"}
- Centres d'intérêt : ${hobbies || "pas mentionné"}
- Budget ou contraintes financières : ${budget || "non précisé"}
- État émotionnel : ${etatEmotif || "inconnu"}

Propose :
1) Quelques stratégies de communication / dialogue / résolution, si c'est un conflit ou un blocage
2) Des idées de cadeau ou de surprise, si c'est pertinent
3) Des suggestions de musique, de film, ou d'autres activités, selon les goûts et le budget
4) Un message d'encouragement, rassurant, incitant au dialogue constructif

N'utilise pas de symboles Markdown. Tu peux utiliser la balise <b> (sans fermeture) pour mettre en valeur un titre ou un mot.
Ajoute des émojis adaptés (💡, 🎁, 🎶, 🎥, 🗣️, ❤️) pour rendre le message plus chaleureux.
    `;

    try {
      const response = await fetch("/api/bien-etre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error("Erreur de l'API bien-être:", response.statusText);
      }

      const data = await response.json();
      setReponseBienEtre(data.response || "Aucune suggestion reçue.");
    } catch (error) {
      console.error("Erreur lors de la demande d'aide au bien-être:", error);
    } finally {
      setLoading(false);
    }
  };

  // Styles
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
      <audio ref={audioRef} src="/down.mp3" preload="auto" />

      <Typography variant="h4" gutterBottom>
        Conseils bien-être
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Adoptez des rituels simples et efficaces pour améliorer votre quotidien et cultiver le bien-être. 
        Partagez votre situation, et je ferai de mon mieux pour proposer des pistes positives !
      </Typography>

      {/* Formulaire */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Quelle est la situation ou le problème ?"
              variant="outlined"
              fullWidth
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quel est votre objectif ?"
              variant="outlined"
              fullWidth
              value={objectif}
              onChange={(e) => setObjectif(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quels sont vos goûts (musique, films, hobbies...) ?"
              variant="outlined"
              fullWidth
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Y a-t-il un budget à respecter ?"
              variant="outlined"
              fullWidth
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comment vous sentez-vous ? (stressé, joyeux...)"
              variant="outlined"
              fullWidth
              value={etatEmotif}
              onChange={(e) => setEtatEmotif(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={proposeIdees} disabled={loading}>
            Propose-moi des pistes
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Réponse */}
      {reponseBienEtre && (
        <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Suggestions pour le bien-être :
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
            {reponseBienEtre}
          </Typography>
        </Box>
      )}

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

export default BienEtre;