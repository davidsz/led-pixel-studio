import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";

const theme = createTheme({
    _drawerWidth: 240,
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);
