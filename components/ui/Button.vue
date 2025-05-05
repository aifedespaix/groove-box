<template>
    <button
        :class="[
            'group relative inline-flex items-center justify-center px-4 py-2 transition-all duration-200',
            rounded === 'none' ? 'rounded-none' : rounded === 'sm' ? 'rounded-sm' : rounded === 'lg' ? 'rounded-lg' : 'rounded-full',
            'backdrop-blur-sm',
            'border',
            'shadow-[0_2px_8px_-1px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_12px_-1px_rgba(0,0,0,0.3)]',
            'active:scale-95',
            'text-slate-100',
            'cursor-pointer',
            variant === 'default' && 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/40 hover:border-slate-600/40',
            variant === 'danger' && 'bg-rose-900/90 hover:bg-rose-800/90 border-rose-800/40 hover:border-rose-700/40',
            variant === 'success' && 'bg-emerald-900/90 hover:bg-emerald-800/90 border-emerald-800/40 hover:border-emerald-700/40',
            size === 'sm' && 'text-sm px-3 py-1.5',
            size === 'lg' && 'text-lg px-6 py-3',
        ]"
        @click="$emit('click')"
    >
        <span
            v-if="$slots.icon"
            class="transition-transform group-hover:scale-110"
            :class="[
                iconPosition === 'right' ? 'ml-2 order-2' : 'mr-2',
                !$slots.default && '!mr-0 !ml-0'
            ]"
        >
            <slot name="icon" />
        </span>
        <span
            v-if="$slots.default"
            class="font-medium"
        >
            <slot />
        </span>
    </button>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    variant?: 'default' | 'danger' | 'success'
    size?: 'sm' | 'md' | 'lg'
    iconPosition?: 'left' | 'right'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}>(), {
    variant: 'default',
    size: 'md',
    iconPosition: 'left',
    rounded: 'md'
})

defineEmits<{
    (e: 'click'): void
}>()
</script>