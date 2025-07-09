import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getURLByCode, updateClicks } from "../utils/storage";
import { logAction } from "../utils/loggerMiddleware";
import { Box, CircularProgress, Typography } from "@mui/material";

const Redirector = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const urlEntry = getURLByCode(shortCode);
    if (!urlEntry) {
      logAction("Invalid Short Code Accessed", { shortCode });
      navigate("/");
      return;
    }

    const now = new Date();
    const expiry = new Date(urlEntry.expiry);
    if (now > expiry) {
      logAction("Expired Short Code Accessed", { shortCode });
      navigate("/");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const clickData = {
          timestamp: now.toISOString(),
          source: document.referrer || "direct",
          location: `Latitude: ${latitude}, Longitude: ${longitude}`,
        };

        logAction("Redirected via Short URL", { shortCode, ...clickData });
        updateClicks(shortCode, clickData);
        setTimeout(() => {
          window.location.href = urlEntry.longUrl;
        }, 400);
      },
      () => {
        const clickData = {
          timestamp: now.toISOString(),
          source: document.referrer || "direct",
          location: "Permission denied",
        };

        logAction("Redirected via Short URL", { shortCode, ...clickData });
        updateClicks(shortCode, clickData);
        setTimeout(() => {
          window.location.href = urlEntry.longUrl;
        }, 400);
      }
    );
  }, [shortCode, navigate]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress color="primary" size={50} />
      <Typography mt={2} fontSize={16} fontWeight={500}>
        Redirecting...
      </Typography>
    </Box>
  );
};

export default Redirector;
