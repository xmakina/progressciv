export const GenerateDemands = (demands: {[index: string]: number | undefined}): {[index: string]: number} =>
  Object.keys(demands)
    .reduce<{[index: string]: number}>((acc, k) => {
    if (demands[k] !== undefined) {
      acc[k] = demands[k] ?? 0
    }

    return acc
  }, {})
