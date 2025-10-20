// Configuración central de la aplicación web
// Copiado y adaptado del proyecto mobile

// Configuración de ambientes
export const ENV = import.meta.env.MODE; // 'development' | 'production'
export const IS_DEV = ENV === 'development';

// En desarrollo usamos el proxy de Vite (rutas relativas)
// En producción usamos la URL completa del backend
export const BASE_URL = IS_DEV 
  ? '' // Proxy de Vite manejará las rutas /api/*
  : (import.meta.env.VITE_BASE_URL || 'https://staging.supra.social');

export const DEFAULT_TIMEOUT_MS = 15000; // 15s

export const GOOGLE_WEB_CLIENT_ID = '229284518222-25ogfouvjdr8me44gbjj0osuihko48qf.apps.googleusercontent.com';
