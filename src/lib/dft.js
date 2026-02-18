export function computeDFT(points) {
  const N = points.length;
  const fourier = Array.from({ length: N }, (_, k) => {
    const re =
      points.reduce((sum, p, n) => {
        const phi = (2 * Math.PI * k * n) / N;
        return sum + p.x * Math.cos(phi) + p.y * Math.sin(phi);
      }, 0) / N;
    const im =
      points.reduce((sum, p, n) => {
        const phi = (2 * Math.PI * k * n) / N;
        return sum + -p.x * Math.sin(phi) + p.y * Math.cos(phi);
      }, 0) / N;
    return {
      re,
      im,
      freq: k,
      amp: Math.sqrt(re * re + im * im),
      phase: Math.atan2(im, re),
    };
  });
  // amp 내림차순 정렬 (비변이: reduce로 새 배열 구성)
  return fourier.reduce((acc, coeff) => {
    const idx = acc.findIndex((c) => c.amp < coeff.amp);
    const i = idx === -1 ? acc.length : idx;
    return [...acc.slice(0, i), coeff, ...acc.slice(i)];
  }, []);
}
