import { defineStore } from 'pinia'

export type InstrumentType = 'kick' | 'snare' | 'hihat' | 'lead'

export interface Track {
    id: number
    name: string
    type: InstrumentType
    grid: boolean[]
    notes?: string[]
    enablePitch?: boolean
    loopFrom: number
    loopTo: number
    loopModulo: number
}

const sampleUrls: Record<InstrumentType, string | null> = {
    kick: '/samples/kick.wav',
    snare: '/samples/snare.wav',
    hihat: '/samples/hihat.wav',
    lead: null, // Synthé, pas de sample
}

export const useTracks = defineStore('tracks', () => {
    const tracks = ref<Track[]>([])
    const stepsPerTrack = ref(16)

    const trackId = computed(() => {
        return tracks.value.length + 1
    })

    const sampleBuffers: Record<InstrumentType, AudioBuffer | null> = {
        kick: null,
        snare: null,
        hihat: null,
        lead: null,
    }

    const noteFrequencies: Record<string, number> = {
        'A': 440,
        'B': 493.88,
        'C': 523.25,
        'D': 587.33,
        'E': 659.25,
        'F': 698.46,
        'G': 783.99
    }

    async function loadSamples() {
        const audioEngine = useAudioEngine()
        const audioCtx = audioEngine.getContext()
        if (!audioCtx) return

        for (const [instrument, url] of Object.entries(sampleUrls)) {
            if (url) {
                const response = await fetch(url)
                const arrayBuffer = await response.arrayBuffer()
                sampleBuffers[instrument as InstrumentType] = await audioCtx.decodeAudioData(arrayBuffer)
            }
        }
    }

    function addTrack(name: string, type: InstrumentType = 'lead') {
        tracks.value.push({
            id: trackId.value,
            name,
            type,
            grid: Array(stepsPerTrack.value).fill(false),
            notes: type === 'lead' ? Array(stepsPerTrack.value).fill('A') : undefined,
            enablePitch: type === 'lead',
            loopFrom: 0,
            loopTo: 8,
            loopModulo: 1
        })
    }

    function toggleStep(trackId: number, step: number) {
        const track = tracks.value.find(t => t.id === trackId)
        if (track) {
            track.grid[step] = !track.grid[step]
        }
    }

    function triggerLead(track: Track, step: number, audioCtx: AudioContext) {
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()

        const note = track.notes?.[step] || 'A'

        osc.type = 'sawtooth'
        osc.frequency.value = noteFrequencies[note]
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2)

        osc.connect(gain)
        gain.connect(audioCtx.destination)

        osc.start()
        osc.stop(audioCtx.currentTime + 0.2)
    }

    function triggerSample(track: Track, step: number, audioCtx: AudioContext) {
        const buffer = sampleBuffers[track.type]
        if (buffer) {
            const source = audioCtx.createBufferSource()
            source.buffer = buffer

            if (track.enablePitch && track.notes) {
                const note = track.notes[step] || 'A'
                const baseFrequency = 440 // Fréquence de base (A4)
                const targetFrequency = noteFrequencies[note]
                const playbackRate = targetFrequency / baseFrequency
                source.playbackRate.value = playbackRate
            }

            source.connect(audioCtx.destination)
            source.start()
        }
    }

    function triggerTrack(track: Track, step: number) {
        const audioEngine = useAudioEngine()
        const audioCtx = audioEngine.getContext()
        if (!audioCtx) return

        if (track.type === 'lead') {
            triggerLead(track, step, audioCtx)
        } else {
            triggerSample(track, step, audioCtx)
        }
    }

    function togglePitch(trackId: number) {
        const track = tracks.value.find(t => t.id === trackId)
        if (track) {
            track.enablePitch = !track.enablePitch
            if (track.enablePitch && !track.notes) {
                track.notes = Array(stepsPerTrack.value).fill('A')
            }
        }
    }

    function removeTrack(trackId: number) {
        tracks.value = tracks.value.filter(t => t.id !== trackId)
    }

    function updateNote(trackId: number, step: number, note: string) {
        const track = tracks.value.find(t => t.id === trackId)
        if (track && track.type === 'lead' && track.notes) {
            track.notes[step] = note
        }
    }

    function updateLoop(trackId: number, loop: { loopFrom?: number, loopTo?: number, loopModulo?: number }) {
        const track = tracks.value.find(t => t.id === trackId)
        if (track) {
            if (loop.loopFrom) {
                track.loopFrom = loop.loopFrom
            }
            if (loop.loopTo) {
                track.loopTo = loop.loopTo
            }
            if (loop.loopModulo) {
                track.loopModulo = loop.loopModulo
            }
        }
    }


    return {
        tracks,
        addTrack,
        toggleStep,
        triggerTrack,
        loadSamples,
        stepsPerTrack,
        removeTrack,
        updateNote,
        togglePitch,
        updateLoop,
    }
}, {
    persist: true
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTracks, import.meta.hot))
}
