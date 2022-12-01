const lineSeparator = navigator.userAgentData.platform === "Windows" ? "\r\n" : "\n";
const pathSeparator = navigator.userAgentData.platform === "Windows" ? "\\" : "/";

export function loadProject(files, setAppImages, pixelPerSecond) {
    let programFile = null;
    let imageFiles = [];
    for (let i = 0; i < files.length; i++) {
        let pathComponent = files[i].webkitRelativePath.split(pathSeparator);
        if (pathComponent[1] === "program.txt") {
            programFile = files[i];
            continue;
        }
        if (pathComponent[1].endsWith(".bmp")) {
            imageFiles.push(files[i]);
            continue;
        }
    }

    if (!programFile) {
        // Load all images found with the default 6 sec length
        for (let i = 0; i < imageFiles.length; i++) importImage(imageFiles[i], setAppImages, 6 * pixelPerSecond);
    } else {
        // Load only the mentioned images with proper timing
        parseProgramFile(programFile).then((steps) => {
            // We expect at least one image and Finish
            if (steps.length < 2) return;
            let lastTime = parseTimeFormat(steps[0].time);
            for (let i = 1; i < steps.length; i++) {
                // Check if mentioned image file exists before including it
                for (let j = 0; j < imageFiles.length; j++) {
                    if (imageFiles[j].webkitRelativePath.endsWith(steps[i - 1].fileName)) {
                        let time = parseTimeFormat(steps[i].time);
                        importImage(imageFiles[j], setAppImages, getSecDifference(lastTime, time) * pixelPerSecond);
                        lastTime = time;
                        break;
                    }
                }
            }
        });
    }
}

export function saveProject(directoryHandle) {}

function importImage(image, setAppImages, pixelWidth = 200) {
    setAppImages((current) => {
        const id = getAvailableId(current);
        return [
            ...current,
            {
                id: id,
                width: pixelWidth,
                imageUrl: URL.createObjectURL(image),
                imageObj: null,
                circularPreview: null,
            },
        ];
    });
}

export function importImages(images, setAppImages) {
    for (let i = 0; i < images.length; i++) importImage(images[i], setAppImages, 200);
}

export function importMusic(music, setAppMusic) {
    for (let i = 0; i < music.length; i++) {
        setAppMusic((current) => {
            const id = getAvailableId(current);
            return [
                ...current,
                {
                    id: id,
                    width: 250,
                    audioURL: URL.createObjectURL(music[i]),
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
        let lines = fileContent.split(lineSeparator);
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
