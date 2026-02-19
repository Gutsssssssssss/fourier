<template>
  <div class="pa-4">
    <h1 class="text-h3 text-center font-weight-bold mb-6">
      Fourier Drawing Animation
    </h1>
    <div class="drawing-canvas-container">
      <canvas ref="canvas" class="drawing-canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FourierCoeff } from '@/lib/dft.ts'

const router = useRouter()
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId = 0

let time = 0
const pathHistory: Array<{ x: number; y: number }> = []

const canvasWidth = ref(600)
const canvasHeight = ref(600)

const fourierCircles = ref<FourierCoeff[]>([])
const scale = ref(0.8)
const speed = ref(1)

const autoScale = computed(() => {
  if (!fourierCircles.value.length) return 1
  const sumAmp = fourierCircles.value.reduce((acc, c) => acc + Math.abs(c.amp), 0)
  if (sumAmp === 0) return 1
  const target = Math.min(canvasWidth.value, canvasHeight.value) * 0.45
  return target / sumAmp
})

onMounted(() => {
  const stored = sessionStorage.getItem('fourierCoeffs')
  if (stored) {
    try {
      fourierCircles.value = JSON.parse(stored) as FourierCoeff[]
    } catch (e) {
      console.error('Failed to parse fourierCoeffs:', e)
      router.push('/')
      return
    }
  } else {
    router.push('/')
    return
  }

  if (!canvas.value) return

  ctx = canvas.value.getContext('2d')
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      canvasWidth.value = entry.contentRect.width
      canvasHeight.value = entry.contentRect.height
      canvas.value!.width = canvasWidth.value
      canvas.value!.height = canvasHeight.value
      if (fourierCircles.value.length > 0) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = requestAnimationFrame(draw)
      }
    }
  })
  const parent = canvas.value.parentElement
  if (!parent) return
  observer.observe(parent)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})

watch(
  () => fourierCircles.value,
  (newVal) => {
    cancelAnimationFrame(animationFrameId)
    pathHistory.length = 0
    time = 0
    if (newVal.length > 0) {
      animationFrameId = requestAnimationFrame(draw)
    }
  },
  { deep: true },
)

function draw(): void {
  if (!ctx || !fourierCircles.value.length) return

  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  ctx.save()
  ctx.translate(canvasWidth.value / 2, canvasHeight.value / 2)

  let currentX = 0
  let currentY = 0

  for (const circle of fourierCircles.value) {
    const prevX = currentX
    const prevY = currentY

    const angle = circle.freq * time + circle.phase

    const s = autoScale.value * scale.value

    currentX += circle.amp * s * Math.cos(angle)
    currentY += circle.amp * s * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(prevX, prevY, circle.amp * scale.value, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(currentX, currentY)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.stroke()
  }

  pathHistory.push({ x: currentX, y: currentY })

  const first = pathHistory[0]
  if (!first) {
    ctx.restore()
    return
  }

  ctx.beginPath()
  ctx.moveTo(first.x, first.y)
  for (let i = 1; i < pathHistory.length; i++) {
    ctx.lineTo(pathHistory[i]!.x, pathHistory[i]!.y)
  }
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.restore()

  const secondsPerLoop = 5
  const fpsAssumed = 60
  time += speed.value * (Math.PI * 2 / secondsPerLoop) * (1 / fpsAssumed)

  if (time < Math.PI * 2) {
    animationFrameId = requestAnimationFrame(draw)
  } else {
    console.log('Animation finished.')
  }
}
</script>

<style scoped>
h1 {
  letter-spacing: -0.02em;
}

.drawing-canvas-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.drawing-canvas {
  width: 100%;
  height: 100%;
  display: block;
  background-color: white;
}
</style>
