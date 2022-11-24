let instance;

function concatAudioBuffers(buffers) {
    const context = new AudioContext();
    let channels = [];
    let totalDuration = 0;
    for (let i = 0; i < buffers.length; i++) {
        channels.push(buffers[i].numberOfChannels);
        totalDuration += buffers[i].duration;
    }

    let numberOfChannels = channels.reduce(function (a, b) {
        return Math.min(a, b);
    });
    let tmp = context.createBuffer(numberOfChannels, Math.ceil(context.sampleRate * totalDuration), context.sampleRate);

    for (let i = 0; i < numberOfChannels; i++) {
        let channel = tmp.getChannelData(i);
        let dataIndex = 0;
        for (let j = 0; j < buffers.length; j++) {
            channel.set(buffers[j].getChannelData(i), dataIndex);
            dataIndex += buffers[j].length;
        }
    }

    return tmp;
}

class AudioManager {
    constructor() {
        if (instance) throw new Error("You can only create one instance of LocalStorageManager.");
        instance = this;

        this.audioContext = new AudioContext();
        this.currentAudioSource = null;
        this.audioBuffer = null;
        this.startedAt = null;
        this.pausedAt = null;
        this.isPlaying = false;

        this.stateChangedCallback = null;
        this.timeChangedCallback = null;
        this.timeChangedInterval = null;
        this.timeChangedFrequency = 50;
    }

    setCallbacks(stateChanged, timeChanged) {
        this.stateChangedCallback = stateChanged;
        this.timeChangedCallback = timeChanged;
    }

    updateAudioBuffer(track) {
        let bufferList = [];
        track.forEach((audio) => {
            if (audio.audioBuffer) bufferList.push(audio.audioBuffer);
        });
        this.audioBuffer = bufferList.length ? concatAudioBuffers(bufferList) : null;
        // TODO: Stop playing and reset timeline
    }

    play() {
        if (this.isPlaying) return;

        // Always create a new source, because they can't be reused with different buffer
        let audioSource = this.audioContext.createBufferSource();
        audioSource.onended = () => {
            clearInterval(this.timeChangedInterval);
            this.isPlaying = false;
            this.stateChangedCallback(false);
        };
        audioSource.buffer = this.audioBuffer;
        audioSource.connect(this.audioContext.destination);

        // Restore previous time if needed
        if (this.pausedAt) {
            this.startedAt = Date.now() - this.pausedAt;
            audioSource.start(0, this.pausedAt / 1000);
        } else {
            this.startedAt = Date.now();
            audioSource.start(0);
        }
        this.isPlaying = true;
        this.stateChangedCallback(true);
        this.timeChangedInterval = setInterval(() => {
            this.timeChangedCallback((Date.now() - this.startedAt) / 1000, false);
        }, this.timeChangedFrequency);

        // Save reference for later to pause/stop
        this.currentAudioSource = audioSource;
    }

    pause() {
        clearInterval(this.timeChangedInterval);
        if (this.currentAudioSource)
            this.currentAudioSource.stop(0);
        this.pausedAt = Date.now() - this.startedAt;
        this.isPlaying = false;
        this.stateChangedCallback(false);
    }

    stop() {
        clearInterval(this.timeChangedInterval);
        if (this.currentAudioSource)
            this.currentAudioSource.stop(0);
        this.pausedAt = null;
        this.isPlaying = false;
        this.stateChangedCallback(false);
        this.timeChangedCallback(0, false);
    }

    seek(time) {
        let wasPlaying = false;
        if (this.isPlaying)
            wasPlaying = true;

        clearInterval(this.timeChangedInterval);
        if (this.currentAudioSource) {
            this.currentAudioSource.onended = null;
            this.currentAudioSource.stop(0);
        }
        this.isPlaying = false;

        this.pausedAt = time * 1000;
        if (wasPlaying)
            this.play();
    }
}

const singletonAudioManager = new AudioManager();
export default singletonAudioManager;
