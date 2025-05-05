<template>
    <TransitionGroup
        name="toast"
        tag="div"
        class="fixed top-4 right-4 z-50 flex flex-col gap-2 sm:max-w-md w-full px-4 sm:px-0"
    >
        <div
            v-for="toast in toasts"
            :key="toast.id"
            class="bg-gray-900 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-fade-in"
            :class="{
                'bg-green-600': toast.type === 'success',
                'bg-red-600': toast.type === 'error',
                'bg-blue-600': toast.type === 'info',
                'bg-yellow-600': toast.type === 'warning'
            }"
        >
            <div class="flex-1">
                <p class="text-sm font-medium">{{ toast.message }}</p>
            </div>
            <Button
                @click="removeToast(toast.id)"
                class="text-white/70 hover:text-white transition-colors"
            >
                <template #icon>
                    <Icon name="heroicons:x-mark" />
                </template>
            </Button>
        </div>
    </TransitionGroup>
</template>

<script setup lang="ts">
import { useToastStore } from '~/stores/toast'
import { storeToRefs } from 'pinia'
import Button from './ui/Button.vue'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
const { removeToast } = toastStore
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>