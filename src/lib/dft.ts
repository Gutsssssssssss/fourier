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

    for (const [n, p] of points.entries()) {
      const phi = (2 * Math.PI * k * n) / N
      re += p.x * Math.cos(phi) + p.y * Math.sin(phi)
      im += -p.x * Math.sin(phi) + p.y * Math.cos(phi)
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

