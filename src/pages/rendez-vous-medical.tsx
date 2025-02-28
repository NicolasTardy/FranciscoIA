import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const RendezVousMedical = () => {
  const router = useRouter();
  const username = router.query.user || "invité";

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rendez-vous médical
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Organisez et suivez vos consultations pour une gestion simplifiée de votre santé.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Retour à l&apos;accueil
        </Button>
      </Link>
    </Box>
  );
};

export default RendezVousMedical;