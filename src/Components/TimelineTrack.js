import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderList } from "../features/util";
import TimelineTrackItem from "./TimelineTrackItem";

const style = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: "3px",
    backgroundColor: "silver",
};

function TimelineTrack({ items, setItems }) {
    const onDragEnd = (result) => {
        if (!result.destination) return;
        setItems(reorderList(items, result.source.index, result.destination.index));
    };

    let onResizeEnd = (id, width) => {
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={style} {...provided.droppableProps}>
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                    <TimelineTrackItem
                                        itemData={item}
                                        onResizeEnd={(width) => onResizeEnd(item.id, width)}
                                        dndProvided={provided}
                                        dndSnapshot={snapshot}
                                    />
                                )}
                            </Draggable>
                        ))}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default TimelineTrack;
