<template>
  <div class="d-flex flex-column">
    <v-file-input
      label="Select SVG File"
      variant="outlined"
      accept=".svg,image/svg+xml"
      multiple
      show-size
      clearable
      :model-value="props.selectedFiles"
      @update:model-value="(files) => emit('update:selectedFiles', files as File[] | null ?? [])"
    />
    <v-btn
      class="mt-4"
      variant="elevated"
      color="primary"
      :disabled="!props.selectedFiles?.length"
      @click="emit('parse')"
    >
      Parse
    </v-btn>

    <v-btn
      v-if="props.fourierReady"
      class="mt-4"
      variant="elevated"
      color="primary"
      @click="emit('start')"
    >
      Start
    </v-btn>

    <div v-if="props.originalSvg" class="mt-6">
      <h3 class="text-h6 mb-2">Original SVG</h3>
      <div class="svg-preview" v-html="props.originalSvg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedFiles: File[]
  originalSvg: string
  fourierReady: boolean
}>()

const emit = defineEmits<{
  (e: 'update:selectedFiles', value: File[]): void
  (e: 'parse'): void
  (e: 'start'): void
}>()
</script>

<style scoped>
.svg-preview {
  border: 1px solid #ccc;
  background: white;
  padding: 16px;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
}

.svg-preview :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
