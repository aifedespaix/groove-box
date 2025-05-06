<template>
    <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        class="p-2 bg-dark font-mono text-white border-none rounded-md w-auto"
        @input="onChange"
    >
</template>

<script setup lang="ts">
defineProps<{
    type: string
    modelValue: string | number
    placeholder: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const onChange = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>