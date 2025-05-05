<script setup lang="ts">
import Button from './ui/Button.vue';

const props = defineProps<{
    track: {
        id: number
        name: string
        type: string
        grid: boolean[]
        notes?: string[]
        enablePitch?: boolean
    }
    currentStep: number
}>()

const emit = defineEmits<{
    (e: 'toggleStep', trackId: number, step: number): void
    (e: 'updateNote', trackId: number, step: number, note: string): void
    (e: 'togglePitch', trackId: number): void
}>()

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

</script>

<template>
    <div class="bg-gray-900 rounded-xl shadow-lg border border-gray-800 font-sans relative p-x-2">
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
                <label
                    v-if="!isCollapsed"
                    class="flex items-center gap-2 text-white text-sm"
                >
                    <input
                        type="checkbox"
                        :checked="track.enablePitch"
                        @change="emit('togglePitch', track.id)"
                        class="w-4 h-4 rounded border-gray-700 bg-gray-800 text-orange-400 focus:ring-orange-400"
                    />
                    Activer le pitch
                </label>
                <button
                    v-if="!isCollapsed"
                    @click="tracks.removeTrack(track.id)"
                    class="p-2 bg-red-500/20 text-red-400 rounded-lg border border-red-400/20"
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
            class="grid grid-cols-6 xs:grid-cols-8 sm:grid-cols-16 gap-2 p-2"
        >
            <div
                v-for="(active, index) in track.grid"
                :key="index"
                class="relative w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95"
                :class="[
                    active ? 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30' : 'bg-gray-800 hover:bg-gray-700',
                    currentStep === index ? 'ring-2 ring-red-500 animate-pulse' : ''
                ]"
                @click="toggleStep(index)"
            >
                <span class="text-xs font-bold text-white/90">{{ index + 1 }}</span>
                <select
                    v-if="track.enablePitch && active"
                    v-model="localNotes[index]"
                    @click.stop
                    @change="emit('updateNote', track.id, index, localNotes[index])"
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
</template>
