<template>
    <div
        class="grid grid-cols-1 gap-4 p-4 bg-dark-700/50 backdrop-blur-sm rounded-xl shadow-lg border border-orange-400/20"
        md="grid-cols-2"
    >
        <div class="flex gap-4">
            <div class="flex items-center gap-2 bg-dark-600/50 px-4 py-2 rounded-lg border border-orange-400/20">
                <Icon
                    name="heroicons:star-20-solid"
                    class="w-5 h-5"
                />
                {{ sequencer.currentLoop }}
            </div>

            <div class="flex items-center gap-2 bg-dark-600/50 px-4 py-2 rounded-lg border border-orange-400/20">
                <Icon
                    name="heroicons:clock"
                    class="w-5 h-5"
                />
                {{ sequencer.relativeStep }}
            </div>
        </div>

        <div>
            <label class="flex items-center gap-2 bg-dark-600/50 px-4 py-2 rounded-lg border border-orange-400/20">
                <Icon
                    name="heroicons:clock"
                    class="w-5 h-5"
                />
                Tempo
                <input
                    v-model="sequencer.tempo"
                    type="number"
                    min="30"
                    max="300"
                    class="w-20 text-orange-400 font-bold bg-transparent border-b border-orange-400/20 focus:border-orange-400/40 outline-none px-2 py-1"
                />
            </label>

            <label class="flex items-center gap-2 bg-dark-600/50 px-4 py-2 rounded-lg border border-orange-400/20">
                <Icon
                    name="heroicons:numbered-list-16-solid"
                    class="w-5 h-5"
                />
                Track Length
                <input
                    v-model="tracks.stepsPerTrack"
                    type="number"
                    min="0"
                    max="32"
                    class="w-20 text-orange-400 font-bold bg-transparent border-b border-orange-400/20 focus:border-orange-400/40 outline-none px-2 py-1"
                />
            </label>

            <label class="flex items-center gap-2 bg-dark-600/50 px-4 py-2 rounded-lg border border-orange-400/20">
                <Icon
                    name="heroicons:numbered-list-16-solid"
                    class="w-5 h-5"
                />
                Loop Length
                <input
                    v-model="sequencer.loopLength"
                    type="number"
                    min="0"
                    max="32"
                    class="w-20 text-orange-400 font-bold bg-transparent border-b border-orange-400/20 focus:border-orange-400/40 outline-none px-2 py-1"
                />
            </label>

            <label class="flex items-center gap-2 bg-dark-600/50 px-4 py-2 rounded-lg border border-orange-400/20">
                <Icon
                    name="heroicons:numbered-list-16-solid"
                    class="w-5 h-5"
                />
                Group Length
                <input
                    v-model="tracks.groupLength"
                    type="number"
                    min="0"
                    max="32"
                    class="w-20 text-orange-400 font-bold bg-transparent border-b border-orange-400/20 focus:border-orange-400/40 outline-none px-2 py-1"
                />
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
const sequencer = useSequencer()
const tracks = useTracks()
</script>
