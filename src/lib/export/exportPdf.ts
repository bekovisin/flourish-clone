import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportPdf(
  element: HTMLElement,
  filename: string,
  options?: { width?: number; height?: number }
) {
  try {
    let imgData: string;
    let imgWidth: number;
    let imgHeight: number;

    // Check if we have an inline SVG (custom chart)
    const svgElement = element.querySelector('svg');

    if (svgElement) {
      // Use SVG → Canvas → PNG for faithful rendering
      const result = await svgToPngData(svgElement, options);
      if (result) {
        imgData = result.dataUrl;
        imgWidth = result.width;
        imgHeight = result.height;
      } else {
        // Fallback to html-to-image
        const fallback = await htmlToImageFallback(element, options);
        imgData = fallback.dataUrl;
        imgWidth = fallback.width;
        imgHeight = fallback.height;
      }
    } else {
      const fallback = await htmlToImageFallback(element, options);
      imgData = fallback.dataUrl;
      imgWidth = fallback.width;
      imgHeight = fallback.height;
    }

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

async function htmlToImageFallback(
  element: HTMLElement,
  options?: { width?: number; height?: number }
): Promise<{ dataUrl: string; width: number; height: number }> {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((resolve) => { img.onload = () => resolve(); });

  return {
    dataUrl,
    width: options?.width || img.width / 2,
    height: options?.height || img.height / 2,
  };
}

async function svgToPngData(
  svgElement: SVGSVGElement,
  options?: { width?: number; height?: number }
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const svgWidth = parseFloat(clonedSvg.getAttribute('width') || '800');
    const svgHeight = parseFloat(clonedSvg.getAttribute('height') || '600');
    const targetW = options?.width || svgWidth;
    const targetH = options?.height || svgHeight;

    if (!clonedSvg.getAttribute('viewBox')) {
      clonedSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    }
    clonedSvg.setAttribute('width', String(targetW));
    clonedSvg.setAttribute('height', String(targetH));

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const pixelRatio = 2;
        const canvas = document.createElement('canvas');
        canvas.width = targetW * pixelRatio;
        canvas.height = targetH * pixelRatio;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('No canvas 2d')); return; }

        ctx.scale(pixelRatio, pixelRatio);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);
        URL.revokeObjectURL(url);

        resolve({ dataUrl: canvas.toDataURL('image/png', 1), width: targetW, height: targetH });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('SVG load failed'));
      };
      img.src = url;
    });
  } catch {
    return null;
  }
}
