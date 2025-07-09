import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { getAllURLs } from "../utils/storage";
import { logAction } from "../utils/loggerMiddleware";

const Stats = () => {
  const [urls, setUrls] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const data = getAllURLs();
    setUrls(data);
    logAction("Viewed Stats Page", { count: data.length });
  }, []);

  return (
    <Box
      p={3}
      maxWidth="1000px"
      mx="auto"
      sx={{
        color: theme.palette.text.primary,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 4,
          color: theme.palette.primary.main,
        }}
      >
        📊 URL Statistics
      </Typography>

      {urls.length === 0 ? (
        <Typography variant="body1" align="center">
          No shortened URLs found.
        </Typography>
      ) : (
        urls.map((url, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : theme.palette.grey[100],
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, flexGrow: 1 }}
              >
                🔗 {url.shortCode} — {url.clicks.length} Click
                {url.clicks.length !== 1 && "s"}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography variant="body2" gutterBottom>
                <strong>Original URL:</strong> {url.longUrl}
              </Typography>

              <Typography variant="body2" gutterBottom>
                <strong>Short URL:</strong>{" "}
                <Link
                  href={`http://localhost:3000/${url.shortCode}`}
                  target="_blank"
                  rel="noopener"
                >
                  http://localhost:3000/{url.shortCode}
                </Link>
              </Typography>

              <Typography variant="body2">
                <strong>Created:</strong>{" "}
                {new Date(url.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Expires:</strong>{" "}
                {new Date(url.expiry).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, mb: 1 }}
              >
                Click History ({url.clicks.length}):
              </Typography>

              {url.clicks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No clicks recorded yet.
                </Typography>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[850]
                        : theme.palette.grey[50],
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <List dense>
                    {url.clicks.map((click, idx) => (
                      <ListItem key={idx} divider>
                        <ListItemText
                          primary={`📍 Clicked on ${new Date(
                            click.timestamp
                          ).toLocaleString()}`}
                          secondary={`Source: ${click.source} | Location: ${click.location}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
      
  <button
    onClick={() => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete all shortened URLs?"
      );
      if (confirmDelete) {
        localStorage.removeItem("shortenedURLs");
        setUrls([]);
        logAction("Deleted All Shortened Links", {});
      }
    }}
    style={{
      backgroundColor: theme.palette.error.main,
      color: "#fff",
      border: "none",
      margin:"20px",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    }}
  >
    Delete All
  </button>

    </Box>
  );
};

export default Stats;
