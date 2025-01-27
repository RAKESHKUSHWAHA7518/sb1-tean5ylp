import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BusinessFormData } from '../types';

export const generatePDF = async (
  templateRef: React.RefObject<HTMLDivElement>,
  data: BusinessFormData
) => {
  if (!templateRef.current) {
    throw new Error('Template reference is not available');
  }

  try {
    // Ensure styles are loaded
    await document.fonts.ready;
    
    // Wait for any potential state updates and DOM rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    const element = templateRef.current;
    
    // Temporarily make the element visible for capture
    const originalStyles = {
      position: element.style.position,
      left: element.style.left,
      top: element.style.top,
      zIndex: element.style.zIndex,
      visibility: element.style.visibility,
    };

    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '-9999';
    element.style.visibility = 'visible';

    // Calculate dimensions to match the form exactly
    const PAGE_WIDTH = 816;
    const PAGE_HEIGHT = 1250; // Increased height to ensure all content fits

    // Adjusted canvas settings for better quality and full capture
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      windowWidth: PAGE_WIDTH,
      windowHeight: PAGE_HEIGHT,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-pdf-container]') as HTMLElement;
        if (clonedElement) {
          clonedElement.style.height = PAGE_HEIGHT + 'px';
          clonedElement.style.overflow = 'visible';
          clonedElement.style.position = 'relative';
        }
      },
      foreignObjectRendering: false,
      removeContainer: false,
      allowTaint: true,
    });

    // Restore original styles
    Object.assign(element.style, originalStyles);

    // Create PDF with exact dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [PAGE_WIDTH, PAGE_HEIGHT],
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    // Add the image to fill the entire page
    pdf.addImage(imgData, 'JPEG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT, undefined, 'FAST');
    
    pdf.save('business-application.pdf');
    // pdf.output('blob');
    const pdfBlob = pdf.output('blob');

    // Create a File object from the Blob
    const pdfFile = new File([pdfBlob], 'business-application.pdf', { type: 'application/pdf' });

    return pdfFile;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};