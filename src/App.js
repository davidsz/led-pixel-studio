import { useState, useContext } from "react";
import { AudioContext } from ".";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import DrawerMenuitem from "./components/DrawerMenuItem";
import TimelineTrack from "./components/TimelineTrack";
import DrawerMenu from "./components/DrawerMenu";
import { DrawerHeader } from "./components/DrawerMenu";
import TopBar from "./components/TopBar";
import Timeline from "./components/Timeline";
import { Stack } from "@mui/material";
import MediaControls from "./components/MediaControls";
import PreviewCanvas from "./components/PreviewCanvas";
import RestorePageRoundedIcon from "@mui/icons-material/RestorePageRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmDialog from "./components/ConfirmDialog";
import FileDialog from "./components/FileDialog";
import { clearProject, importImages, importMusic } from "./features/project";

function App() {
    const audioManager = useContext(AudioContext);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [music, setMusic] = useState([
        {
            id: "0",
            width: 250,
            audioURL: "sample/07023003.mp3",
            audioBuffer: null,
            waveform: null,
            length: 0,
        },
        {
            id: "1",
            width: 250,
            audioURL: "sample/Yodel_Sound_Effect.mp3",
            audioBuffer: null,
            waveform: null,
            length: 0,
        },
    ]);
    const [images, setImages] = useState([
        {
            id: "0",
            width: 300,
            imageUrl: "sample/sample1.png",
            imageObj: null,
            circularPreview: null,
        },
        {
            id: "1",
            width: 200,
            imageUrl: "sample/sample2.png",
            imageObj: null,
            circularPreview: null,
        },
        {
            id: "2",
            width: 500,
            imageUrl: "sample/sample3.png",
            imageObj: null,
            circularPreview: null,
        },
    ]);
    const [currentTime, setCurrentTime] = useState(0);

    const [openProjectOpen, setOpenProjectOpen] = useState(false);
    const [saveProjectOpen, setSaveProjectOpen] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [importPicturesOpen, setImportPicturesOpen] = useState(false);
    const [importMusicOpen, setImportMusicOpen] = useState(false);

    const handleImageLoaded = (id, image, preview) => {
        setImages((current) =>
            current.map((item) => {
                if (item.id === id)
                    return {
                        ...item,
                        imageObj: image,
                        circularPreview: preview,
                    };
                else return item;
            })
        );
    };

    const handleTimelineNavigation = (seconds, userInitiated) => {
        if (userInitiated) audioManager.seek(seconds);
        setCurrentTime(seconds);
    };

    // Calculate timeline resolution (pixel per second)
    let totalAudioLength = 0,
        totalAudioPixelLength = 0;
    music.forEach((audio) => {
        totalAudioLength += audio.length;
        totalAudioPixelLength += audio.waveform ? audio.waveform.length : 0;
    });
    const resolution = totalAudioLength > 0 ? totalAudioPixelLength / totalAudioLength : 1;

    // Determine the currently previewed image
    let t = 0,
        currentImageIndex = -1;
    for (let i = 0; i < images.length; i++) {
        let prevT = t;
        t += images[i].width / resolution;
        if (prevT <= currentTime && t > currentTime) {
            currentImageIndex = i;
            break;
        }
    }
    if (t < currentTime) currentImageIndex = -1;
    let currentImage = currentImageIndex > -1 ? images[currentImageIndex] : null;

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <TopBar title="LED Pixel Studio" drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}>
                <Stack spacing={2} direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
                    <MediaControls musicTrack={music} onNavigation={handleTimelineNavigation} />
                </Stack>
            </TopBar>
            <DrawerMenu open={drawerOpen} closeDrawer={() => setDrawerOpen(false)}>
                <List>
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Load project"}
                        icon={<RestorePageRoundedIcon />}
                        onClick={() => setOpenProjectOpen(true)}
                    />
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Save project"}
                        icon={<SaveRoundedIcon />}
                        onClick={() => setSaveProjectOpen(true)}
                    />
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Clear"}
                        icon={<RestartAltRoundedIcon />}
                        onClick={() => setResetDialogOpen(true)}
                    />
                </List>
                <Divider />
                <List>
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Import pictures"}
                        icon={<ImageRoundedIcon />}
                        onClick={() => setImportPicturesOpen(true)}
                    />
                    <DrawerMenuitem
                        open={drawerOpen}
                        text={"Import music"}
                        icon={<MusicNoteIcon />}
                        onClick={() => setImportMusicOpen(true)}
                    />
                </List>
                <Divider />
                <List>
                    <DrawerMenuitem open={drawerOpen} text={"Homepage"} icon={<HomeIcon />} />
                </List>
            </DrawerMenu>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />

                <PreviewCanvas currentImage={currentImage} imageLoaded={handleImageLoaded} />

                <Timeline
                    seconds={totalAudioLength}
                    pixelPerSecond={resolution}
                    currentTime={currentTime}
                    onNavigation={handleTimelineNavigation}>
                    <TimelineTrack type="audio" items={music} setItems={setMusic} />
                    <TimelineTrack type="image" items={images} setItems={setImages} />
                </Timeline>
            </Box>

            <FileDialog
                open={openProjectOpen}
                onAccept={() => {
                    // TODO: Implement
                }}
                onClose={() => setOpenProjectOpen(false)}
                title="Choose project to open"></FileDialog>

            <FileDialog
                open={saveProjectOpen}
                onAccept={() => {
                    // TODO: Implement
                }}
                onClose={() => setSaveProjectOpen(false)}
                title="Choose location to save the project"></FileDialog>

            <ConfirmDialog
                open={resetDialogOpen}
                onAccept={() => clearProject(setImages, setMusic)}
                onClose={() => setResetDialogOpen(false)}
                title="Are you sure you want to reset the workspace?"></ConfirmDialog>

            <FileDialog
                open={importPicturesOpen}
                accept="images"
                onAccept={(files) => importImages(files, setImages)}
                onClose={() => setImportPicturesOpen(false)}
                title="Choose images to add to the project"></FileDialog>

            <FileDialog
                open={importMusicOpen}
                accept="music"
                onAccept={(files) => importMusic(files, setMusic)}
                onClose={() => setImportMusicOpen(false)}
                title="Choose music files to add to the project"></FileDialog>
        </Box>
    );
}

export default App;
