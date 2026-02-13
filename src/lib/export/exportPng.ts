import { toPng } from 'html-to-image';

export async function exportPng(
  element: HTMLElement,
  filename: string,
  options?: { width?: number; height?: number; transparent?: boolean }
) {
  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: options?.transparent ? undefined : '#ffffff',
      width: options?.width,
      height: options?.height,
      style: options?.width || options?.height
        ? {
            width: options.width ? `${options.width}px` : undefined,
            height: options.height ? `${options.height}px` : undefined,
          }
        : undefined,
    });

    const link = document.createElement('a');
    link.download = `${filename.replace(/[^a-zA-Z0-9-_]/g, '_')}.png`;
    link.href = dataUrl;
    link.click();

    return dataUrl;
  } catch (error) {
    console.error('PNG export failed:', error);
    throw error;
  }
}
