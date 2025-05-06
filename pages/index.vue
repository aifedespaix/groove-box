<script setup lang="ts">
const audioEngine = useAudioEngine()
const sequencer = useSequencer()
const tracks = useTracks()

onMounted(async () => {
    audioEngine.start()
    await tracks.loadSamples()
})

function addNewTrack(type: 'kick' | 'snare' | 'hihat' | 'lead') {
    tracks.addTrack(type.toUpperCase() + ' ' + (tracks.tracks.length + 1), type)
}

function toggleStep(trackId: number, step: number) {
    tracks.toggleStep(trackId, step)
}

function updateNote(trackId: number, step: number, note: string) {
    tracks.updateNote(trackId, step, note)
}

function togglePitch(trackId: number) {
    tracks.togglePitch(trackId)
}

function updateLoop(trackId: number, loop: number) {
    tracks.updateLoop(trackId, loop)
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 p-6 text-orange-400">
        <div class="controls bg-dark-700/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-400/20">
            <div class="flex flex-wrap gap-4 items-center">
                <button
                    @click="() => addNewTrack('kick')"
                    class="px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg transition-all duration-200 border border-orange-400/20 hover:border-orange-400/40 flex items-center gap-2"
                >
                    <Icon
                        name="heroicons:musical-note"
                        class="w-5 h-5"
                    />
                    Ajouter Kick
                </button>
                <button
                    @click="() => addNewTrack('snare')"
                    class="px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg transition-all duration-200 border border-orange-400/20 hover:border-orange-400/40 flex items-center gap-2"
                >
                    <Icon
                        name="heroicons:musical-note"
                        class="w-5 h-5"
                    />
                    Ajouter Snare
                </button>
                <button
                    @click="() => addNewTrack('hihat')"
                    class="px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg transition-all duration-200 border border-orange-400/20 hover:border-orange-400/40 flex items-center gap-2"
                >
                    <Icon
                        name="heroicons:musical-note"
                        class="w-5 h-5"
                    />
                    Ajouter HiHat
                </button>
                <button
                    @click="() => addNewTrack('lead')"
                    class="px-4 py-2 bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 rounded-lg transition-all duration-200 border border-orange-400/20 hover:border-orange-400/40 flex items-center gap-2"
                >
                    <Icon
                        name="heroicons:musical-note"
                        class="w-5 h-5"
                    />
                    Ajouter Synth
                </button>

                <div class="flex items-center gap-4">
                    <button
                        v-if="!sequencer.isPlaying"
                        @click="sequencer.start"
                        class="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-200 border border-green-400/20 hover:border-green-400/40 flex items-center gap-2"
                    >
                        <Icon
                            name="heroicons:play"
                            class="w-5 h-5"
                        />
                        Démarrer
                    </button>
                    <button
                        v-else
                        @click="sequencer.stop"
                        class="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200 border border-red-400/20 hover:border-red-400/40 flex items-center gap-2"
                    >
                        <Icon
                            name="heroicons:stop"
                            class="w-5 h-5"
                        />
                        Stop
                    </button>

                </div>
            </div>
        </div>

        <SequencerInfo />

        <div class="tracks mt-8 space-y-6">
            <SequencerTrack
                v-for="track in tracks.tracks"
                :key="track.id"
                :track="track"
                :current-step="sequencer.currentStep"
                @toggle-step="toggleStep"
                @update-note="updateNote"
                @toggle-pitch="togglePitch"
                @update-loop="updateLoop"
            />
        </div>
    </div>
</template>

<style scoped>
/* Les styles de base sont maintenant gérés par UnoCSS */
</style>
