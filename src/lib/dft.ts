export interface FourierPoint {
  x: number
  y: number
}

export interface FourierCoeff {
  re: number
  im: number
  freq: number
  amp: number
  phase: number
}

export function computeDFT(points: FourierPoint[]): FourierCoeff[] {
  const N = points.length
  const fourier: FourierCoeff[] = []

  for (let k = 0; k < N; k++) {
    let re = 0
    let im = 0

    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N
      re += points[n].x * Math.cos(phi) + points[n].y * Math.sin(phi)
      im += -points[n].x * Math.sin(phi) + points[n].y * Math.cos(phi)
    }

    re /= N
    im /= N

    const freq = k <= N / 2 ? k : k - N

    fourier.push({
      re,
      im,
      freq,
      amp: Math.hypot(re, im),
      phase: Math.atan2(im, re),
    })
  }

  return fourier.sort((a, b) => b.amp - a.amp)
}

