import { useEffect } from "react";
import { clearCanvas } from "../features/drawing";

const _canvasViewportSize = 550;

const style = {
    display: "flex",
    position: "fixed",
    top: "calc(50% - 100px)",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "500px",
};

function PreviewCanvas({ currentImage, currentTime }) {
    useEffect(() => {
        const canvas = document.getElementById("preview-canvas");
        clearCanvas(canvas);
        if (!currentImage) return;

        if (currentImage.circularPreview) {
            const destCtx = canvas.getContext("2d");
            const middle = canvas.width / 2;
            destCtx.translate(middle, middle);
            destCtx.rotate((Math.PI / 180) * 0.5);
            destCtx.translate(-middle, -middle);
            destCtx.drawImage(currentImage.circularPreview, 0, 0);
        } else {
            // TODO: Consider drawing a general placeholder
        }
    }, [currentImage, currentTime]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <canvas id="preview-canvas" width={_canvasViewportSize} height={_canvasViewportSize} style={style} />
        </>
    );
}

export default PreviewCanvas;
