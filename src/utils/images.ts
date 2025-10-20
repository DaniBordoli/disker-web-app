// Utilidades para manejo de imágenes
import placeholderImage from '../assets/campaign-placeholder.svg';

/**
 * Obtiene la URL de la imagen o retorna un placeholder
 */
export function getImageUrl(url?: string | null): string {
  if (!url || url.trim() === '') {
    return placeholderImage;
  }
  return url;
}

/**
 * Maneja errores de carga de imágenes
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>
): void {
  const img = event.currentTarget;
  if (img.src !== placeholderImage) {
    img.src = placeholderImage;
  }
}

/**
 * Props para componentes de imagen con fallback
 */
export interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
}
