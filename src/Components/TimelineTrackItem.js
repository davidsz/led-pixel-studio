import { styled } from "@mui/material/styles";
import { useEffect, useId } from "react";
import { makeElementResizable } from "../features/util";

const devicePixelCount = 64;

export const ImagePreview = styled("div")(({ theme }) => ({
    width: "100%",
    height: `${devicePixelCount}px`,
    backgroundRepeat: "repeat-x",
}));

export const ResizeHandle = styled("div")(({ theme }) => ({
    width: "7px",
    height: `${devicePixelCount}px`,
    flexShrink: 0,
    backgroundColor: "black",
    cursor: "col-resize",
}));

function TimelineTrackItem({ itemData, onResizeEnd, dndProvided, dndSnapshot }) {
    const id = useId();
    useEffect(() => {
        let element = document.getElementById(id);
        let handle = document.getElementById(`${id}-handle`);
        makeElementResizable(element, handle, {
            horizontal: true,
            doneCallback: (width) => {
                onResizeEnd(width);
            },
        });
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
            <ImagePreview {...dndProvided.dragHandleProps} style={{ backgroundImage: `url(${itemData.imageUrl})` }}>
                {itemData.id}
            </ImagePreview>
            <ResizeHandle id={`${id}-handle`} />
        </div>
    );
}

export default TimelineTrackItem;
