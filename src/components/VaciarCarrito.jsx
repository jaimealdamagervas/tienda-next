'use client';
import { useEffect } from 'react';
import { useCarrito } from '@/contexts/CarritoContext';

// El webhook de Stripe vacía el carrito en la API; esto lo vacía también en el navegador
export function VaciarCarrito() {
  const { setItems } = useCarrito();
  useEffect(() => {
    setItems([]);
  }, [setItems]);
  return null;
}
