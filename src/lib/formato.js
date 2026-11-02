// Precio en euros con formato español: 59.99 -> "59,99 €"
const formato = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export function euros(cantidad) {
  return formato.format(Number(cantidad) || 0);
}
