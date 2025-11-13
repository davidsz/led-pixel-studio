import { _resolution } from "..";
import { CanvasToBMP } from "./bmp";
import { isImageAllBlack } from "./drawing";

export async function loadProject(dirHandle, setAppImages) {
    let programFile = null;
    let imageFiles = [];
    for await (const [name, value] of dirHandle.entries()) {
        if (name === "program.txt") {
            programFile = await value.getFile();
            continue;
        }
        if (name.endsWith(".bmp")) {
            imageFiles.push({ name, value });
            continue;
        }
    }

    if (!programFile) {
        // Load all images found with the default 6 sec length
        for (let i = 0; i < imageFiles.length; i++) {
            const imageFile = await imageFiles[i].value.getFile();
            importImage(imageFile, setAppImages, 6 * _resolution);
        }
    } else {
        // Load only the mentioned images with proper timing
        parseProgramFile(programFile).then(async (steps) => {
            // We expect at least one image and Finish
            if (steps.length < 2) return;
            let lastTime = parseTimeFormat(steps[0].time);
            for (let i = 1; i < steps.length; i++) {
                // Check if mentioned image file exists before including it
                for (let j = 0; j < imageFiles.length; j++) {
                    if (imageFiles[j].name === steps[i - 1].fileName) {
                        const time = parseTimeFormat(steps[i].time);
                        const imageFile = await imageFiles[j].value.getFile();
                        importImage(imageFile, setAppImages, getSecDifference(lastTime, time) * _resolution);
                        lastTime = time;
                        break;
                    }
                }
            }
        });
    }
}

export async function saveProject(dirHandle, appImages) {
    // Generate program.txt
    const programFileHandle = await dirHandle.getFileHandle("program.txt", { create: true });
    const fileStream = await programFileHandle.createWritable();
    const numImages = appImages.length;
    // We create only one black image to spare disk space
    // TODO: Create a resource manager and load only one instance of each image
    let firstBlankImageName = ``;
    let currentSec = 0;
    let programText = ``;
    for (let i = 0; i < numImages; i++) {
        let image = appImages[i];
        let filename = idToFilename(image.id);
        // Create BMP image
        if (isImageAllBlack(image.imageCanvas)) {
            if (firstBlankImageName === ``) {
                firstBlankImageName = filename;
                saveImage(dirHandle, filename, image.imageCanvas);
            } else
                filename = firstBlankImageName;
        } else
            saveImage(dirHandle, filename, image.imageCanvas);

        // Write the corresponding line into program.txt
        if (i === 0) {
            currentSec = 0;
            // TODO: Figure out what is (1.2) at the end of first line
            programText = `${filename} - ${getTimestampFromSecond(currentSec)} (1.2)\r\n`;
        } else {
            currentSec += appImages[i - 1].width / _resolution;
            programText += `${filename} - ${getTimestampFromSecond(currentSec)}\r\n`;
        }
    }
    programText += `Finish - ${getTimestampFromSecond(currentSec + appImages[numImages - 1].width / _resolution)}\r\n`;
    // TODO: Make these configurable
    programText += "Repeat after finish - yes\r\n";
    programText += "Lock buttons - no\r\n";
    await fileStream.write(new Blob([programText], { type: "text/plain" }));
    await fileStream.close();
}

function importImage(image, setAppImages, pixelWidth = 200) {
    setAppImages((current) => {
        const id = getAvailableId(current);
        return [
            ...current,
            {
                id: id,
                width: pixelWidth,
                imageUrl: URL.createObjectURL(image),
                imageCanvas: null,
                circularPreview: null,
            },
        ];
    });
}

export async function importImages(fileHandles, setAppImages) {
    for (let i = 0; i < fileHandles.length; i++) {
        const imageFile = await fileHandles[i].getFile();
        importImage(imageFile, setAppImages, 200);
    }
}

export async function importMusic(fileHandles, setAppMusic) {
    for (let i = 0; i < fileHandles.length; i++) {
        const audioFile = await fileHandles[i].getFile();
        setAppMusic((current) => {
            const id = getAvailableId(current);
            return [
                ...current,
                {
                    id: id,
                    width: 250,
                    audioURL: URL.createObjectURL(audioFile),
                    audioBuffer: null,
                    waveform: null,
                    length: 0,
                },
            ];
        });
    }
}

function getAvailableId(array) {
    let id = array.length;
    for (let i = 0, n = array.length; i < n; i++) {
        if (array[i].id === [id].toString()) {
            id++;
            i = 0;
        }
    }
    return [id].toString();
}

function intToAZ(number) {
    let ret = "";
    do {
        ret += String.fromCharCode(97 + (number % 26));
        number -= 26;
    } while (number >= 0);
    return ret;
}

function idToFilename(id) {
    id = parseInt(id);
    // Start file names from "01" instead of "00"
    const fileNameNumber = `${(id + 1) < 10 ? "0" : ""}${id + 1}`;
    return `${fileNameNumber}_${intToAZ(id)}`;
}

function parseTimeFormat(timeString) {
    let pieces = timeString.split(":");
    if (pieces.length !== 3) return { min: 0, sec: 0, hun: 0 };
    return {
        min: parseInt(pieces[0]),
        sec: parseInt(pieces[1]),
        hun: parseInt(pieces[2]),
    };
}

function getSecDifference(prevTime, time) {
    let minutes = time.min - prevTime.min;
    let seconds = time.sec - prevTime.sec;
    let hundredths = time.hun - prevTime.hun;
    return minutes * 60 + seconds + hundredths / 100;
}

function getTimestampFromSecond(sec) {
    let minutes = Math.trunc(sec / 60);
    if (minutes < 10) minutes = `0${minutes}`;
    sec -= minutes * 60;

    let seconds = Math.trunc(sec);
    if (seconds < 10) seconds = `0${seconds}`;
    sec -= Math.trunc(sec);

    let hundredths = Math.trunc(sec * 100);
    if (hundredths < 10) hundredths = `0${hundredths}`;

    return `${minutes}:${seconds}:${hundredths}`;
}

function parseProgramFile(file) {
    return new Promise((resolve, reject) => {
        // Read file
        let fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsText(file);
    }).then((fileContent) => {
        // Parse content
        let ret = [];
        let lines = fileContent.split("\n");
        for (let i = 0; i < lines.length; i++) {
            let parts = lines[i].split(" - ");
            if (parts.length < 2) continue;
            if (parts[0] === "Repeat after finish") continue;
            if (parts[0] === "Lock buttons") continue;
            ret.push({
                fileName: parts[0] === "Finish" ? null : `${parts[0]}.bmp`,
                time: parts[1].trim().substr(0, 7),
            });
        }
        return ret;
    });
}

async function saveImage(dirHandle, filename, imageCanvas) {
    let imageFileHandle = await dirHandle.getFileHandle(`${filename}.bmp`, { create: true });
    const fileStream = await imageFileHandle.createWritable();
    await fileStream.write(CanvasToBMP.toBlob(imageCanvas));
    await fileStream.close();
}