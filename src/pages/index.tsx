import React, { useState, useRef } from "react";
import { Box, Typography, Paper, TextField } from "@mui/material";
import Grid from "@mui/material/Grid"; // Composant Grid de MUI
import { useRouter } from "next/router";
import { keyframes } from "@emotion/react";

// Animation pour représenter Francisco par un spectre animé
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

// Composant Spectre modifié pour jouer le son lors du clic
const Spectre = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    // Lancer la lecture du son quand l'utilisateur clique sur le spectre
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("La lecture du son a échoué :", error);
      });
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "linear-gradient(45deg, #2196f3, #21cbf3)",
        animation: `${pulse} 2s infinite`,
        margin: "20px auto",
        cursor: "pointer"
      }}
    >
      <audio ref={audioRef} src="/francisco.wav" preload="auto" />
    </Box>
  );
};

interface Theme {
  id: string;
  title: string;
  description: string;
}

// Définition des 8 thèmes
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
    description: "Je vous propose des idées pour des week-ends en famille inoubliables."
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
    description: "Je vous offre des conseils pour améliorer votre quotidien et cultiver le bien-être."
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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Bienvenue sur Francisco‑IA !
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Je suis Francisco, votre assistant inclus dans votre offre DartyMax Intégral. Posez-moi vos questions et je ferai de mon mieux pour vous aider !
      </Typography>
      
      {/* Spectre animé incarnant Francisco avec son son */}
      <Spectre />
      
      {/* Champ pour renseigner le pseudo avec texte noir sur fond blanc */}
      <Box sx={{ textAlign: "center", marginBottom: 2 }}>
        <TextField
          placeholder="Votre pseudo"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ maxWidth: 300, margin: "0 auto", display: "block" }}
          InputProps={{
            sx: { color: "black", backgroundColor: "white" }
          }}
        />
      </Box>

      {/* Affichage des 8 blocs thématiques */}
      <Box sx={{ marginTop: 4 }}>
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
      </Box>
    </Box>
  );
};

export default IndexPage;
