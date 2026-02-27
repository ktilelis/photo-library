export interface PhotoGalleryError {
  type: 'server' | 'network' | 'client' | 'unknown';
  message: string;
  statusCode?: number;
  originalError?: unknown;
}
