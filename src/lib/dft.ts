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
  const fourier = Array.from({ length: N }, (_, k) => {
    const re =
      points.reduce((sum, p, n) => {
        const phi = (2 * Math.PI * k * n) / N
        return sum + p.x * Math.cos(phi) + p.y * Math.sin(phi)
      }, 0) / N
    const im =
      points.reduce((sum, p, n) => {
        const phi = (2 * Math.PI * k * n) / N
        return sum + -p.x * Math.sin(phi) + p.y * Math.cos(phi)
      }, 0) / N
    return {
      re,
      im,
      freq: k,
      amp: Math.sqrt(re * re + im * im),
      phase: Math.atan2(im, re),
    }
  })
  return fourier.sort((a, b) => b.amp - a.amp)
}

