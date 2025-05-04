import { defineStore } from 'pinia'

export const useSequencer = defineStore('sequencer', () => {
    const tempo = ref(120)
    const swing = ref(0)
    const currentStep = ref(0)
    const isPlaying = ref(false)

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
        const tracks = useTracks()
        tracks.tracks.forEach(track => {
            if (track.grid[currentStep.value]) {
                tracks.triggerTrack(track, currentStep.value)
            }
        })

        currentStep.value = (currentStep.value + 1) % useTracks().stepsPerTrack
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
        stop
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSequencer, import.meta.hot))
}
