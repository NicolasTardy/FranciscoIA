import React, { useState, useRef } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const LoisirsWeekend = () => {
  const router = useRouter();
  const username = typeof router.query.user === "string" ? router.query.user : "invité";

  // États pour les réponses aux questions
  const [nombre, setNombre] = useState("");
  const [enfants, setEnfants] = useState("");
  const [adolescents, setAdolescents] = useState("");
  const [mobility, setMobility] = useState("");
  const [activite, setActivite] = useState("");
  const [ville, setVille] = useState("");
  const [sportif, setSportif] = useState("");

  // État pour la suggestion de sortie
  const [sortieSuggestion, setSortieSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  // Référence de l'élément audio pour le son "go.wav"
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction pour envoyer la requête API et obtenir des suggestions
  const proposeSortie = async () => {
    // Lancer le son "go.wav" dès le lancement de la requête
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Erreur de lecture du son:", error);
      });
    }

    setLoading(true);

    // Construction du prompt avec les réponses de l'utilisateur
    const prompt = `Génère quelques idées de sorties à faire le week-end en fonction des réponses suivantes :

- Nombre de personnes : ${nombre}
- Enfants de moins de 5 ans : ${enfants}
- Adolescents : ${adolescents}
- Personnes à mobilité réduite : ${mobility}
- Activité souhaitée (gratuite ou payante) : ${activite}
- Ville recherchée : ${ville}
- Sortie sportive ? (oui/non) : ${sportif}

Réponds sous la forme suivante :
1. <b>Nom de la sortie</b>
2. <b>Description de l'activité</b>
3. <b>Pourquoi cette sortie est adaptée</b> (ajoute des emojis adaptés, par exemple 😊, 👍, 🎉, etc.)

N'utilise pas de symboles Markdown (pas de "###" ou "**") et n'utilise QUE la balise <b> (sans fermeture) pour mettre en valeur les passages importants.`;

    try {
      const response = await fetch("/api/loisirs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setSortieSuggestion(data.response || "Aucune suggestion générée.");
      } else {
        console.error("Erreur de l'API :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la demande de suggestion :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Element audio pour le son go.wav */}
      <audio ref={audioRef} src="/go.wav" preload="auto" />

      <Typography variant="h4" align="center" gutterBottom>
        Loisirs Week-end
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Bonjour {username}, je suis Francisco. Réponds aux questions ci-dessous pour trouver la sortie idéale à faire le week-end !
      </Typography>

      {/* Section des questions */}
      <Box sx={{ maxWidth: 600, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Combien êtes-vous ?"
          variant="outlined"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />
        <TextField
          label="Y a-t-il des enfants de moins de 5 ans ? (oui/non)"
          variant="outlined"
          fullWidth
          value={enfants}
          onChange={(e) => setEnfants(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />
        <TextField
          label="Y a-t-il des adolescents ? (oui/non)"
          variant="outlined"
          fullWidth
          value={adolescents}
          onChange={(e) => setAdolescents(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />
        <TextField
          label="Y a-t-il des personnes à mobilité réduite ? (oui/non)"
          variant="outlined"
          fullWidth
          value={mobility}
          onChange={(e) => setMobility(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />
        <TextField
          label="Voulez-vous une activité gratuite ou payante ?"
          variant="outlined"
          fullWidth
          value={activite}
          onChange={(e) => setActivite(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />
        <TextField
          label="Aux alentours de quelle ville voulez-vous trouver cette sortie ?"
          variant="outlined"
          fullWidth
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />
        <TextField
          label="Faut-il que la sortie soit sportive ? (oui/non)"
          variant="outlined"
          fullWidth
          value={sportif}
          onChange={(e) => setSportif(e.target.value)}
          InputProps={{ style: { color: "#000000", backgroundColor: "#FFFFFF" } }}
        />

        <Button variant="contained" color="primary" onClick={proposeSortie} disabled={loading}>
          Propose moi une sortie avec ça
        </Button>
      </Box>

      {/* Affichage d'un sablier pendant le chargement */}
      {loading && (
        <Box sx={{ textAlign: "center", marginY: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Affichage de la suggestion */}
      {sortieSuggestion && (
        <Box sx={{ maxWidth: 600, mx: "auto", marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            Suggestions de sorties :
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-line",
              color: "#000000",
              backgroundColor: "#f0f0f0",
              padding: 2,
              borderRadius: 2,
            }}
          >
            {sortieSuggestion}
          </Typography>
        </Box>
      )}

      {/* Bouton de retour */}
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Link href={`/?user=${encodeURIComponent(username)}`} passHref legacyBehavior>
          <Button component="a" variant="outlined" color="secondary">
            Retour à l'accueil
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default LoisirsWeekend;
