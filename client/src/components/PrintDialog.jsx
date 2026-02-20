import React, { useState } from 'react';
import { RiCloseLine, RiPrinterLine, RiSettings3Line } from 'react-icons/ri';

const PrintDialog = ({ isOpen, onClose, slides, presentationMeta, currentSlide }) => {
  const [printSettings, setPrintSettings] = useState({
    printer: 'Default Printer',
    copies: 1,
    printWhat: 'slides', // slides, handouts, notes, outline
    slideRange: 'all', // all, current, selection, custom
    customRange: '',
    slidesPerPage: 6,
    orientation: 'portrait',
    paperSize: 'A4',
    colorMode: 'color', // color, grayscale, blackwhite
    quality: 'high', // draft, normal, high
    includeHiddenSlides: false,
    scaleToFitPaper: true,
    frameSlides: true,
    includeComments: false,
    includeInkAnnotations: false,
    printSlideNumbers: true,
    printDate: false,
    printFileName: false,
    collate: true,
    duplex: 'none', // none, longEdge, shortEdge
    margins: 'normal' // narrow, normal, wide, custom
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const handlePrint = async () => {
    try {
      // Determine which slides to print
      let slidesToPrint = [];
      
      switch (printSettings.slideRange) {
        case 'all':
          slidesToPrint = slides;
          break;
        case 'current':
          slidesToPrint = [slides[currentSlide]];
          break;
        case 'custom':
          // Parse custom range (e.g., "1-3,5,7-9")
          const ranges = printSettings.customRange.split(',');
          ranges.forEach(range => {
            if (range.includes('-')) {
              const [start, end] = range.split('-').map(n => parseInt(n.trim()) - 1);
              for (let i = start; i <= end && i < slides.length; i++) {
                if (i >= 0) slidesToPrint.push(slides[i]);
              }
            } else {
              const index = parseInt(range.trim()) - 1;
              if (index >= 0 && index < slides.length) {
                slidesToPrint.push(slides[index]);
              }
            }
          });
          break;
        default:
          slidesToPrint = slides;
      }

      // Filter hidden slides if needed
      if (!printSettings.includeHiddenSlides) {
        slidesToPrint = slidesToPrint.filter(slide => !slide.hidden);
      }

      await printPresentation(slidesToPrint, printSettings, presentationMeta);
      onClose();
    } catch (error) {
      console.error('Print failed:', error);
      alert('Print failed: ' + error.message);
    }
  };

  const printPresentation = async (slidesToPrint, settings, meta) => {
    // Load logo
    let logoData = null;
    try {
      const logoResponse = await fetch('/DOCS-LOGO-final-transparent.png');
      if (logoResponse.ok) {
        const logoBlob = await logoResponse.blob();
        logoData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(logoBlob);
        });
      }
    } catch (error) {
      console.warn('Could not load logo for print:', error);
    }

    // Create print window
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    // Generate content based on print type
    let content = '';
    
    switch (settings.printWhat) {
      case 'slides':
        content = generateSlidesContent(slidesToPrint, settings, meta, logoData);
        break;
      case 'handouts':
        content = generateHandoutsContent(slidesToPrint, settings, meta, logoData);
        break;
      case 'notes':
        content = generateNotesContent(slidesToPrint, settings, meta, logoData);
        break;
      case 'outline':
        content = generateOutlineContent(slidesToPrint, settings, meta, logoData);
        break;
      default:
        content = generateSlidesContent(slidesToPrint, settings, meta, logoData);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print - ${meta.title || 'Presentation'}</title>
          <style>
            ${generatePrintStyles(settings)}
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Print after content loads
    printWindow.onload = () => {
      setTimeout(() => {
        try {
          printWindow.print();
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
          }, 500);
        } catch (error) {
          console.error('Print failed:', error);
          alert('Print failed. Please try again.');
        }
      }, 200);
    };
  };

  const generatePrintStyles = (settings) => {
    const isLandscape = settings.orientation === 'landscape';
    const paperSize = settings.paperSize.toLowerCase();
    
    return `
      @media print {
        @page { 
          size: ${paperSize} ${settings.orientation}; 
          margin: ${getMarginSize(settings.margins)}; 
        }
        body {
          margin: 0; 
          padding: 0; 
          background: white;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          ${settings.colorMode === 'grayscale' ? 'filter: grayscale(100%);' : ''}
          ${settings.colorMode === 'blackwhite' ? 'filter: grayscale(100%) contrast(200%);' : ''}
        }
        .print-page {
          page-break-after: always;
          width: 100%;
          height: ${settings.orientation === 'landscape' ? '210mm' : '297mm'};
          position: relative;
          box-sizing: border-box;
        }
        .print-page:last-child {
          page-break-after: avoid;
        }
        .slide-container {
          ${settings.printWhat === 'handouts' ? getHandoutLayout(settings.slidesPerPage) : 'width: 960px; height: 540px; max-width: 100%; max-height: 100%; aspect-ratio: 16/9; margin: 0 auto;'}
          ${settings.frameSlides ? 'border: 1px solid #999;' : ''}
          ${settings.scaleToFitPaper ? 'box-sizing: border-box;' : ''}
        }
        .slide-mini {
          position: relative;
          ${settings.frameSlides ? 'border: 1px solid #999; margin: 2px;' : ''}
          border-radius: 4px;
          overflow: hidden;
          background: white;
        }
        .header-footer {
          position: fixed;
          font-size: 10px;
          color: #666;
        }
        .header {
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
        }
        .footer {
          bottom: 10px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
        }
        * { 
          -webkit-print-color-adjust: exact !important; 
          color-adjust: exact !important; 
          box-sizing: border-box; 
        }
      }
      @media screen {
        body {
          margin: 0; 
          padding: 20px; 
          background: #f5f5f5; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .print-page {
          background: white;
          margin-bottom: 20px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-height: 800px;
        }
        .slide-container {
          ${settings.printWhat === 'handouts' ? getHandoutLayout(settings.slidesPerPage) : ''}
        }
        .slide-mini {
          position: relative;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          background: white;
        }
      }
    `;
  };

  const getMarginSize = (margins) => {
    switch (margins) {
      case 'narrow': return '0.25in';
      case 'normal': return '0.75in';
      case 'wide': return '1in';
      default: return '0.75in';
    }
  };

  const getHandoutLayout = (slidesPerPage) => {
    switch (slidesPerPage) {
      case 1: return 'display: block; width: 100%; height: 100%;';
      case 2: return 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 100%;';
      case 3: return 'display: grid; grid-template-columns: 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 15px; height: 100%;';
      case 4: return 'display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 15px; height: 100%;';
      case 6: return 'display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10px; height: 100%;';
      case 9: return 'display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 8px; height: 100%;';
      default: return 'display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10px; height: 100%;';
    }
  };

  const generateSlidesContent = (slidesToPrint, settings, meta, logoData) => {
    return slidesToPrint.map((slide, index) => `
      <div class="print-page">
        ${generateHeaderFooter(settings, meta, index + 1, slidesToPrint.length)}
        <div style="width: 100%; height: 85%; display: flex; align-items: center; justify-content: center; padding: 20px;">
          <div class="slide-container" style="
            background: ${slide.background || '#ffffff'}; 
            color: ${slide.textColor || '#000000'};
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            ${settings.frameSlides ? 'border: 2px solid #333;' : ''}
          ">
            ${slide.title ? `<h1 style="font-size: 36px; margin-bottom: 30px; text-align: center;">${slide.title}</h1>` : ''}
            ${slide.content ? `<div style="font-size: 24px; line-height: 1.5;">${slide.content.replace(/<[^>]*>/g, '')}</div>` : ''}
            ${settings.printSlideNumbers ? `<div style="position: absolute; bottom: 10px; right: 10px; font-size: 14px; opacity: 0.7;">${index + 1}</div>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  };

  const generateHandoutsContent = (slidesToPrint, settings, meta, logoData) => {
    const pages = [];
    const slidesPerPage = settings.slidesPerPage;
    
    for (let i = 0; i < slidesToPrint.length; i += slidesPerPage) {
      const pageSlides = slidesToPrint.slice(i, i + slidesPerPage);
      const slideHtml = pageSlides.map((slide, index) => {
        const slideIndex = i + index;
        return `
          <div class="slide-mini">
            <div style="
              width: 100%; 
              height: 100%; 
              background: ${slide.background || '#ffffff'}; 
              color: ${slide.textColor || '#000000'};
              padding: 8px;
              font-size: 8px;
              position: relative;
              min-height: 120px;
            ">
              ${slide.title ? `<div style="font-weight: bold; margin-bottom: 4px; font-size: 10px;">${slide.title}</div>` : ''}
              ${slide.content ? `<div style="font-size: 7px; line-height: 1.2;">${slide.content.replace(/<[^>]*>/g, '').substring(0, 100)}${slide.content.replace(/<[^>]*>/g, '').length > 100 ? '...' : ''}</div>` : ''}
              ${settings.printSlideNumbers ? `<div style="position: absolute; bottom: 2px; right: 4px; font-size: 8px; font-weight: bold;">${slideIndex + 1}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');

      pages.push(`
        <div class="print-page">
          ${generateHeaderFooter(settings, meta, Math.floor(i / slidesPerPage) + 1, Math.ceil(slidesToPrint.length / slidesPerPage))}
          <div class="slide-container">
            ${slideHtml}
          </div>
        </div>
      `);
    }
    
    return pages.join('');
  };

  const generateNotesContent = (slidesToPrint, settings, meta, logoData) => {
    return slidesToPrint.map((slide, index) => `
      <div class="print-page">
        ${generateHeaderFooter(settings, meta, index + 1, slidesToPrint.length)}
        <div style="display: flex; flex-direction: column; height: 90%;">
          <div style="flex: 1; margin-bottom: 20px;">
            <div style="
              width: 960px; 
              height: 540px; 
              max-width: 100%;
              aspect-ratio: 16/9;
              background: ${slide.background || '#ffffff'}; 
              color: ${slide.textColor || '#000000'};
              padding: 20px;
              border: 1px solid #ccc;
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin: 0 auto;
            ">
              ${slide.title ? `<h2 style="font-size: 24px; margin-bottom: 15px;">${slide.title}</h2>` : ''}
              ${slide.content ? `<div style="font-size: 16px; line-height: 1.4;">${slide.content.replace(/<[^>]*>/g, '')}</div>` : ''}
            </div>
          </div>
          <div style="flex: 1; border-top: 1px solid #ccc; padding-top: 20px;">
            <h3 style="margin-bottom: 15px; font-size: 18px;">Speaker Notes:</h3>
            <div style="font-size: 14px; line-height: 1.6; min-height: 200px; border: 1px solid #eee; padding: 15px; background: #fafafa;">
              ${slide.notes || 'No notes for this slide.'}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  };

  const generateOutlineContent = (slidesToPrint, settings, meta, logoData) => {
    const outlineContent = slidesToPrint.map((slide, index) => `
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
          ${settings.printSlideNumbers ? `${index + 1}. ` : ''}${slide.title || `Slide ${index + 1}`}
        </h3>
        ${slide.content ? `<div style="font-size: 12px; line-height: 1.5; margin-left: 20px; color: #555;">${slide.content.replace(/<[^>]*>/g, '')}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="print-page">
        ${generateHeaderFooter(settings, meta, 1, 1)}
        <div style="padding: 20px;">
          <h1 style="font-size: 24px; margin-bottom: 30px; text-align: center;">${meta.title || 'Presentation'} - Outline</h1>
          ${outlineContent}
        </div>
      </div>
    `;
  };

  const generateHeaderFooter = (settings, meta, pageNum, totalPages) => {
    let header = '';
    let footer = '';

    if (settings.printFileName || settings.printDate) {
      header = `<div class="header-footer header">`;
      if (settings.printFileName) {
        header += `${meta.title || 'Presentation'}`;
      }
      if (settings.printDate) {
        header += `${settings.printFileName ? ' - ' : ''}${new Date().toLocaleDateString()}`;
      }
      header += `</div>`;
    }

    footer = `
      <div class="header-footer footer">
        <div>${meta.author || ''}</div>
        <div>Page ${pageNum} of ${totalPages}</div>
      </div>
    `;

    return header + footer;
  };

  // Print Preview Modal
  const PrintPreview = () => {
    if (!showPreview) return null;

    // Determine which slides to preview
    let slidesToPreview = [];
    switch (printSettings.slideRange) {
      case 'all':
        slidesToPreview = slides;
        break;
      case 'current':
        slidesToPreview = [slides[currentSlide]];
        break;
      case 'custom':
        const ranges = printSettings.customRange.split(',');
        ranges.forEach(range => {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()) - 1);
            for (let i = start; i <= end && i < slides.length; i++) {
              if (i >= 0) slidesToPreview.push(slides[i]);
            }
          } else {
            const index = parseInt(range.trim()) - 1;
            if (index >= 0 && index < slides.length) {
              slidesToPreview.push(slides[index]);
            }
          }
        });
        break;
      default:
        slidesToPreview = slides;
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[90vw] h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Print Preview</h3>
            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <RiCloseLine size={20} />
            </button>
          </div>
          <div className="p-4 h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              {printSettings.printWhat === 'handouts' ? (
                // Handout preview
                (() => {
                  const pages = [];
                  const slidesPerPage = printSettings.slidesPerPage;
                  for (let i = 0; i < slidesToPreview.length; i += slidesPerPage) {
                    const pageSlides = slidesToPreview.slice(i, i + slidesPerPage);
                    pages.push(
                      <div key={i} className="bg-white p-8 mb-6 shadow-lg" style={{ aspectRatio: printSettings.orientation === 'landscape' ? '297/210' : '210/297' }}>
                        <div className={`grid gap-4 h-full ${
                          slidesPerPage === 1 ? 'grid-cols-1' :
                          slidesPerPage === 2 ? 'grid-cols-2' :
                          slidesPerPage === 3 ? 'grid-cols-1 grid-rows-3' :
                          slidesPerPage === 4 ? 'grid-cols-2 grid-rows-2' :
                          slidesPerPage === 6 ? 'grid-cols-3 grid-rows-2' :
                          'grid-cols-3 grid-rows-3'
                        }`}>
                          {pageSlides.map((slide, index) => (
                            <div key={index} className="border border-gray-300 rounded p-2 text-xs" style={{ backgroundColor: slide.background || '#ffffff' }}>
                              <div className="font-bold mb-1" style={{ color: slide.textColor || '#000000' }}>
                                {slide.title || `Slide ${i + index + 1}`}
                              </div>
                              <div className="text-xs" style={{ color: slide.textColor || '#666666' }}>
                                {slide.content ? slide.content.replace(/<[^>]*>/g, '').substring(0, 50) + '...' : 'Content'}
                              </div>
                              {printSettings.printSlideNumbers && (
                                <div className="text-right text-xs font-bold mt-1">{i + index + 1}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return pages;
                })()
              ) : (
                // Full slide preview
                slidesToPreview.map((slide, index) => (
                  <div key={index} className="bg-white p-8 mb-6 shadow-lg" style={{ aspectRatio: '16/9' }}>
                    <div className="w-full h-full flex flex-col justify-center p-8" style={{ backgroundColor: slide.background || '#ffffff', color: slide.textColor || '#000000' }}>
                      {slide.title && <h1 className="text-3xl font-bold mb-4 text-center">{slide.title}</h1>}
                      {slide.content && <div className="text-lg" dangerouslySetInnerHTML={{ __html: slide.content }} />}
                      {printSettings.printSlideNumbers && (
                        <div className="absolute bottom-4 right-4 text-sm opacity-70">{index + 1}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors mr-3"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                handlePrint();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-flex items-center"
            >
              <RiPrinterLine className="w-4 h-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PrintPreview />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <RiPrinterLine className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Print</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Printer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Printer
            </label>
            <select
              value={printSettings.printer}
              onChange={(e) => setPrintSettings({...printSettings, printer: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Default Printer">Default Printer</option>
              <option value="Microsoft Print to PDF">Microsoft Print to PDF</option>
              <option value="Save as PDF">Save as PDF</option>
            </select>
          </div>

          {/* Print What */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Print what
            </label>
            <select
              value={printSettings.printWhat}
              onChange={(e) => setPrintSettings({...printSettings, printWhat: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="slides">Slides</option>
              <option value="handouts">Handouts</option>
              <option value="notes">Notes Pages</option>
              <option value="outline">Outline View</option>
            </select>
          </div>

          {/* Slides Per Page (for handouts) */}
          {printSettings.printWhat === 'handouts' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slides per page
              </label>
              <select
                value={printSettings.slidesPerPage}
                onChange={(e) => setPrintSettings({...printSettings, slidesPerPage: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>
            </div>
          )}

          {/* Print Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Print range
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={printSettings.slideRange === 'all'}
                  onChange={(e) => setPrintSettings({...printSettings, slideRange: e.target.value})}
                  className="mr-2"
                />
                All slides ({slides.length} slides)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="current"
                  checked={printSettings.slideRange === 'current'}
                  onChange={(e) => setPrintSettings({...printSettings, slideRange: e.target.value})}
                  className="mr-2"
                />
                Current slide (slide {currentSlide + 1})
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="custom"
                  checked={printSettings.slideRange === 'custom'}
                  onChange={(e) => setPrintSettings({...printSettings, slideRange: e.target.value})}
                  className="mr-2"
                />
                Custom range:
                <input
                  type="text"
                  placeholder="e.g., 1-3,5,7-9"
                  value={printSettings.customRange}
                  onChange={(e) => setPrintSettings({...printSettings, customRange: e.target.value})}
                  className="ml-2 flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  disabled={printSettings.slideRange !== 'custom'}
                />
              </label>
            </div>
          </div>

          {/* Copies */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Copies
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={printSettings.copies}
                onChange={(e) => setPrintSettings({...printSettings, copies: parseInt(e.target.value) || 1})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="collate"
                checked={printSettings.collate}
                onChange={(e) => setPrintSettings({...printSettings, collate: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="collate" className="text-sm text-gray-700 dark:text-gray-300">
                Collate
              </label>
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <RiSettings3Line className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} advanced options</span>
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Orientation
                  </label>
                  <select
                    value={printSettings.orientation}
                    onChange={(e) => setPrintSettings({...printSettings, orientation: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paper size
                  </label>
                  <select
                    value={printSettings.paperSize}
                    onChange={(e) => setPrintSettings({...printSettings, paperSize: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                    <option value="A3">A3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <select
                    value={printSettings.colorMode}
                    onChange={(e) => setPrintSettings({...printSettings, colorMode: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="color">Color</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="blackwhite">Black and White</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality
                  </label>
                  <select
                    value={printSettings.quality}
                    onChange={(e) => setPrintSettings({...printSettings, quality: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Margins
                </label>
                <select
                  value={printSettings.margins}
                  onChange={(e) => setPrintSettings({...printSettings, margins: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="narrow">Narrow</option>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={printSettings.scaleToFitPaper}
                    onChange={(e) => setPrintSettings({...printSettings, scaleToFitPaper: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Scale to fit paper</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={printSettings.frameSlides}
                    onChange={(e) => setPrintSettings({...printSettings, frameSlides: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Frame slides</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={printSettings.printSlideNumbers}
                    onChange={(e) => setPrintSettings({...printSettings, printSlideNumbers: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Print slide numbers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={printSettings.printDate}
                    onChange={(e) => setPrintSettings({...printSettings, printDate: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Print date</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={printSettings.printFileName}
                    onChange={(e) => setPrintSettings({...printSettings, printFileName: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Print file name</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={printSettings.includeHiddenSlides}
                    onChange={(e) => setPrintSettings({...printSettings, includeHiddenSlides: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include hidden slides</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {printSettings.slideRange === 'all' ? `${slides.length} slides` : 
             printSettings.slideRange === 'current' ? '1 slide' : 
             'Custom range'} • {printSettings.copies} {printSettings.copies === 1 ? 'copy' : 'copies'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-flex items-center"
            >
              <RiPrinterLine className="w-4 h-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PrintDialog;