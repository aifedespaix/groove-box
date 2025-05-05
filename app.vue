<template>
  <div class="min-h-screen flex flex-col absolute inset-0 font-sans">
    <LayoutHeader
      @open-projects="isOpen = true"
      @new-project="handleNewProject"
      @save-project="handleSaveProject"
    />
    <main class="flex-1">
      <NuxtPage />
    </main>

    <ProjectsModal
      :is-open="isOpen"
      :projects="projects"
      @close="isOpen = false"
      @load="loadProject"
      @delete="deleteProject"
    />

    <ToastNotification />
  </div>
</template>

<script lang="ts" setup>
const baseUrl = 'https://groove.aife.io'
const isOpen = ref(false)
const projectsStore = useProjects()
const projects = computed(() => projectsStore.projects)

const handleNewProject = () => {
  const tracksStore = useTracks()
  tracksStore.tracks = []
}

const handleSaveProject = () => {
  const projectName = prompt('Nom du projet :')
  if (projectName) {
    projectsStore.saveProject(projectName)
  }
}

const loadProject = (id: string) => {
  projectsStore.loadProject(id)
  isOpen.value = false
}

const deleteProject = (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    projectsStore.deleteProject(id)
  }
}

useHead({
  titleTemplate: '%s - Groove Box',
  title: 'Crée ta musique en ligne',
  meta: [
    { name: 'description', content: 'Groove Box est un sampler en ligne qui te permet de créer ta musique facilement et gratuitement. Compose, mixe et partage ton groove en quelques clics !' },

    // Open Graph (Facebook, Discord, etc.)
    { property: 'og:title', content: 'Groove Box - Crée ta musique en ligne' },
    { property: 'og:description', content: 'Compose ta musique en ligne avec Groove Box ! Sampler interactif pour créer, mixer et partager ton groove.' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: `${baseUrl}/` },
    { property: 'og:type', content: 'website' },

    // Twitter Cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Groove Box - Crée ta musique en ligne' },
    { name: 'twitter:description', content: 'Découvre Groove Box, le sampler en ligne pour créer, mixer et partager ta musique !' },
    { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` }, // Même image que Open Graph en général

    // Robots
    { name: 'robots', content: 'index, follow' },

    // Language
    { name: 'language', content: 'fr' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '180x180' }, // Si tu as un favicon
  ]
})

</script>