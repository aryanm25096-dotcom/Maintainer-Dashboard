import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  filename?: string;
  format?: 'A4' | 'A3' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  scale?: number;
}

export const exportToPDF = async (
  elementId: string,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = `export-${Date.now()}.pdf`,
    format = 'A4',
    orientation = 'portrait',
    quality = 0.92,
    scale = 2
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Create canvas from element
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    // Calculate dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // PDF dimensions
    const pdfWidth = format === 'A4' ? 210 : format === 'A3' ? 297 : 216; // mm
    const pdfHeight = format === 'A4' ? 297 : format === 'A3' ? 420 : 279; // mm
    
    const orientationMultiplier = orientation === 'landscape' ? 1 : 0;
    const finalWidth = orientation === 'landscape' ? pdfHeight : pdfWidth;
    const finalHeight = orientation === 'landscape' ? pdfWidth : pdfHeight;

    // Calculate scaling
    const widthRatio = finalWidth / imgWidth;
    const heightRatio = finalHeight / imgHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', quality);
    pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

export const exportDashboardToPDF = async (options: ExportOptions = {}): Promise<void> => {
  return exportToPDF('maintainer-dashboard', {
    filename: `maintainer-dashboard-${Date.now()}.pdf`,
    ...options
  });
};

export const exportProfileToPDF = async (options: ExportOptions = {}): Promise<void> => {
  return exportToPDF('shareable-profile', {
    filename: `maintainer-profile-${Date.now()}.pdf`,
    ...options
  });
};

export const exportChartToPDF = async (chartId: string, options: ExportOptions = {}): Promise<void> => {
  return exportToPDF(chartId, {
    filename: `chart-${chartId}-${Date.now()}.pdf`,
    ...options
  });
};
