import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

export async function exportPdf(
  element: HTMLElement,
  filename: string,
  options?: { width?: number; height?: number; transparent?: boolean }
) {
  try {
    const svgElement = element.querySelector('svg');

    if (svgElement) {
      await svgToVectorPdf(svgElement, filename, options);
    } else {
      // Fallback for non-SVG content: raster approach
      await rasterPdfFallback(element, filename, options);
    }
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

/**
 * Vectorial PDF export using svg2pdf.js
 * Renders the SVG directly as vector graphics in the PDF — crisp at any zoom level.
 */
async function svgToVectorPdf(
  svgElement: SVGSVGElement,
  filename: string,
  options?: { width?: number; height?: number; transparent?: boolean }
) {
  // Clone the SVG so we don't modify the original
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  const svgWidth = parseFloat(clonedSvg.getAttribute('width') || '800');
  const svgHeight = parseFloat(clonedSvg.getAttribute('height') || '600');
  const targetW = options?.width || svgWidth;
  const targetH = options?.height || svgHeight;

  // Ensure viewBox exists
  if (!clonedSvg.getAttribute('viewBox')) {
    clonedSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  }
  clonedSvg.setAttribute('width', String(targetW));
  clonedSvg.setAttribute('height', String(targetH));

  // Handle transparent background
  if (options?.transparent) {
    const bgRect = clonedSvg.querySelector('rect:first-child');
    if (bgRect) bgRect.setAttribute('fill', 'none');
  }

  // Create PDF with exact dimensions
  const isLandscape = targetW > targetH;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [targetW, targetH],
  });

  // Render SVG as vector graphics into the PDF
  // The svg2pdf.js plugin adds a .svg() method to jsPDF
  await pdf.svg(clonedSvg, {
    x: 0,
    y: 0,
    width: targetW,
    height: targetH,
  });

  pdf.save(`${filename.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`);
}

/**
 * Raster fallback for non-SVG content (e.g. ApexCharts)
 */
async function rasterPdfFallback(
  element: HTMLElement,
  filename: string,
  options?: { width?: number; height?: number }
) {
  const { toPng } = await import('html-to-image');

  const targetW = options?.width || element.offsetWidth;
  const targetH = options?.height || element.offsetHeight;

  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    width: targetW,
    height: targetH,
  });

  const isLandscape = targetW > targetH;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'px',
    format: [targetW, targetH],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, targetW, targetH);
  pdf.save(`${filename.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`);
}
