import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useId } from "react";
import { initializeAudio, drawWaveform } from "../features/audio";
import { makeElementResizable } from "../features/util";

const devicePixelCount = 64;

const ImagePreview = styled("div")(({ theme }) => ({
    width: "100%",
    height: `${devicePixelCount}px`,
    backgroundRepeat: "repeat-x",
}));

const ImageResizeHandle = styled("div")(({ theme }) => ({
    width: "7px",
    height: `${devicePixelCount}px`,
    flexShrink: 0,
    backgroundColor: "black",
    cursor: "col-resize",
}));

const AudioPreview = styled("canvas")(({ theme }) => ({
    width: "100%",
    height: `${devicePixelCount}px`,
    borderLeft: "black 1px solid",
}));

const AudioPlaceholder = styled("div")(({ theme }) => ({
    width: "100%",
    height: `${devicePixelCount}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "black 1px solid",
    backgroundColor: "white",
}));

function TimelineTrackItem({ itemData, type, onResizeEnd, onAudioInitialized, dndProvided, dndSnapshot }) {
    const isImage = type === "image";
    const isAudio = type === "audio";
    const id = useId();

    useEffect(() => {
        if (isImage) {
            let element = document.getElementById(id);
            let handle = document.getElementById(`${id}-handle`);
            makeElementResizable(element, handle, {
                horizontal: true,
                doneCallback: (width) => {
                    onResizeEnd(width);
                },
            });
        } else if (isAudio) {
            initializeAudio(itemData.audioURL, (audioBuffer, waveform) => {
                onAudioInitialized(audioBuffer, waveform);
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isAudio && itemData.waveform !== null) drawWaveform(document.getElementById(`${id}-canvas`), itemData.waveform);
    });

    return (
        <div
            ref={dndProvided.innerRef}
            {...dndProvided.draggableProps}
            id={id}
            style={{
                display: "flex",
                alignItems: "stretch",
                position: "relative",
                width: `${itemData.waveform ? itemData.waveform.length : itemData.width}px`,
                height: `${devicePixelCount}px`,
                marginRight: "0px",
                backgroundColor: "gray",
                ...dndProvided.draggableProps.style,
            }}>
            {isImage && (
                <>
                    <ImagePreview style={{ backgroundImage: `url(${itemData.imageUrl})` }} {...dndProvided.dragHandleProps} />
                    <ImageResizeHandle id={`${id}-handle`} />
                </>
            )}
            {isAudio && (
                <>
                    {itemData.waveform !== null ? (
                        <AudioPreview
                            id={`${id}-canvas`}
                            width={itemData.waveform ? itemData.waveform.length : itemData.width}
                            height={devicePixelCount}
                            {...dndProvided.dragHandleProps}
                        />
                    ) : (
                        <AudioPlaceholder {...dndProvided.dragHandleProps}>
                            <CircularProgress color="secondary" />
                        </AudioPlaceholder>
                    )}
                </>
            )}
        </div>
    );
}

export default TimelineTrackItem;
