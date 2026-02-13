import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportPdf(
  element: HTMLElement,
  filename: string,
  options?: { width?: number; height?: number }
) {
  try {
    const imgData = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    const img = new Image();
    img.src = imgData;

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const imgWidth = options?.width || img.width / 2;
    const imgHeight = options?.height || img.height / 2;

    const isLandscape = imgWidth > imgHeight;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth + 40, imgHeight + 40],
    });

    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`${filename.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}
