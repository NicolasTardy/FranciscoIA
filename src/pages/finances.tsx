import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const Finances = () => {
  const router = useRouter();
  const username = router.query.user || "invité";

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des finances
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Découvrez des conseils personnalisés pour optimiser votre budget et gérer vos finances au quotidien.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">Retour à l'accueil</Button>
      </Link>
    </Box>
  );
};

export default Finances;
