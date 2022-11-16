function TimelineTrackItem({ itemData, dndProvided, dndSnapshot }) {
    return (
        <div
            ref={dndProvided.innerRef}
            {...dndProvided.draggableProps}
            {...dndProvided.dragHandleProps}
            style={{
                display: "inline-block",
                width: `${itemData.width}px`,
                height: "64px",
                marginRight: "3px",
                backgroundColor: "gray",
                ...dndProvided.draggableProps.style,
            }}>
            {itemData.id}
        </div>
    );
}

export default TimelineTrackItem;
