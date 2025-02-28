import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const AssistantSportif = () => {
  const router = useRouter();
  const username = router.query.user || "invité";

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assistant sportif
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Intégrez le sport dans votre quotidien grâce à des séances express conçues pour s&apos;adapter à votre emploi du temps chargé.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Retour à l&apos;accueil
        </Button>
      </Link>
    </Box>
  );
};

export default AssistantSportif;