<template>
    <header class="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <NuxtImg
                        src="/favicon.png"
                        alt="Groove Box Logo"
                        class="w-10 h-10"
                    />
                    <h1 class="text-2xl font-bold">Groove Box</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <Button @click="handleNewProject">
                        <template #icon>
                            <Icon name="heroicons:plus" />
                        </template>
                        Nouveau projet
                    </Button>
                    <Button @click="$emit('openProjects')">
                        <template #icon>
                            <Icon name="heroicons:folder" />
                        </template>
                        Ouvrir
                    </Button>
                    <Button
                        @click="handleSaveProject"
                        variant="default"
                    >
                        <template #icon>
                            <Icon name="heroicons:arrow-up-tray" />
                        </template>
                        Sauvegarder
                    </Button>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { PlusIcon, FolderIcon, SaveIcon } from '~/components/ui/icons'
import Button from '~/components/ui/Button.vue'

const emit = defineEmits<{
    (e: 'openProjects' | 'newProject' | 'saveProject'): void
}>()

const handleNewProject = () => {
    if (confirm('Voulez-vous créer un nouveau projet ? Les modifications non sauvegardées seront perdues.')) {
        emit('newProject')
    }
}

const handleSaveProject = () => {
    emit('saveProject')
}
</script>