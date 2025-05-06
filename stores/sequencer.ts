import { defineStore } from 'pinia'

export const useSequencer = defineStore('sequencer', () => {
    const tracks = useTracks()
    const tempo = ref(120)
    const swing = ref(0)
    const currentStep = ref(0)
    const isPlaying = ref(false)
    const loopLength = ref(8)

    const currentLoop = computed(() => Math.floor(currentStep.value / tracks.stepsPerTrack))
    const relativeStep = computed(() => currentStep.value % tracks.stepsPerTrack)

    let sequencerInterval: number | null = null

    function start() {
        isPlaying.value = true
        run()
    }

    function stop() {
        if (sequencerInterval !== null) {
            clearInterval(sequencerInterval)
            sequencerInterval = null
        }
        isPlaying.value = false
        currentStep.value = 0
    }

    function run() {
        const baseIntervalMs = (60_000 / tempo.value) / 4

        sequencerInterval = window.setInterval(() => {
            tick()
        }, baseIntervalMs)
    }

    function tick() {
        tracks.tracks.forEach(track => {
            if (!shouldPlay(track)) return
            if (track.grid[currentStep.value % tracks.stepsPerTrack]) {
                tracks.triggerTrack(track, currentStep.value % tracks.stepsPerTrack)
            }
        })

        currentStep.value = (currentStep.value + 1) % (tracks.stepsPerTrack * loopLength.value)
    }

    function shouldPlay(track: Track) {
        if (track.loopFrom > currentLoop.value) return false
        if (track.loopTo < currentLoop.value) return false
        if ((currentLoop.value + track.loopGap) % track.loopModulo !== 0) return false
        return true
    }

    watch(tempo, () => {
        stop()
        start()
    })

    return {
        tempo,
        swing,
        currentStep,
        isPlaying,
        start,
        stop,
        currentLoop,
        relativeStep,
        shouldPlay,
        loopLength
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSequencer, import.meta.hot))
}
