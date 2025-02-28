import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
  Grid,
  MenuItem
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

interface ChatMessage {
  role: string;
  content: string;
}

const AideDevoirs = () => {
  const router = useRouter();
  const rawUser = router.query.user;
  const username = typeof rawUser === "string" ? rawUser : "invité";

  // Champs supplémentaires
  const [matiere, setMatiere] = useState(""); // ex: "Mathématiques", "Français", "Physique"
  const [niveau, setNiveau] = useState(""); // ex: "Collège", "Lycée", "Université"
  const [typeExo, setTypeExo] = useState(""); // ex: "Problème", "Dissertation", "Exercice rapide"
  const [deadline, setDeadline] = useState(""); // ex: "Demain", "Ce week-end", ...
  const [styleExplication, setStyleExplication] = useState(""); // ex: "Très détaillé", "Synthétique", ...
  const [enonce, setEnonce] = useState(""); // l'énoncé du devoir

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Pour jouer le son go.wav
  const audioRef = useRef<HTMLAudioElement>(null);

  const sendQuestion = async () => {
    if (!enonce.trim()) return; // on exige au moins un énoncé

    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Erreur de lecture du son:", error);
      });
    }

    // Ajoute le message utilisateur dans l'historique
    const newMessage: ChatMessage = { role: "user", content: enonce };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setEnonce("");
    setLoading(true);

    // Préparation du prompt
    const prompt = `
Tu es Francisco, un professeur innovant et patient. 
Tu reçois les informations suivantes :
- Matière : ${matiere || "non précisé"}
- Niveau : ${niveau || "non précisé"}
- Type d'exercice : ${typeExo || "non précisé"}
- Deadline : ${deadline || "pas d'urgence mentionnée"}
- Style d'explication souhaité : ${styleExplication || "classique"}
- Énoncé du devoir : ${newMessage.content}

Explique la solution de façon claire et structurée, avec des exemples concrets. 
Donne éventuellement des astuces pour progresser, ou des ressources supplémentaires (sans Markdown). 
Si possible, propose un lien vers une ressource vidéo explicative, ou une référence de livre.
N'utilise pas de symboles Markdown (ex: "###", "**"). Tu peux utiliser la balise <b> (sans fermeture) pour mettre en relief un mot-clé. 
`;

    try {
      const response = await fetch("/api/aide-devoirs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
        };
        setChatHistory([...updatedHistory, assistantMessage]);
      } else {
        console.error("Erreur de l'API :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
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
      "& input, & textarea": { color: "#000" }
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
        Aide aux devoirs
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}, je suis Francisco. Partage l&apos;énoncé de ton devoir, et je ferai de mon mieux pour t&apos;aider, 
        en m&apos;adaptant à ta matière, ton niveau et tes contraintes !
      </Typography>

      {/* Formulaire pour recueillir des infos */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          {/* Matière */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Matière"
              variant="outlined"
              fullWidth
              value={matiere}
              onChange={(e) => setMatiere(e.target.value)}
              sx={textFieldStyles}
            >
              <MenuItem value="">Sélectionner...</MenuItem>
              <MenuItem value="Mathématiques">Mathématiques</MenuItem>
              <MenuItem value="Français">Français</MenuItem>
              <MenuItem value="Physique-Chimie">Physique-Chimie</MenuItem>
              <MenuItem value="Histoire-Géo">Histoire-Géo</MenuItem>
              <MenuItem value="Langues">Langues</MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </TextField>
          </Grid>

          {/* Niveau */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Niveau"
              variant="outlined"
              fullWidth
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              sx={textFieldStyles}
            >
              <MenuItem value="">Sélectionner...</MenuItem>
              <MenuItem value="Primaire">Primaire</MenuItem>
              <MenuItem value="Collège">Collège</MenuItem>
              <MenuItem value="Lycée">Lycée</MenuItem>
              <MenuItem value="Université">Université</MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </TextField>
          </Grid>

          {/* Type d'exercice */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Type d'exercice"
              variant="outlined"
              fullWidth
              value={typeExo}
              onChange={(e) => setTypeExo(e.target.value)}
              sx={textFieldStyles}
            >
              <MenuItem value="">Sélectionner...</MenuItem>
              <MenuItem value="Problème">Problème</MenuItem>
              <MenuItem value="Dissertation">Dissertation</MenuItem>
              <MenuItem value="Exercice classique">Exercice classique</MenuItem>
              <MenuItem value="Révision">Révision</MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </TextField>
          </Grid>

          {/* Deadline */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Deadline (ex: demain, dans 3 jours...)"
              variant="outlined"
              fullWidth
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>

          {/* Style d'explication */}
          <Grid item xs={12}>
            <TextField
              select
              label="Style d'explication"
              variant="outlined"
              fullWidth
              value={styleExplication}
              onChange={(e) => setStyleExplication(e.target.value)}
              sx={textFieldStyles}
            >
              <MenuItem value="">Sélectionner...</MenuItem>
              <MenuItem value="Très détaillé">Très détaillé</MenuItem>
              <MenuItem value="Synthétique">Synthétique</MenuItem>
              <MenuItem value="Avec exemples du quotidien">Avec exemples du quotidien</MenuItem>
              <MenuItem value="Focus sur la méthodologie">Focus sur la méthodologie</MenuItem>
            </TextField>
          </Grid>

          {/* Énoncé du devoir */}
          <Grid item xs={12}>
            <TextField
              label="Énonce ton devoir ici"
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              value={enonce}
              onChange={(e) => setEnonce(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        {/* Bouton d'envoi */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={sendQuestion} disabled={loading}>
            Obtenir mon aide
          </Button>
        </Box>
      </Box>

      {/* Affichage de l'historique du chat */}
      <Box sx={{ mt: 4 }}>
        {chatHistory.map((message, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Typography align={message.role === "user" ? "right" : "left"}>
              <strong>{message.role === "user" ? username : "Francisco"} :</strong>
            </Typography>
            <Typography
              align={message.role === "user" ? "right" : "left"}
              sx={{
                whiteSpace: "pre-line",
                backgroundColor: message.role === "user" ? "#f0f0f0" : "#e3f2fd",
                color: "#000",
                p: 1,
                borderRadius: 2
              }}
            >
              {message.content}
            </Typography>
          </Box>
        ))}
        {loading && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>

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

export default AideDevoirs;