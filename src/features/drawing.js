import { convertInterval } from "./util";

export function clearCanvas(canvasElement) {
    const context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

function rgbAtDataPixel(data, i) {
    return `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${data[i + 3]})`;
}

export function drawCircularPreview(canvasElement, imageCanvas) {
    const sourceImageData = imageCanvas.getContext("2d").getImageData(0, 0, imageCanvas.width, imageCanvas.height).data;

    const context = canvasElement.getContext("2d");
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    context.lineWidth = 2;
    context.strokeStyle = "maroon";

    const centerX = canvasElement.width / 2,
        centerY = canvasElement.height / 2,
        maxRadius = imageCanvas.height === 36 ? 192 : 256;
    let radius = 0,
        startArc = 0,
        endArc = 0;

    // Calculate number of sections from image width/height ratio
    const ratio = (imageCanvas.width / imageCanvas.height).toFixed(1);
    const numSection = Math.round(convertInterval(ratio, [0.3, 2], [17, 4]));

    const sectionArc = (2 * Math.PI) / numSection;
    const pixelArc = sectionArc / imageCanvas.width;
    for (let s = 0; s < numSection; s++) {
        const sectionStart = s * sectionArc;
        for (let y = 0; y < imageCanvas.height; y++) {
            radius = maxRadius - y * 2;
            for (let x = 0; x < imageCanvas.width; x++) {
                let pIndex = x * 4;
                if (y > 0) pIndex += (y - 1) * imageCanvas.width * 4;
                context.strokeStyle = rgbAtDataPixel(sourceImageData, pIndex);
                startArc = sectionStart + x * pixelArc;
                endArc = startArc + pixelArc;
                context.beginPath();
                context.arc(centerX, centerY, radius, startArc, endArc);
                context.stroke();
            }
        }
    }
}

export function resizeAsCanvas(image, pixelHeight) {
    const newWidth = Math.round(image.width * (pixelHeight / image.height));
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = pixelHeight;
    canvas.getContext("2d").drawImage(image, 0, 0, newWidth, pixelHeight);
    return canvas;
}

export function isImageAllBlack(sourceCanvas, tolerance = 5) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = sourceCanvas.width;
    tempCanvas.height = sourceCanvas.height;
    const ctx = tempCanvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(sourceCanvas, 0, 0);
    const { data } = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > tolerance || g > tolerance || b > tolerance) {
            return false;
        }
    }
    return true;
}
