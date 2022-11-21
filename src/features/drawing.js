import { convertInterval } from "./util";

export function clearCanvas(canvasElement) {
    let context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

export function drawImage(canvasElement, image) {
    let tempCanvas = document.createElement("canvas");
    let tempContext = tempCanvas.getContext("2d");
    tempContext.drawImage(image, 0, 0);

    let context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    context.lineWidth = 2;
    context.strokeStyle = "maroon";

    let centerX = 275,
        centerY = 275,
        radius = 0,
        startArc = 0,
        endArc = 0;

    // Calculate number of sections from image width/height ratio
    const ratio = Math.round(image.width / image.height);
    const numSection = Math.round(convertInterval(ratio, [0.5, 2], [20, 3]));

    const sectionArc = (2 * Math.PI) / numSection;
    const pixelArc = sectionArc / image.width;
    for (let s = 0; s < numSection; s++) {
        const sectionStart = s * sectionArc;
        for (let y = 0; y < image.height; y++) {
            radius = 256 - y * 2;
            for (let x = 0; x < image.width; x++) {
                const imageData = tempContext.getImageData(x, y, 1, 1).data;
                context.strokeStyle =
                    "rgba(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ", " + imageData[3] + ")";
                startArc = sectionStart + x * pixelArc;
                endArc = startArc + pixelArc;
                context.beginPath();
                context.arc(centerX, centerY, radius, startArc, endArc);
                context.stroke();
            }
        }
    }
}
