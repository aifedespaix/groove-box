<script setup lang="ts">
import Button from './ui/Button.vue';

const props = defineProps<{
    track: Track
    currentStep: number
}>()

const emit = defineEmits<{
    (e: 'toggleStep', trackId: number, step: number): void
    (e: 'updateNote', trackId: number, step: number, note: string): void
    (e: 'togglePitch', trackId: number): void
}>()

const sequencer = useSequencer()
const tracksStore = useTracks()

const localNotes = ref(props.track.notes || Array(16).fill('A'))
const isCollapsed = ref(false)

watch(() => props.track.notes, (newNotes) => {
    if (newNotes) {
        localNotes.value = [...newNotes]
    }
})

function toggleStep(step: number) {
    emit('toggleStep', props.track.id, step)
}

const tracks = useTracks()

function updateLoopFrom(event: Event) {
    const target = event.target as HTMLInputElement
    tracksStore.updateLoop(props.track.id, { loopFrom: Number(target.value) })
}

function updateLoopTo(event: Event) {
    const target = event.target as HTMLInputElement
    tracksStore.updateLoop(props.track.id, { loopTo: Number(target.value) })
}

function updateLoopModulo(event: Event) {
    const target = event.target as HTMLInputElement
    tracksStore.updateLoop(props.track.id, { loopModulo: Number(target.value) })
}

function updateLoopGap(event: Event) {
    const target = event.target as HTMLInputElement
    tracksStore.updateLoop(props.track.id, { loopGap: Number(target.value) })
}
</script>

<template>
    <div
        class="bg-gray-900 rounded-xl shadow-lg border border-solid font-sans relative p-x-2"
        :class="[sequencer.shouldPlay(track) ? 'border-yellow/50' : 'border-dark-500']"
    >
        <div
            class="flex justify-between items-center"
            :class="isCollapsed ? 'mb-0' : 'mb-4'"
        >
            <div class="flex items-center gap-2">
                <Button
                    @click="isCollapsed = !isCollapsed"
                    class="text-white/60 hover:text-white transition-colors"
                >
                    <template #icon>
                        <Icon :name="isCollapsed ? 'heroicons:chevron-down' : 'heroicons:chevron-up'" />
                    </template>
                </Button>
                <h3 class="text-white font-bold text-lg tracking-wide">{{ track.name }} | {{ track.id }}</h3>
            </div>
            <div class="flex items-center gap-4">
                <UiInput
                    v-if="!isCollapsed"
                    :model-value="track.loopFrom"
                    @change="updateLoopFrom"
                    type="number"
                    placeholder="From"
                />
                <UiInput
                    v-if="!isCollapsed"
                    :model-value="track.loopTo"
                    @change="updateLoopTo"
                    type="number"
                    placeholder="From"
                />
                <UiInput
                    v-if="!isCollapsed"
                    :model-value="track.loopModulo"
                    @change="updateLoopModulo"
                    type="number"
                    placeholder="Modulo"
                />
                <UiInput
                    v-if="!isCollapsed"
                    :model-value="track.loopGap"
                    @change="updateLoopGap"
                    type="number"
                    placeholder="Gap"
                />
                <label
                    v-if="!isCollapsed"
                    class="flex items-center gap-2 text-white text-sm bg-dark-900/75 rounded-md p-2 cursor-pointer"
                    :class="track.enablePitch ? 'bg-orange-500/20' : 'bg-dark-800/25'"
                >
                    <input
                        type="checkbox"
                        :checked="track.enablePitch"
                        @change="emit('togglePitch', track.id)"
                        class="w-4 h-4 rounded border-gray-700 bg-gray-800 text-orange-400 focus:ring-orange-400 focus:ring-offset-gray-900 focus:ring-offset-2 cursor-pointer transition-all duration-200 ease-in-out appearance-none checked:bg-orange-400 checked:border-orange-400 hover:border-orange-400/50"
                    />
                    Pitch
                </label>
                <button
                    v-if="!isCollapsed"
                    @click="tracks.removeTrack(track.id)"
                    class="p-2 bg-red-500/20 text-red-400 rounded-lg border border-red-400/20 cursor-pointer"
                    transition="200 ease-in-out colors"
                    hover="border-red-400/60 bg-red-500/30"
                >
                    <Icon
                        name="heroicons:trash"
                        class="w-4 h-4"
                    />
                </button>
            </div>
        </div>
        <div
            v-if="!isCollapsed"
            class="grid grid-cols-4 gap-4 p-2"
            :class="track.enablePitch ? 'gap-y-8' : ''"
        >
            <div
                v-for="(group, groupIndex) in Array.from({ length: tracksStore.groupLength })"
                :key="groupIndex"
                class="bg-gray-800/50 p-2 rounded-lg"
            >
                <div class="grid grid-cols-4 gap-2">
                    <div
                        v-for="(active, index) in track.grid.slice(groupIndex * 4, (groupIndex + 1) * 4)"
                        :key="index"
                        class="relative w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95"
                        :class="[
                            active ? 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30' : 'bg-gray-800 hover:bg-gray-700',
                            sequencer.relativeStep === (groupIndex * 4 + index) ? 'ring-2 ring-red-500 animate-pulse' : ''
                        ]"
                        @click="toggleStep(groupIndex * 4 + index)"
                    >
                        <span class="text-xs font-bold text-white/90">{{ groupIndex * 4 + index + 1 }}</span>
                        <select
                            v-if="track.enablePitch && active"
                            v-model="localNotes[groupIndex * 4 + index]"
                            @click.stop
                            @change="emit('updateNote', track.id, groupIndex * 4 + index, localNotes[groupIndex * 4 + index])"
                            class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded border border-gray-700 focus:outline-none focus:border-orange-400"
                        >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                            <option value="G">G</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
