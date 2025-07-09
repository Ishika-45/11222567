import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link as RouterLink } from "react-router-dom";

const Navbar = ({ toggleTheme, currentTheme }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Stats", to: "/stats" },
  ];

  return (
    <>
      <AppBar position="static" elevation={3}>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            URL Shortener
          </Typography>

          {!isMobile &&
            navLinks.map((item, index) => (
              <Button
                key={index}
                component={RouterLink}
                to={item.to}
                color="inherit"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

          <Tooltip title="Toggle Theme">
            <IconButton color="inherit" onClick={toggleTheme}>
              {currentTheme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {isMobile && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 200 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    {navLinks.map((item, index) => (
                      <ListItem
                        button
                        component={RouterLink}
                        to={item.to}
                        key={index}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
