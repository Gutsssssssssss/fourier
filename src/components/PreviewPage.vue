<template>
  <div v-if="sampledPoints.length > 0">
    <h3 class="text-h6 mb-2">
      Sampled Result ({{ sampledPoints.length }} points)
    </h3>
    <div class="svg-result-container">
      <svg
        :viewBox="svgViewBox"
        xmlns="http://www.w3.org/2000/svg"
        class="sampled-svg"
      >
        <path :d="svgPath" fill="none" stroke="#000" stroke-width="0.1" />
      </svg>
    </div>
  </div>
  <div v-else class="d-flex align-center justify-center empty-state">
    <p class="text-grey">Click the Parse button to see the sampled result</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FourierPoint } from '../lib/dft.ts'

const props = defineProps<{
  sampledPoints: FourierPoint[]
}>()

const bounds = computed(() => {
  if (props.sampledPoints.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 }
  }

  const xs = props.sampledPoints.map((p) => p.x)
  const ys = props.sampledPoints.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX || 1,
    height: maxY - minY || 1,
  }
})

const svgViewBox = computed(() => {
  const { minX, minY, width, height } = bounds.value
  if (width === 0 && height === 0) return '0 0 100 100'

  const padding = Math.max(width, height) * 0.1
  return `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`
})

const svgPath = computed(() => {
  if (props.sampledPoints.length === 0) return ''

  return props.sampledPoints
    .map((point, index) => {
      const x = point.x
      const y = point.y
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')
})
</script>

<style scoped>
.svg-result-container {
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  padding: 16px;
}

.sampled-svg {
  width: 100%;
  height: 400px;
  display: block;
}

.empty-state {
  height: 400px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  background: #fafafa;
}
</style>
