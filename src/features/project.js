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
        // Load all images found
        for (let i = 0; i < imageFiles.length; i++) importImage(imageFiles[i], setAppImages);
    } else {
        // Load only the mentioned images with proper timing
        parseProgramFile(programFile).then((steps) => {
            let lastTime = parseTimeFormat("00:00:00");
            for (let i = 0; i < steps.length; i++) {
                let step = steps[i];
                for (let j = 0; j < imageFiles.length; j++) {
                    if (imageFiles[j].webkitRelativePath.endsWith(step.fileName)) {
                        // FIXME: Not correct. We should calculate length from the start of the next image.
                        // FIXME: Support "Finish" step.
                        let time = parseTimeFormat(step.time);
                        let sec = getSecDifference(lastTime, time);
                        importImage(imageFiles[j], setAppImages, sec * pixelPerSecond);
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
