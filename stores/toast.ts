import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<Toast[]>([])
    const nextId = ref(0)

    function addToast(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
        const id = nextId.value++
        toasts.value.push({ id, message, type, duration })

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }

    function removeToast(id: number) {
        toasts.value = toasts.value.filter(toast => toast.id !== id)
    }

    function success(message: string, duration?: number) {
        addToast(message, 'success', duration)
    }

    function error(message: string, duration?: number) {
        addToast(message, 'error', duration)
    }

    function info(message: string, duration?: number) {
        addToast(message, 'info', duration)
    }

    function warning(message: string, duration?: number) {
        addToast(message, 'warning', duration)
    }

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning
    }
}) 