<template>
  <div class="d-flex flex-column">
    <v-file-input
      label="Select SVG File"
      variant="outlined"
      accept=".svg,image/svg+xml"
      multiple
      show-size
      clearable
      :model-value="selectedFiles"
      @update:model-value="$emit('update:selectedFiles', $event)"
    />
    <v-btn
      class="mt-4"
      variant="elevated"
      color="primary"
      :disabled="!selectedFiles?.length"
      @click="$emit('parse')"
    >
      Parse
    </v-btn>

    <v-btn
      v-if="fourierReady"
      class="mt-4"
      variant="elevated"
      color="primary"
      @click="$emit('start')"
    >
      Start
    </v-btn>

    <div v-if="originalSvg" class="mt-6">
      <h3 class="text-h6 mb-2">Original SVG</h3>
      <div class="svg-preview" v-html="originalSvg"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedFiles: {
    type: Array,
    default: () => [],
  },
  originalSvg: {
    type: String,
    default: "",
  },
  fourierReady: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:selectedFiles", "parse", "start"]);
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
