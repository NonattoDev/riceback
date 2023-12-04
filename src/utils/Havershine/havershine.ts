export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const raioTerra = 6371; // Raio da Terra em Km
  const dLat = grausParaRadianos(lat2 - lat1);
  const dLon = grausParaRadianos(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(grausParaRadianos(lat1)) * Math.cos(grausParaRadianos(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = raioTerra * c; // Distância em km
  return distancia;
}

function grausParaRadianos(graus: number): number {
  return graus * (Math.PI / 180);
}
