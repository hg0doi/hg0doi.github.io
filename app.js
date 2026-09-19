// Coeficientes aproximados de atenuación (dB por metro) según frecuencia
const materialCoefficients = {
  brick: { 850: 3.5, 1900: 5.0, 2100: 6.0, 3500: 8.5, 28000: 45.0 },
  reinforced_concrete: { 850: 14.0, 1900: 20.0, 2100: 22.0, 3500: 32.0, 28000: 120.0 },
  faraday_cage: { 850: 60.0, 1900: 65.0, 2100: 70.0, 3500: 80.0, 28000: 100.0 } // Pérdida por inserción efectiva
};

function calculateSignalLoss(freqMHz, distanceMeters, materialType, wallThicknessMeters, txPowerdBm = 23) {
  // 1. Cálculo de FSPL (Espacio libre)
  const fspl = 20 * Math.log10(distanceMeters) + 20 * Math.log10(freqMHz) - 27.55;

  // 2. Cálculo de atenuación por muro/material
  const alpha = materialCoefficients[materialType][freqMHz] || 10.0;
  const wallLoss = alpha * wallThicknessMeters;

  // 3. Pérdida Total
  const totalLoss = fspl + wallLoss;

  // 4. Potencia Recibida
  const rxPower = txPowerdBm - totalLoss;

  // 5. Estado de la señal (Umbral de conexión)
  const isBlocked = rxPower <= -95; // -95 dBm es el límite para mantener conexión

  return {
    fspl: fspl.toFixed(2),
    wallLoss: wallLoss.toFixed(2),
    totalLoss: totalLoss.toFixed(2),
    rxPower: rxPower.toFixed(2),
    isBlocked: isBlocked
  };
}

// Ejemplo de uso: 850 MHz (2G) a 15 metros, atravesando 0.5m de Concreto Reforzado
console.log(calculateSignalLoss(850, 15, 'reinforced_concrete', 0.5));
