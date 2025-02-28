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

const Vacances = () => {
  const router = useRouter();

  // Vérifie si router.query.user est un tableau ou une chaîne
  // Si c'est un tableau ou undefined, on met "invité"
  const rawUser = router.query.user;
  const username = typeof rawUser === "string" ? rawUser : "invité";

  // État du formulaire
  const [destination, setDestination] = useState("");
  const [nbJours, setNbJours] = useState("");
  const [nbPersonnes, setNbPersonnes] = useState("");
  const [budget, setBudget] = useState("");
  const [typeVoyage, setTypeVoyage] = useState(""); // ex: "Balnéaire", "Culturel", "Montagne", etc.
  const [besoinsSpeciaux, setBesoinsSpeciaux] = useState(""); // ex: "Accessibilité PMR", "Chiens acceptés", ...
  
  // Réponse de l'API
  const [planVacances, setPlanVacances] = useState("");
  const [loading, setLoading] = useState(false);

  // Pour jouer un son
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction d'envoi du prompt
  const genereItineraire = async () => {
    // Lecture du son
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Erreur audio:", err));
    }

    setLoading(true);

    // Construction du prompt
    const prompt = `
Génère un itinéraire de vacances à ${destination} pour ${nbPersonnes || "un certain nombre de"} personnes. 
Durée: ${nbJours || "un nombre indéfini"} jours.
Budget: ${budget || "non précisé"}.
Type de voyage souhaité: ${typeVoyage || "non défini"}.
Contraintes ou besoins spéciaux: ${besoinsSpeciaux || "aucun"}.

Donne des idées d'activités, d'hébergements, et de transports pour chaque jour.
Sois rassurant, et ajoute quelques conseils sur la culture locale ou la gastronomie. 
Propose un coût approximatif et le matériel recommandé (valises, vêtements, etc.).
N'utilise pas de symboles Markdown. Utilise seulement la balise <b> (sans fermeture) si tu veux mettre en relief un titre ou un mot.
Ajoute des emojis adaptés (⛵, ✈️, 🏝️, etc.) quand tu décris les activités.
    `;

    try {
      const response = await fetch("/api/vacances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error("Erreur de l'API Vacances:", response.statusText);
      }

      const data = await response.json();
      setPlanVacances(data.response || "Aucune suggestion reçue.");
    } catch (error) {
      console.error("Erreur lors de la demande d'itinéraire:", error);
    } finally {
      setLoading(false);
    }
  };

  // Styles pour champs de texte
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
        Planification de vacances
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Créez des voyages sur mesure et planifiez des vacances
        remplies d&apos;aventures et de découvertes.
      </Typography>

      {/* Formulaire */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Destination"
              variant="outlined"
              fullWidth
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre de jours"
              variant="outlined"
              fullWidth
              type="number"
              value={nbJours}
              onChange={(e) => setNbJours(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre de personnes"
              variant="outlined"
              fullWidth
              type="number"
              value={nbPersonnes}
              onChange={(e) => setNbPersonnes(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Budget (ex: 2000€)"
              variant="outlined"
              fullWidth
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Type de voyage (mer, montagne, culturel...)"
              variant="outlined"
              fullWidth
              value={typeVoyage}
              onChange={(e) => setTypeVoyage(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Besoins spéciaux ? (animaux, PMR...)"
              variant="outlined"
              fullWidth
              value={besoinsSpeciaux}
              onChange={(e) => setBesoinsSpeciaux(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        {/* Bouton */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={genereItineraire} disabled={loading}>
            Génère mon itinéraire
          </Button>
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Affichage du résultat */}
      {planVacances && (
        <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Itinéraire proposé :
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
            {planVacances}
          </Typography>
        </Box>
      )}

      {/* Retour accueil */}
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

export default Vacances;