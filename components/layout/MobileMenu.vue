<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50"
        @click="closeMenu"
    >
        <div
            class="absolute top-[72px] left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg w-full border-box"
            @click.stop
        >
            <div class="p-t-4">
                <div class="flex gap-1 flex-col">
                    <Button
                        @click="handleNewProject"
                        class="w-full justify-start"
                        rounded="none"
                    >
                        <template #icon>
                            <Icon name="heroicons:plus" />
                        </template>
                        Nouveau projet
                    </Button>
                    <Button
                        @click="handleOpenProjects"
                        class="w-full justify-start"
                        rounded="none"
                    >
                        <template #icon>
                            <Icon name="heroicons:folder" />
                        </template>
                        Ouvrir
                    </Button>
                    <Button
                        @click="handleSaveProject"
                        variant="default"
                        class="w-full justify-start"
                        rounded="none"
                    >
                        <template #icon>
                            <Icon name="heroicons:arrow-up-tray" />
                        </template>
                        Sauvegarder
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Button from '~/components/ui/Button.vue'

defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'close' | 'newProject' | 'openProjects' | 'saveProject'): void
}>()

const closeMenu = () => {
    emit('close')
}

const handleNewProject = () => {
    if (confirm('Voulez-vous créer un nouveau projet ? Les modifications non sauvegardées seront perdues.')) {
        emit('newProject')
        closeMenu()
    }
}

const handleOpenProjects = () => {
    emit('openProjects')
    closeMenu()
}

const handleSaveProject = () => {
    emit('saveProject')
    closeMenu()
}
</script>