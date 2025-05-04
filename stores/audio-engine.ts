import { defineStore } from 'pinia'

export const useAudioEngine = defineStore('audioEngine', () => {
    let audioCtx: AudioContext | null = null

    function start() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
    }

    function stop() {
        if (audioCtx) {
            audioCtx.close()
            audioCtx = null
        }
    }

    function getContext() {
        return audioCtx
    }

    return { start, stop, getContext }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAudioEngine, import.meta.hot))
}
