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
                        <div class="flex items-center gap-2">
                            <Button
                                @click="handleExport(project)"
                                rounded="full"
                                variant="default"
                            >
                                <Icon name="heroicons:arrow-down-tray" />
                            </Button>
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
            <div class="mt-6 pt-4 border-t border-gray-800">
                <div class="flex gap-2">
                    <Button @click="handlePaste">
                        <template #icon>
                            <Icon name="heroicons:clipboard-document" />
                        </template>
                    </Button>
                    <input
                        v-model="importText"
                        type="text"
                        placeholder="Coller le contenu du projet ici"
                        class="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                        @click="handleImport"
                        rounded="full"
                        variant="default"
                    >
                        <Icon name="heroicons:arrow-up-tray" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Button from './ui/Button.vue';
import { useToastStore } from '~/stores/toast';
import { ref } from 'vue';
import { useProjects } from '~/stores/projects';

const toast = useToastStore();
const projectsStore = useProjects();
const importText = ref('');

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'load' | 'delete', id: string): void
    (e: 'export', project: { id: string; name: string; date: string }): void
    (e: 'import', project: Project): void
}>()

defineProps<{
    isOpen: boolean
    projects: Array<{
        id: string
        name: string
        date: string
    }>
}>()

const handleExport = (project: Project) => {
    emit('export', project);
    // Copie dans le presse-papier
    navigator.clipboard.writeText(JSON.stringify(project));
    toast.success(`Le projet "${project.name}" a été enregistré dans le presse-papier.`);
}

const handlePaste = async () => {
    if (!importText.value) {
        try {
            const text = await navigator.clipboard.readText();
            importText.value = text;
        } catch {
            toast.error('Impossible d\'accéder au presse-papier');
        }
    }
}

const handleImport = () => {
    try {
        const project = JSON.parse(importText.value);
        // Vérifier que le projet a la bonne structure
        if (!project.id || !project.name || !project.date || !project.tracks) {
            throw new Error('Format de projet invalide');
        }
        // Ajouter le projet au store
        projectsStore.projects.push(project);
        // Sauvegarder dans le localStorage
        localStorage.setItem('groovebox-projects', JSON.stringify(projectsStore.projects));
        importText.value = '';
        toast.success('Projet importé avec succès');
    } catch {
        toast.error('Format de projet invalide');
    }
}
</script>