<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
    >
        <div
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
            @click="$emit('close')"
        ></div>
        <div class="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-800">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">Projets sauvegardés</h3>
                <Button
                    class="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    @click="$emit('close')"
                    rounded="full"
                >
                    <Icon name="heroicons:x-mark" />
                </Button>
            </div>

            <div class="space-y-4">
                <div
                    v-if="projects.length === 0"
                    class="text-center text-gray-400 py-4"
                >
                    Aucun projet sauvegardé
                </div>
                <div
                    v-else
                    class="space-y-2"
                >
                    <div
                        v-for="project in projects"
                        :key="project.id"
                        class="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800"
                    >
                        <div
                            class="flex-1 cursor-pointer"
                            @click="$emit('load', project.id)"
                        >
                            <div class="font-medium text-white">{{ project.name }}</div>
                            <div class="text-sm text-gray-400">
                                {{ new Date(project.date).toLocaleDateString() }}
                            </div>
                        </div>
                        <Button
                            @click="$emit('delete', project.id)"
                            rounded="full"
                            variant="danger"
                        >
                            <Icon name="heroicons:trash" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Button from './ui/Button.vue';

defineProps<{
    isOpen: boolean
    projects: Array<{
        id: string
        name: string
        date: string
    }>
}>()

defineEmits<{
    (e: 'close'): void
    (e: 'load', id: string): void
    (e: 'delete', id: string): void
}>()
</script>