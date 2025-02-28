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

const Finances = () => {
  const router = useRouter();

  // Gérer le type de user
  const rawUser = router.query.user;
  const username = typeof rawUser === "string" ? rawUser : "invité";

  // Champs pour recueillir des infos financières
  const [revenus, setRevenus] = useState("");
  const [depenses, setDepenses] = useState("");
  const [objectifEpargne, setObjectifEpargne] = useState("");
  const [dette, setDette] = useState("");
  const [niveauRisque, setNiveauRisque] = useState(""); // "faible", "modéré", "élevé", etc.

  // Réponse de l'API
  const [planFinancier, setPlanFinancier] = useState("");
  const [loading, setLoading] = useState(false);

  // Son
  const audioRef = useRef<HTMLAudioElement>(null);

  // Prompt finances
  const genererConseils = async () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Erreur audio:", err));
    }

    setLoading(true);

    const prompt = `
Tu es Francisco, un conseiller financier bienveillant, patient et clair. 
Voici les informations :
- Revenu mensuel : ${revenus || "non renseigné"}
- Dépenses mensuelles : ${depenses || "non renseigné"}
- Objectif d'épargne ou de placement : ${objectifEpargne || "non défini"}
- Montant ou nature de la dette : ${dette || "aucune"}
- Tolérance au risque : ${niveauRisque || "faible"}

Propose un plan budgétaire simple :
1) Répartition des dépenses
2) Conseils pour réduire les coûts superflus
3) Stratégie d'épargne ou d'investissement (selon le niveau de risque)
4) Conseils concrets (ex: automatiser l'épargne, ajuster le logement, etc.)
5) Projections approximatives dans le temps (ex: combien économiser en X mois)

N'utilise pas de symboles Markdown. Tu peux utiliser la balise <b> (sans fermeture) pour mettre en relief un titre ou un mot-clé.
Ajoute des emojis adaptés (💰, 🏠, 📉, 📈...) pour rendre le discours plus engageant.
    `;

    try {
      const response = await fetch("/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error("Erreur de l'API Finances:", response.statusText);
      }

      const data = await response.json();
      setPlanFinancier(data.response || "Aucune réponse reçue.");
    } catch (error) {
      console.error("Erreur lors de la demande de plan financier:", error);
    } finally {
      setLoading(false);
    }
  };

  // Style des champs
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
        Gestion des finances
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Découvrez des conseils personnalisés pour optimiser votre budget
        et gérer vos finances au quotidien.
      </Typography>

      {/* Formulaire */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Revenu mensuel (ex: 2500€)"
              variant="outlined"
              fullWidth
              value={revenus}
              onChange={(e) => setRevenus(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dépenses mensuelles (ex: 1800€)"
              variant="outlined"
              fullWidth
              value={depenses}
              onChange={(e) => setDepenses(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Objectif d'épargne ou de placement (ex: 100€ / mois, 5000€ d'invest...)"
              variant="outlined"
              fullWidth
              value={objectifEpargne}
              onChange={(e) => setObjectifEpargne(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dette ? (ex: prêt étudiant, crédit conso...)"
              variant="outlined"
              fullWidth
              value={dette}
              onChange={(e) => setDette(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tolérance au risque (faible, modérée, élevée...)"
              variant="outlined"
              fullWidth
              value={niveauRisque}
              onChange={(e) => setNiveauRisque(e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={genererConseils} disabled={loading}>
            Obtenir un plan financier
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {planFinancier && (
        <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Plan proposé :
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-line",
              backgroundColor: "#f0f0f0",
              p: 2,
              borderRadius: 2
            }}
          >
            {planFinancier}
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

export default Finances;