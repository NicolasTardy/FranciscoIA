import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Container,
  Grid
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { useRouter } from "next/router";

// *** 1) Animation des barres verticales (type ChatGPT) ***
const barWave = keyframes`
  0% { transform: scaleY(1); }
  33% { transform: scaleY(2); }
  66% { transform: scaleY(0.5); }
  100% { transform: scaleY(1); }
`;

const barCommonStyle = {
  width: "4px",
  backgroundColor: "#fff", // Les barres sont blanches
  margin: "0 2px",
  borderRadius: "2px",
  animation: `${barWave} 1s infinite ease-in-out`, // plus rapide pour être visible
  transformOrigin: "bottom",
};

// *** 2) Animation du dégradé (swirl) ***
const swirl = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// *** 3) Animation de pulsation (coeur qui bat) ***
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;

// Composant : Cercle avec dégradé, pulsation, + barres internes
const SpectrePulse = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Échec de lecture audio :", err);
      });
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        // Dégradé multiple
        background: "linear-gradient(-45deg, #2196f3, #21cbf3, #00e676, #2196f3)",
        backgroundSize: "400% 400%",
        // On combine swirl + pulse
        animation: `${swirl} 6s linear infinite, ${pulse} 2s ease-in-out infinite`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {/* Barres verticales qui bougent */}
      <Box sx={{ display: "flex", alignItems: "flex-end", height: "50px" }}>
        <Box sx={{ ...barCommonStyle, animationDelay: "0s" }} />
        <Box sx={{ ...barCommonStyle, animationDelay: ".2s" }} />
        <Box sx={{ ...barCommonStyle, animationDelay: ".4s" }} />
        <Box sx={{ ...barCommonStyle, animationDelay: ".6s" }} />
      </Box>

      <audio ref={audioRef} src="/go.wav" preload="auto" />
    </Box>
  );
};

// Thèmes
interface Theme {
  id: string;
  title: string;
  description: string;
}

const themes: Theme[] = [
  {
    id: "aide-devoirs",
    title: "Aide aux devoirs",
    description: "Je transforme vos devoirs en une aventure d'apprentissage !"
  },
  {
    id: "recettes-cuisine",
    title: "Recettes de cuisine",
    description: "Je vous aide à créer des plats surprenants avec ce que vous avez."
  },
  {
    id: "loisirs-weekend",
    title: "Loisirs week-end",
    description: "Je vous propose des idées pour des week-ends inoubliables."
  },
  {
    id: "vacances",
    title: "Planification de vacances",
    description: "Je construis des voyages sur mesure pour des vacances riches en découvertes."
  },
  {
    id: "finances",
    title: "Gestion des finances",
    description: "Je vous conseille pour optimiser votre budget au quotidien."
  },
  {
    id: "assistant-sportif",
    title: "Assistant sportif",
    description: "Je vous motive pour intégrer le sport même quand le temps manque."
  },
  {
    id: "rendez-vous-medical",
    title: "Rendez-vous médical",
    description: "Je vous aide à organiser et suivre vos consultations."
  },
  {
    id: "bien-etre",
    title: "Conseils bien-être",
    description: "Je vous offre des conseils pour améliorer votre quotidien."
  }
];

const IndexPage = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleThemeClick = (id: string): void => {
    if (!username.trim()) {
      alert("Merci de renseigner votre pseudo !");
      return;
    }
    router.push(`/${id}?user=${encodeURIComponent(username)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Titre & sous-titre */}
      <Typography variant="h3" align="center" gutterBottom>
        Bienvenue sur Francisco‑IA !
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Je suis Francisco, votre assistant inclus dans votre offre DartyMax Intégral.
        Posez-moi vos questions et je ferai de mon mieux pour vous aider !
      </Typography>

      {/* Cercle pulsant + Vidéo côte à côte */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 3, mb: 5 }}
      >
        <Grid item>
          <SpectrePulse />
        </Grid>

        <Grid item>
          <Box
            sx={{
              width: "150px",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            <video
              src="/franciscohero.mp4"
              autoPlay
              muted
              loop
              style={{
                width: "100%",
                height: "auto",
                display: "block"
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Champ pseudo */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <TextField
          placeholder="Votre pseudo"
          aria-label="Votre pseudo"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            maxWidth: 300,
            width: "100%",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              color: "black"
            }
          }}
        />
      </Box>

      {/* Thèmes en grille */}
      <Typography variant="h5" align="center" gutterBottom>
        Choisissez un thème pour commencer :
      </Typography>
      <Grid container spacing={2}>
        {themes.map((theme) => (
          <Grid item xs={12} sm={6} md={3} key={theme.id}>
            <Paper
              sx={{
                padding: 2,
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer"
              }}
              elevation={3}
              onClick={() => handleThemeClick(theme.id)}
            >
              <Typography variant="h6">{theme.title}</Typography>
              <Typography variant="body2">{theme.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default IndexPage;