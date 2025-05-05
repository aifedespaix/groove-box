import { defineStore } from 'pinia'
import { useTracks } from './tracks'
import type { Track } from './tracks'

export interface Project {
    id: string
    name: string
    date: string
    tracks: Track[]
}

export const useProjects = defineStore('projects', () => {
    const projects = ref<Project[]>([])
    const tracksStore = useTracks()

    // Créer un projet de base
    function createDefaultProject() {
        const project: Project = {
            id: crypto.randomUUID(),
            name: 'Projet de base',
            date: new Date().toISOString(),
            tracks: []
        }

        // Ajouter les tracks de base
        tracksStore.addTrack('Kick', 'kick')
        tracksStore.addTrack('Snare', 'snare')
        tracksStore.addTrack('HiHat', 'hihat')
        tracksStore.addTrack('Lead', 'lead')

        // Configurer les patterns de base
        const kickTrack = tracksStore.tracks[0]
        const snareTrack = tracksStore.tracks[1]
        const hihatTrack = tracksStore.tracks[2]
        const leadTrack = tracksStore.tracks[3]

        // Pattern de kick (4/4)
        kickTrack.grid = [
            true, false, false, false,
            true, false, false, false,
            true, false, false, false,
            true, false, false, false
        ]

        // Pattern de snare (2/4)
        snareTrack.grid = [
            false, false, true, false,
            false, false, true, false,
            false, false, true, false,
            false, false, true, false
        ]

        // Pattern de hihat (8/8)
        hihatTrack.grid = [
            true, false, true, false,
            true, false, true, false,
            true, false, true, false,
            true, false, true, false
        ]

        // Pattern de lead (mélodie simple)
        leadTrack.grid = [
            true, false, false, false,
            false, false, true, false,
            false, false, false, false,
            true, false, false, false
        ]
        leadTrack.notes = [
            'C', 'A', 'A', 'A',
            'A', 'A', 'G', 'A',
            'A', 'A', 'A', 'A',
            'F', 'A', 'A', 'A'
        ]

        project.tracks = [...tracksStore.tracks]
        projects.value.push(project)
        localStorage.setItem('groovebox-projects', JSON.stringify(projects.value))
    }

    // Charger les projets depuis le localStorage au démarrage
    onMounted(() => {
        const savedProjects = localStorage.getItem('groovebox-projects')
        if (savedProjects && savedProjects !== '[]') {
            console.log('Loading projects from localStorage', savedProjects.length, savedProjects)
            projects.value = JSON.parse(savedProjects)
        } else {
            console.log('Creating default project')
            createDefaultProject()
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

    function updateProjectName(id: string, newName: string) {
        const project = projects.value.find(p => p.id === id)
        if (project) {
            project.name = newName
            localStorage.setItem('groovebox-projects', JSON.stringify(projects.value))
        }
    }

    function importProject(project: Project) {
        project.id = crypto.randomUUID()
        project.date = new Date().toISOString()
        projects.value.push(project)
    }

    return {
        projects,
        saveProject,
        loadProject,
        deleteProject,
        updateProjectName,
        importProject
    }
}) 