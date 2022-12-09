import { CircularProgress, ListItemIcon, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useId, useState } from "react";
import { initializeAudio, drawWaveform } from "../features/audio";
import { makeElementResizable } from "../features/util";
import { drawCircularPreview, resizeAsCanvas } from "../features/drawing";
import { Menu, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { _previewSize } from "..";

const TrackItemOuter = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "stretch",
    position: "relative",
    marginRight: "0px",
    backgroundColor: theme.palette._trackItemColor,
}));

const ImagePreview = styled("div")(({ theme }) => ({
    width: "100%",
    backgroundRepeat: "repeat-x",
}));

const ImageResizeHandle = styled("div")(({ theme }) => ({
    width: "7px",
    flexShrink: 0,
    backgroundColor: theme.palette._imageResizeHandleColor,
    borderRight: "#778899 2px solid",
    borderLeft: "#778899 2px solid",
    cursor: "col-resize",
}));

const AudioPreview = styled("canvas")(({ theme }) => ({
    width: "100%",
    height: "64px",
    borderRight: "black 1px solid",
}));

const AudioPlaceholder = styled("div")(({ theme }) => ({
    width: "100%",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "black 1px solid",
    backgroundColor: "white",
}));

function TimelineTrackItem({
    itemData,
    type,
    pixelCount,
    onResizeEnd,
    onImageInitialized,
    onAudioInitialized,
    onItemRemove,
    dndProvided,
    dndSnapshot,
}) {
    const isImage = type === "image";
    const isAudio = type === "audio";
    const id = useId();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        let element = document.getElementById(id);
        if (isImage) {
            let handle = document.getElementById(`${id}-handle`);
            makeElementResizable(element, handle, {
                horizontal: true,
                doneCallback: (width) => {
                    onResizeEnd(width);
                },
            });

            const image = new Image();
            image.onload = () => {
                const imageCanvas = resizeAsCanvas(image, pixelCount);
                const previewCanvas = new OffscreenCanvas(_previewSize, _previewSize);
                drawCircularPreview(previewCanvas, imageCanvas);
                // Also update image URL to show the resized one correctly on track items
                imageCanvas.toBlob((blob) => {
                    onImageInitialized(URL.createObjectURL(blob), imageCanvas, previewCanvas);
                });
            };
            image.src = itemData.imageUrl;
        } else if (isAudio) {
            initializeAudio(itemData.audioURL, (audioBuffer, waveform) => {
                onAudioInitialized(audioBuffer, waveform);
            });
        }

        element.addEventListener("contextmenu", handleContextMenu);
        return () => element.removeEventListener("contextmenu", handleContextMenu);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isAudio && itemData.waveform !== null) drawWaveform(document.getElementById(`${id}-canvas`), itemData.waveform);
    });

    const handleContextMenu = (e) => {
        e.preventDefault();
        setMenuOpen(true);
    };

    const removeAction = () => {
        setMenuOpen(false);
        onItemRemove();
    };

    return (
        <>
            <TrackItemOuter
                ref={dndProvided.innerRef}
                {...dndProvided.draggableProps}
                id={id}
                style={{
                    width: `${itemData.waveform ? itemData.waveform.length : itemData.width}px`,
                    height: `${isAudio ? 64 : pixelCount}px`,
                    ...dndProvided.draggableProps.style,
                }}>
                {isImage && (
                    <>
                        <ImagePreview
                            style={{ backgroundImage: `url(${itemData.imageUrl})`, height: pixelCount }}
                            {...dndProvided.dragHandleProps}
                        />
                        <ImageResizeHandle id={`${id}-handle`} style={{ height: pixelCount }} />
                    </>
                )}
                {isAudio && (
                    <>
                        {itemData.waveform !== null ? (
                            <AudioPreview
                                id={`${id}-canvas`}
                                width={itemData.waveform ? itemData.waveform.length : itemData.width}
                                height={64}
                                {...dndProvided.dragHandleProps}
                            />
                        ) : (
                            <AudioPlaceholder {...dndProvided.dragHandleProps}>
                                <CircularProgress color="secondary" />
                            </AudioPlaceholder>
                        )}
                    </>
                )}
            </TrackItemOuter>

            <Menu
                anchorEl={document.getElementById(id)}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}>
                <MenuItem onClick={removeAction}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Remove</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}

export default TimelineTrackItem;
