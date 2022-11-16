function TimelineTrack({ children }) {
    return (
        <div style={{ flexDirection: "row", p: 0, width: "100%", marginBottom: "3px", backgroundColor: "silver" }}>
            {children}
        </div>
    );
}

export default TimelineTrack;
