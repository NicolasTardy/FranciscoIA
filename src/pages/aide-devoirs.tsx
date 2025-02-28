import React, { useState, useRef } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

interface ChatMessage {
  role: string;
  content: string;
}

const AideDevoirs = () => {
  const router = useRouter();
  const username = typeof router.query.user === "string" ? router.query.user : "invité";

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Référence pour l'élément audio
  const audioRef = useRef<HTMLAudioElement>(null);

  const sendQuestion = async () => {
    if (!userInput.trim()) return;

    // Lancer le son "go.wav" dès que la requête est lancée
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Erreur lors de la lecture du son :", error);
      });
    }

    // Ajout du message utilisateur dans l'historique
    const newMessage: ChatMessage = { role: "user", content: userInput };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...updatedHistory,
            {
              role: "system",
              content:
                `Tu es Francisco, un professeur innovant et patient. Explique de façon claire et structurée en utilisant des exemples concrets issus de la vie quotidienne. Ne présente pas la réponse avec des caractères Markdown (n&apos;envoie pas de "###" ou "**"). Si possible, propose un lien vers une ressource vidéo explicative.`,
            },
          ],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = data.response;
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

  return (
    <Box sx={{ padding: 4 }}>
      {/* Élement audio pour le son "go.wav" */}
      <audio ref={audioRef} src="/go.wav" preload="auto" />

      <Typography variant="h4" gutterBottom>
        Aide aux devoirs
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}, je suis Francisco. Pose-moi une question sur tes devoirs et je ferai de mon mieux pour t&apos;aider !
      </Typography>

      {/* Affichage de l'historique du chat */}
      <Box sx={{ marginY: 4 }}>
        {chatHistory.map((message, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography align={message.role === "user" ? "right" : "left"}>
              <strong>{message.role === "user" ? username : "Francisco"} :</strong>
            </Typography>
            <Typography
              align={message.role === "user" ? "right" : "left"}
              sx={{
                whiteSpace: "pre-line",
                backgroundColor: message.role === "user" ? "#f0f0f0" : "#e3f2fd",
                color: "#000",
                padding: 1,
                borderRadius: 2,
              }}
            >
              {message.content}
            </Typography>
          </Box>
        ))}
        {loading && (
          <Box sx={{ textAlign: "center", marginY: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Pour aller à la ligne, utilisez Shift + Entrée.
        </Typography>
      </Box>

      {/* Zone de saisie pour poser la question */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pose ta question ici..."
          value={userInput}
          multiline
          minRows={3}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendQuestion();
            }
          }}
          inputProps={{
            style: { color: "#000000", backgroundColor: "#FFFFFF" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#000000",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2196f3",
              },
            },
          }}
        />
        <Button variant="contained" color="primary" onClick={sendQuestion} disabled={loading}>
          Envoyer
        </Button>
      </Box>

      {/* Bouton de retour à l'accueil */}
      <Box sx={{ marginTop: 4 }}>
        <Link href={`/?user=${encodeURIComponent(username)}`} passHref legacyBehavior>
          <Button component="a" variant="outlined" color="secondary">
            Retour à l&apos;accueil
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default AideDevoirs;