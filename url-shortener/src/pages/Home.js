import React from "react";
import URLForm from "../components/URLForm";
import { Container, Typography } from "@mui/material";

function Home() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <URLForm />
    </Container>
  );
}

export default Home;