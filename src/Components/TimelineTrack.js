import { styled } from "@mui/material/styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderList } from "../features/util";
import TimelineTrackItem from "./TimelineTrackItem";

const Track = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: "64px",
    marginBottom: "3px",
    backgroundColor: theme.palette.primary.main,
}));

function TimelineTrack({ items, setItems, type }) {
    const onDragEnd = (result) => {
        if (!result.destination) return;
        setItems(reorderList(items, result.source.index, result.destination.index));
    };

    const onResizeEnd = (id, width) => {
        setItems((current) =>
            current.map((item) => {
                if (item.id === id)
                    return {
                        ...item,
                        width: width,
                    };
                else return item;
            })
        );
    };

    const onImageInitialized = (id, image, previewCanvas) => {
        setItems((current) =>
            current.map((item) => {
                if (item.id === id)
                    return {
                        ...item,
                        imageObj: image,
                        circularPreview: previewCanvas,
                    };
                else return item;
            })
        );
    };

    const onAudioInitialized = (id, audioBuffer, waveform) => {
        setItems((current) =>
            current.map((item) => {
                if (item.id === id)
                    return {
                        ...item,
                        audioBuffer: audioBuffer,
                        waveform: waveform,
                        length: audioBuffer.duration,
                    };
                else return item;
            })
        );
    };

    const onItemRemove = (id) => {
        setItems((current) =>
            current.filter((item) => {
                return item.id !== id;
            })
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                    <Track ref={provided.innerRef} {...provided.droppableProps}>
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                    <TimelineTrackItem
                                        itemData={item}
                                        type={type}
                                        onResizeEnd={(width) => onResizeEnd(item.id, width)}
                                        onImageInitialized={(image, preview) => onImageInitialized(item.id, image, preview)}
                                        onAudioInitialized={(buffer, waveform) => onAudioInitialized(item.id, buffer, waveform)}
                                        onItemRemove={() => onItemRemove(item.id)}
                                        dndProvided={provided}
                                        dndSnapshot={snapshot}
                                    />
                                )}
                            </Draggable>
                        ))}

                        {provided.placeholder}
                    </Track>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default TimelineTrack;
