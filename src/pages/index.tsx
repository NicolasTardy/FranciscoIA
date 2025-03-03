import React, { useState, useRef, JSX } from "react";
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

// Import des icônes Material UI pour chaque thème
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WeekendIcon from '@mui/icons-material/Weekend';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SpaIcon from '@mui/icons-material/Spa';
// Import des icônes pour l'état sonore
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

// *** Animation des barres verticales ***
const barWave = keyframes`
  0% { transform: scaleY(1); }
  33% { transform: scaleY(2); }
  66% { transform: scaleY(0.5); }
  100% { transform: scaleY(1); }
`;

const barCommonStyle = {
  width: "4px",
  backgroundColor: "#fff",
  margin: "0 2px",
  borderRadius: "2px",
  animation: `${barWave} 1s infinite ease-in-out`,
  transformOrigin: "bottom",
};

// *** Animation du dégradé ***
const swirl = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// *** Animation de pulsation ***
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;

// Composant : Cercle pulsant avec animation, son et icône indicatrice
const SpectrePulse = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        position: "relative",
        width: { xs: 60, sm: 80 },
        height: { xs: 60, sm: 80 },
        borderRadius: "50%",
        background: "linear-gradient(-45deg, #2196f3, #21cbf3, #00e676, #2196f3)",
        backgroundSize: "400% 400%",
        animation: `${swirl} 6s linear infinite, ${pulse} 2s ease-in-out infinite`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-end", height: "50px" }}>
        <Box sx={{ ...barCommonStyle, animationDelay: "0s" }} />
        <Box sx={{ ...barCommonStyle, animationDelay: ".2s" }} />
        <Box sx={{ ...barCommonStyle, animationDelay: ".4s" }} />
        <Box sx={{ ...barCommonStyle, animationDelay: ".6s" }} />
      </Box>

      {/* Audio avec écouteurs d'événements pour mettre à jour l'état */}
      <audio
        ref={audioRef}
        src="/francisco.mp3"
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Icône indiquant l'état sonore avec une couleur noire pour une meilleure visibilité */}
      <Box
        sx={{
          position: "absolute",
          bottom: 4,
          right: 4,
          bgcolor: "rgba(255,255,255,0.7)",
          borderRadius: "50%",
          padding: "2px",
        }}
      >
        {isPlaying ? (
          <VolumeUpIcon fontSize="small" sx={{ color: "#000" }} />
        ) : (
          <VolumeOffIcon fontSize="small" sx={{ color: "#000" }} />
        )}
      </Box>
    </Box>
  );
};

// Définition des thèmes
interface Theme {
  id: string;
  title: string;
  description: string;
}

const themes: Theme[] = [
  { id: "aide-devoirs", title: "Aide aux devoirs", description: "Je transforme vos devoirs en une aventure d'apprentissage !" },
  { id: "recettes-cuisine", title: "Recettes de cuisine", description: "Je vous aide à créer des plats surprenants avec ce que vous avez." },
  { id: "loisirs-weekend", title: "Loisirs week-end", description: "Je vous propose des idées pour des week-ends inoubliables." },
  { id: "vacances", title: "Planification de vacances", description: "Je construis des voyages sur mesure pour des vacances riches en découvertes." },
  { id: "finances", title: "Gestion des finances", description: "Je vous conseille pour optimiser votre budget au quotidien." },
  { id: "assistant-sportif", title: "Assistant sportif", description: "Je vous motive pour intégrer le sport même quand le temps manque." },
  { id: "rendez-vous-medical", title: "Rendez-vous médical", description: "Je vous aide à organiser et suivre vos consultations." },
  { id: "bien-etre", title: "Conseils bien-être", description: "Je vous offre des conseils pour améliorer votre quotidien." }
];

const IndexPage = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const soundRef = useRef<HTMLAudioElement>(null);

  // Mapping des icônes par thème
  const icons: { [key: string]: JSX.Element } = {
    "aide-devoirs": <SchoolIcon fontSize="large" />,
    "recettes-cuisine": <RestaurantIcon fontSize="large" />,
    "loisirs-weekend": <WeekendIcon fontSize="large" />,
    "vacances": <AirplanemodeActiveIcon fontSize="large" />,
    "finances": <AttachMoneyIcon fontSize="large" />,
    "assistant-sportif": <FitnessCenterIcon fontSize="large" />,
    "rendez-vous-medical": <LocalHospitalIcon fontSize="large" />,
    "bien-etre": <SpaIcon fontSize="large" />,
  };

  const handleThemeClick = (id: string): void => {
    if (!username.trim()) {
      alert("Merci de renseigner votre pseudo !");
      return;
    }
    if (soundRef.current) {
      soundRef.current.play().catch((err) =>
        console.error("Erreur de lecture audio :", err)
      );
    }
    router.push(`/${id}?user=${encodeURIComponent(username)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Titre & sous-titre */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}
      >
        Bienvenue
      </Typography>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        Je suis Francisco, votre assistant personnel inclus dans votre offre
        DartyMax Intégral. Posez-moi vos questions et je ferai de mon mieux pour
        vous aider !
      </Typography>

      {/* Cercle pulsant + Vidéo côte à côte (stackés sur mobile) */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{
          mt: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 5 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Grid item>
          <SpectrePulse />
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: { xs: "120px", sm: "150px" },
              borderRadius: 2,
              overflow: "hidden",
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
                display: "block",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Champ pseudo */}
      <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 4 } }}>
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
              color: "black",
            },
          }}
        />
      </Box>

      {/* Thèmes en grille */}
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        Choisissez un thème pour commencer :
      </Typography>
      <Grid container spacing={2}>
        {themes.map((theme) => (
          <Grid item xs={12} sm={6} md={3} key={theme.id}>
            <Paper
              onClick={() => handleThemeClick(theme.id)}
              sx={{
                padding: 2,
                height: { xs: 130, sm: 150 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                cursor: "pointer",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                },
              }}
              elevation={3}
            >
              <Box sx={{ mb: 1 }}>{icons[theme.id]}</Box>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
              >
                {theme.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                {theme.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Audio pour le son « parfait.mp3 » (caché) */}
      <audio ref={soundRef} src="/parfait.mp3" preload="auto" />
    </Container>
  );
};

export default IndexPage;