import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material";

import { isValidURL, isAlphanumeric, isInteger } from "../utils/validators";
import { generateShortCode } from "../utils/urlUtils";
import { saveURL, getAllURLs } from "../utils/storage";
import { logAction } from "../utils/loggerMiddleware";
import URLCard from "./URLCard";

const MAX_ENTRIES = 5;

const URLForm = () => {
  const [entries, setEntries] = useState(
    Array.from({ length: MAX_ENTRIES }, () => ({
      longUrl: "",
      validity: "",
      customCode: "",
      errors: {},
    }))
  );

  const [results, setResults] = useState([]);
  const theme = useTheme();

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    newEntries[index].errors[field] = ""; // Reset field error
    setEntries(newEntries);
  };

  const validateEntry = ({ longUrl, validity, customCode }) => {
    const errors = {};

    if (!longUrl || !isValidURL(longUrl)) {
      errors.longUrl = "Please enter a valid URL (must start with http/https)";
    }

    if (validity && !isInteger(validity)) {
      errors.validity = "Validity must be a number (in minutes)";
    }

    if (customCode && !isAlphanumeric(customCode)) {
      errors.customCode = "Shortcode must be alphanumeric";
    }

    return errors;
  };

  const handleSubmit = () => {
    const newResults = [];
    const updatedEntries = [...entries];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const errors = validateEntry(entry);

      if (Object.keys(errors).length > 0) {
        updatedEntries[i].errors = errors;
        continue;
      }

      const existing = getAllURLs();

      let shortCode = entry.customCode?.trim() || generateShortCode();

      // Ensure shortcode uniqueness
      while (existing.find((item) => item.shortCode === shortCode)) {
        shortCode = generateShortCode();
      }

      const createdAt = new Date();
      const expiry =
        entry.validity?.trim() !== ""
          ? new Date(createdAt.getTime() + parseInt(entry.validity) * 60000)
          : new Date(createdAt.getTime() + 30 * 60000);

      const newEntry = {
        longUrl: entry.longUrl.trim(),
        shortCode,
        createdAt: createdAt.toISOString(),
        expiry: expiry.toISOString(),
        clicks: [],
      };

      
      saveURL(newEntry);
      logAction("Shortened URL", newEntry);

      newResults.push(newEntry);
      updatedEntries[i] = {
        longUrl: "",
        validity: "",
        customCode: "",
        errors: {},
      };
    }

    setResults([...results, ...newResults]);
    setEntries(updatedEntries);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: 3,
      }}
    >
      <Box
        maxWidth="1000px"
        width="100%"
        mx="auto"
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 600, mb: 3 }}
        >
          🔗 Shorten Your URLs
        </Typography>
  
        <Grid container spacing={3}>
          {entries.map((entry, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    URL #{index + 1}
                  </Typography>
  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <TextField
                        label="Long URL"
                        fullWidth
                        variant="outlined"
                        value={entry.longUrl}
                        onChange={(e) =>
                          handleChange(index, "longUrl", e.target.value)
                        }
                        error={!!entry.errors.longUrl}
                        helperText={entry.errors.longUrl}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Validity (minutes)"
                        fullWidth
                        variant="outlined"
                        value={entry.validity}
                        onChange={(e) =>
                          handleChange(index, "validity", e.target.value)
                        }
                        error={!!entry.errors.validity}
                        helperText={entry.errors.validity}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Custom Shortcode"
                        fullWidth
                        variant="outlined"
                        value={entry.customCode}
                        onChange={(e) =>
                          handleChange(index, "customCode", e.target.value)
                        }
                        error={!!entry.errors.customCode}
                        helperText={entry.errors.customCode}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
  
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: theme.shadows[3],
              "&:hover": {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            🚀 Shorten URLs
          </Button>
        </Box>
  
        {results.length > 0 && (
          <Box mt={5}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              🔍 Shortened Results
            </Typography>
            {results.map((res, idx) => (
              <URLCard key={idx} {...res} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
  
};

export default URLForm;
