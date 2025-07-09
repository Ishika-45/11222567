// src/components/URLCard.jsx
import { Card, CardContent, Typography, Box, Link } from "@mui/material";
import React from "react";

const URLCard = ({ shortCode, longUrl, expiry, createdAt }) => {
  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
        <Typography variant="subtitle1">
          <strong>Original URL:</strong> {longUrl}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Short URL:</strong>{" "}
          <Link
            href={`http://localhost:3000/${shortCode}`}
            target="_blank"
            rel="noreferrer"
          >
            http://localhost:3000/{shortCode}
          </Link>
        </Typography>
        <Box mt={1}>
          <Typography variant="body2">
            <strong>Created At:</strong> {new Date(createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Expires At:</strong> {new Date(expiry).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default URLCard;
