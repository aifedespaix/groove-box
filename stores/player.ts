export const usePlayerStore = defineStore('player', () => {
    const isPlaying = ref(false)
    const bpm = ref(120)
    const volume = ref(0.5)
    const

    const audioStore = useAudioStore()
    function play() {
        isPlaying.value = true

    }

    function stop() {
        isPlaying.value = false
    }



    if (import.meta.hot) {
        import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
    }

