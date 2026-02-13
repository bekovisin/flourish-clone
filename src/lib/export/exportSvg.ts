import { toSvg } from 'html-to-image';

export async function exportSvg(
  element: HTMLElement,
  filename: string,
  options?: { width?: number; height?: number; transparent?: boolean }
) {
  try {
    const dataUrl = await toSvg(element, {
      backgroundColor: options?.transparent ? undefined : '#ffffff',
      width: options?.width,
      height: options?.height,
    });

    const link = document.createElement('a');
    link.download = `${filename.replace(/[^a-zA-Z0-9-_]/g, '_')}.svg`;
    link.href = dataUrl;
    link.click();

    return dataUrl;
  } catch (error) {
    console.error('SVG export failed:', error);
    throw error;
  }
}
