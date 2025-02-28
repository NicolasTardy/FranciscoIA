import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const BienEtre = () => {
  const router = useRouter();
  const username = router.query.user || "invité";

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Conseils bien-être
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bonjour {username}! Adoptez des rituels simples et efficaces pour améliorer votre quotidien et cultiver le bien-être.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Retour à l&apos;accueil
        </Button>
      </Link>
    </Box>
  );
};

export default BienEtre;