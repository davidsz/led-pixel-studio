import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useId, useState } from "react";
import { makeElementResizable } from "../features/util";

const devicePixelCount = 64;

export const ImagePreview = styled("div")(({ theme }) => ({
    width: "100%",
    height: `${devicePixelCount}px`,
    backgroundRepeat: "repeat-x",
}));

export const ImageResizeHandle = styled("div")(({ theme }) => ({
    width: "7px",
    height: `${devicePixelCount}px`,
    flexShrink: 0,
    backgroundColor: "black",
    cursor: "col-resize",
}));

export const AudioPreview = styled("canvas")(({ theme }) => ({
    width: "100%",
    height: `${devicePixelCount}px`,
    borderLeft: "black 1px solid",
}));

export const AudioPlaceholder = styled("div")(({ theme }) => ({
    width: "100%",
    height: `${devicePixelCount}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "black 1px solid",
    backgroundColor: "white",
}));

function TimelineTrackItem({ itemData, type, onResizeEnd, dndProvided, dndSnapshot }) {
    const isImage = type === "image";
    const isAudio = type === "audio";
    const [initialized, setInitialized] = useState(isImage);
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
            // TODO: Generate audio preview
            setInitialized(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            ref={dndProvided.innerRef}
            {...dndProvided.draggableProps}
            id={id}
            style={{
                display: "flex",
                alignItems: "stretch",
                position: "relative",
                width: `${itemData.width}px`,
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
                    {initialized ? (
                        <AudioPreview
                            id={`${id}-canvas`}
                            width={itemData.width}
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
