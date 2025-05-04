// stores/audio.ts
import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', () => {
    let audioCtx: AudioContext | null = null
    let sequencerInterval: number | null = null
    let animationFrame: number | null = null

    const tempo = ref(120)
    const currentStep = ref(0)
    const progress = ref(0) // 0 -> 1 (progression entre 2 steps)
    const swing = ref(0) // Pourcentage de swing entre 0 et 1
    const maxSteps = 16
    const grid = ref<boolean[]>(Array(maxSteps).fill(false))
    const isPlaying = ref(false)

    let lastTickTime = 0

    function start() {
        if (audioCtx) return
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        isPlaying.value = true
        startSequencer()
        animate()
    }

    function stop() {
        if (sequencerInterval !== null) {
            clearInterval(sequencerInterval)
            sequencerInterval = null
        }
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame)
            animationFrame = null
        }
        audioCtx?.close()
        audioCtx = null
        isPlaying.value = false
        currentStep.value = 0
        progress.value = 0
    }

    function startSequencer() {
        if (!audioCtx) return

        const baseIntervalMs = (60_000 / tempo.value) / 4

        sequencerInterval = window.setInterval(() => {
            const isSwingStep = currentStep.value % 2 === 1
            const swingDelay = isSwingStep ? swing.value * baseIntervalMs : 0

            setTimeout(() => {
                tick()
            }, swingDelay)

        }, baseIntervalMs)
    }

    function tick() {
        if (!audioCtx) return

        lastTickTime = performance.now()
        currentStep.value = (currentStep.value + 1) % maxSteps

        if (grid.value[currentStep.value]) {
            triggerSound()
        }
    }

    function triggerSound() {
        if (!audioCtx) return

        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()

        osc.type = 'square'
        osc.frequency.value = 440
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2)

        osc.connect(gain)
        gain.connect(audioCtx.destination)

        osc.start()
        osc.stop(audioCtx.currentTime + 0.2)
    }

    function animate() {
        const baseIntervalMs = (60_000 / tempo.value) / 4

        const loop = () => {
            const now = performance.now()
            const elapsed = now - lastTickTime

            let effectiveInterval = baseIntervalMs
            if (currentStep.value % 2 === 1) {
                effectiveInterval += swing.value * baseIntervalMs
            }

            progress.value = Math.min(elapsed / effectiveInterval, 1)

            animationFrame = requestAnimationFrame(loop)
        }
        loop()
    }

    return {
        tempo,
        swing,
        currentStep,
        progress,
        grid,
        isPlaying,
        start,
        stop,
    }
})

// HMR (Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAudioStore, import.meta.hot))
}
