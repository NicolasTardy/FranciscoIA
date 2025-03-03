import React, { useState, useRef, useEffect } from "react";
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
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface ChatMessage {
  role: string;
  content: string;
}

const AideDevoirs = () => {
  const router = useRouter();
  const rawUser = router.query.user;
  const username = typeof rawUser === "string" ? rawUser : "invité";

  const [matiere, setMatiere] = useState("");
  const [niveau, setNiveau] = useState("");
  const [typeExo, setTypeExo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [styleExplication, setStyleExplication] = useState("");
  const [enonce, setEnonce] = useState("");

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Lancer la vidéo automatiquement dès que le composant est monté
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Erreur lors du démarrage automatique de la vidéo :", error);
      });
    }
  }, []);

  const sendQuestion = async () => {
    if (!enonce.trim()) return;

    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Erreur de lecture du son:", error);
      });
    }

    const newMessage: ChatMessage = { role: "user", content: enonce };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setLoading(true);

    const prompt = `
Tu es Francisco, un professeur innovant et patient. 
Tu reçois les informations suivantes :
- Matière : ${matiere || "non précisé"}
- Niveau : ${niveau || "non précisé"}
- Type d'exercice : ${typeExo || "non précisé"}
- Deadline : ${deadline || "pas d'urgence mentionnée"}
- Style d'explication souhaité : ${styleExplication || "classique"}
- Énoncé du devoir : ${enonce}

Explique la solution de façon claire et structurée. Si la matière est "Mathématiques", utilise des formules mathématiques lisibles (LaTeX ou équivalent). 
Donne éventuellement des astuces pour progresser ou des ressources supplémentaires.
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
      setEnonce(""); // Réinitialiser l'énoncé après l'envoi
    }
  };

  return (
    <MathJaxContext>
      {/* Le rectangle blanc */}
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          backgroundColor: "#f4f4f4",
          borderRadius: 2,
          color: "#000",
          mb: 8 // marge en bas pour éviter que la vidéo ne chevauche le contenu
        }}
      >
        <audio ref={audioRef} src="/parfait.mp3" preload="auto" />

        <Typography variant="h4" gutterBottom>
          Aide aux devoirs
        </Typography>
        <Typography variant="body1" gutterBottom>
          Bonjour {username}, je suis Francisco. Partage l&apos;énoncé de ton devoir, et je ferai de mon mieux pour t&apos;aider !
        </Typography>

        {/* Formulaire */}
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
              >
                <MenuItem value="">Sélectionner...</MenuItem>
                <MenuItem value="Mathématiques">Mathématiques</MenuItem>
                <MenuItem value="Français">Français</MenuItem>
                <MenuItem value="Physique-Chimie">Physique-Chimie</MenuItem>
                <MenuItem value="Langues vivantes">Langues vivantes</MenuItem>
                <MenuItem value="Histoires Géographie">Histoire ou Géographie</MenuItem>
                <MenuItem value="Autres matières">Autres matières</MenuItem>
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
              >
                <MenuItem value="">Sélectionner...</MenuItem>
                <MenuItem value="Primaire">Primaire</MenuItem>
                <MenuItem value="Collège">Collège</MenuItem>
                <MenuItem value="Lycée">Lycée</MenuItem>
                <MenuItem value="Université">Université</MenuItem>
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
              >
                <MenuItem value="">Sélectionner...</MenuItem>
                <MenuItem value="Problème">Problème</MenuItem>
                <MenuItem value="Exercice">Exercice</MenuItem>
                <MenuItem value="Dissertation">Dissertation</MenuItem>
              </TextField>
            </Grid>
            {/* Deadline */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Deadline"
                variant="outlined"
                fullWidth
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Ex: Demain, Dans 3 jours..."
              />
            </Grid>
            {/* Style d'explication */}
            <Grid item xs={12}>
              <TextField
                select
                label="Style d'explication souhaité"
                variant="outlined"
                fullWidth
                value={styleExplication}
                onChange={(e) => setStyleExplication(e.target.value)}
              >
                <MenuItem value="">Sélectionner...</MenuItem>
                <MenuItem value="Détaillé">Détaillé</MenuItem>
                <MenuItem value="Concis">Concis</MenuItem>
                <MenuItem value="Avec exemples">Avec exemples</MenuItem>
              </TextField>
            </Grid>
            {/* Énoncé */}
            <Grid item xs={12}>
              <TextField
                label="Énoncé du devoir"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={enonce}
                onChange={(e) => setEnonce(e.target.value)}
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

        {/* Affichage du chat */}
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
                {message.role === "assistant" ? (
                  <MathJax>{message.content}</MathJax>
                ) : (
                  message.content
                )}
              </Typography>
            </Box>
          ))}
          {loading && (
            <Box sx={{ textAlign: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>

        {/* Bouton retour */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Link href={`/?user=${encodeURIComponent(username)}`} passHref legacyBehavior>
            <Button component="a" variant="outlined" color="secondary">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </Box>
      </Container>

      {/* La vidéo placée en dehors du rectangle blanc, en bas à gauche et un peu plus haute */}
      <video
        ref={videoRef}
        src="/down.mp4"
        autoPlay
        muted
        playsInline
        loop
        style={{
          position: "fixed",
          bottom: "50px", // ajusté pour être plus haut
          left: "16px",
          width: "100px" // Ajustez la taille au besoin
        }}
        controls
      />
    </MathJaxContext>
  );
};

export default AideDevoirs;