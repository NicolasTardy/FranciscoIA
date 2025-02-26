import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const Vacances = () => {
  const router = useRouter();
  const username = router.query.user || "invité";

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Planification de vacances
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Créez des voyages sur mesure et planifiez des vacances remplies d'aventures et de découvertes.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">Retour à l'accueil</Button>
      </Link>
    </Box>
  );
};

export default Vacances;
