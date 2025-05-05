import { defineStore } from 'pinia'
import { useTracks } from './tracks'
import type { Track } from './tracks'

interface Project {
    id: string
    name: string
    date: string
    tracks: Track[]
}

export const useProjects = defineStore('projects', () => {
    const projects = ref<Project[]>([])
    const tracksStore = useTracks()

    // Charger les projets depuis le localStorage au démarrage
    onMounted(() => {
        const savedProjects = localStorage.getItem('groovebox-projects')
        if (savedProjects) {
            projects.value = JSON.parse(savedProjects)
        }
    })

    // Sauvegarder un nouveau projet
    function saveProject(name: string) {
        const project: Project = {
            id: crypto.randomUUID(),
            name,
            date: new Date().toISOString(),
            tracks: [...tracksStore.tracks]
        }

        projects.value.push(project)
        localStorage.setItem('groovebox-projects', JSON.stringify(projects.value))
    }

    // Charger un projet
    function loadProject(id: string) {
        const project = projects.value.find(p => p.id === id)
        if (project) {
            tracksStore.tracks = [...project.tracks]
        }
    }

    // Supprimer un projet
    function deleteProject(id: string) {
        projects.value = projects.value.filter(p => p.id !== id)
        localStorage.setItem('groovebox-projects', JSON.stringify(projects.value))
    }

    return {
        projects,
        saveProject,
        loadProject,
        deleteProject
    }
}) 