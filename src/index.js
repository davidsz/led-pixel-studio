import { createContext } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import singletonAudioManager from "./features/AudioManager";
import App from "./App";

const theme = createTheme({
    _drawerWidth: 240,
    palette: {
        _cursorColor: "maroon",
        _timetrackColor: "#778899",
        _trackItemColor: "#5F9EA0",
        _imageResizeHandleColor: "black",

        mode: "dark",
        primary: {
            main: "#1B1D23",
        },
        secondary: {
            main: "#0288d1",
        },
        background: {
            default: "#121212",
            paper: "#1B1D23",
        },
        text: {
            primary: "#72d2f7",
        },
    },
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
