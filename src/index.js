import { createContext } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import singletonAudioManager from "./features/AudioManager";
import App from "./App";

const theme = createTheme({
    _drawerWidth: 240,
});

export const AudioContext = createContext();

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <ThemeProvider theme={theme}>
        <AudioContext.Provider value={singletonAudioManager}>
            <App />
        </AudioContext.Provider>
    </ThemeProvider>
);
