<template>
    <header class="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
        <div class="py-4 w-full border-box">
            <div class="flex items-center justify-between px-4">
                <div class="flex items-center space-x-4">
                    <NuxtImg
                        src="/favicon.png"
                        alt="Groove Box Logo"
                        class="w-10 h-10"
                    />
                    <h1 class="text-2xl font-bold inline-block overflow-hidden whitespace-nowrap">Groove Box</h1>
                </div>
                <div class="hidden md:flex items-center space-x-4">
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
                <Button
                    class="md:hidden"
                    @click="isMobileMenuOpen = !isMobileMenuOpen"
                >
                    <template #icon>
                        <Icon :name="isMobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" />
                    </template>
                </Button>
            </div>
        </div>
        <MobileMenu
            :is-open="isMobileMenuOpen"
            @close="isMobileMenuOpen = false"
            @new-project="$emit('newProject')"
            @open-projects="$emit('openProjects')"
            @save-project="$emit('saveProject')"
        />
    </header>
</template>

<script lang="ts" setup>
import Button from '~/components/ui/Button.vue'
import MobileMenu from './MobileMenu.vue'

const isMobileMenuOpen = ref(false)

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

// Fermer le menu mobile lorsque la largeur de la fenêtre dépasse la largeur mobile
onMounted(() => {
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) { // 768px est la breakpoint md de Tailwind
            isMobileMenuOpen.value = false
        }
    })
})

onUnmounted(() => {
    window.removeEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            isMobileMenuOpen.value = false
        }
    })
})
</script>