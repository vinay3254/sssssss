// Enhanced export utilities with comprehensive format support
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Function to generate a sample PowerPoint presentation with all features
export const generateSamplePresentation = async (filename = 'EtherXPPT_Sample') => {
  const pptx = new PptxGenJS();

  pptx.author = 'EtherXPPT';
  pptx.company = 'EtherXPPT';
  pptx.subject = 'Sample Presentation with Editable Elements';
  pptx.title = 'EtherXPPT Demo';

  pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
  pptx.layout = 'CUSTOM';

  // Slide 1: Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: '003366' };
  slide1.addText('EtherXPPT Demo', {
    x: 1, y: 1.5, w: 8, h: 1, fontSize: 48, bold: true, color: 'FFFFFF', align: 'center'
  });
  slide1.addText('Fully Editable PowerPoint Presentation', {
    x: 1, y: 3, w: 8, h: 0.8, fontSize: 24, color: 'FFFFFF', align: 'center'
  });

  // Slide 2: Text Boxes and Shapes
  const slide2 = pptx.addSlide();
  slide2.addText('Editable Text Boxes and Shapes', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 36, bold: true, align: 'center'
  });

  // Text box
  slide2.addText('This is an editable text box. You can modify this text in PowerPoint.', {
    x: 1, y: 1.5, w: 4, h: 1, fontSize: 18, fill: { color: 'E6F3FF' }
  });

  // Rectangle shape
  slide2.addShape('rect', {
    x: 6, y: 1.5, w: 2, h: 1, fill: { color: 'FF6B6B' }, line: { color: '000000', width: 2 }
  });

  // Circle shape
  slide2.addShape('ellipse', {
    x: 6.5, y: 3, w: 1, h: 1, fill: { color: '4ECDC4' }, line: { color: '000000', width: 2 }
  });

  // Triangle shape
  slide2.addShape('triangle', {
    x: 7.5, y: 3, w: 1, h: 1, fill: { color: '45B7D1' }, line: { color: '000000', width: 2 }
  });

  // Slide 3: Charts
  const slide3 = pptx.addSlide();
  slide3.addText('Editable Charts', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 36, bold: true, align: 'center'
  });

  // Bar chart data
  const barData = [
    {
      name: 'Sales Q1',
      labels: ['Jan', 'Feb', 'Mar'],
      values: [10, 20, 30]
    },
    {
      name: 'Sales Q2',
      labels: ['Apr', 'May', 'Jun'],
      values: [15, 25, 35]
    }
  ];

  slide3.addChart('bar', barData, {
    x: 0.5, y: 1.2, w: 4.5, h: 3, title: 'Quarterly Sales', showLegend: true, showDataLabels: true,
    chartColors: ['4ECDC4', '45B7D1']
  });

  // Pie chart
  const pieData = [
    {
      name: 'Market Share',
      labels: ['Product A', 'Product B', 'Product C'],
      values: [40, 35, 25]
    }
  ];

  slide3.addChart('pie', pieData, {
    x: 5.5, y: 1.2, w: 4, h: 3, title: 'Market Share', showLegend: true, showDataLabels: true,
    chartColors: ['FF6B6B', '4ECDC4', '45B7D1']
  });

  // Slide 4: SmartArt-like diagram (using shapes and text)
  const slide4 = pptx.addSlide();
  slide4.addText('SmartArt-Style Diagram', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 36, bold: true, align: 'center'
  });

  // Process flow diagram
  slide4.addShape('rect', { x: 1, y: 1.5, w: 1.5, h: 0.8, fill: { color: 'FFE66D' } });
  slide4.addText('Step 1', { x: 1, y: 1.5, w: 1.5, h: 0.8, fontSize: 14, align: 'center' });

  slide4.addShape('rect', { x: 3, y: 1.5, w: 1.5, h: 0.8, fill: { color: 'FFE66D' } });
  slide4.addText('Step 2', { x: 3, y: 1.5, w: 1.5, h: 0.8, fontSize: 14, align: 'center' });

  slide4.addShape('rect', { x: 5, y: 1.5, w: 1.5, h: 0.8, fill: { color: 'FFE66D' } });
  slide4.addText('Step 3', { x: 5, y: 1.5, w: 1.5, h: 0.8, fontSize: 14, align: 'center' });

  slide4.addShape('rect', { x: 7, y: 1.5, w: 1.5, h: 0.8, fill: { color: 'FFE66D' } });
  slide4.addText('Step 4', { x: 7, y: 1.5, w: 1.5, h: 0.8, fontSize: 14, align: 'center' });

  // Arrows
  slide4.addShape('rightArrow', { x: 2.5, y: 1.8, w: 0.5, h: 0.2, fill: { color: '000000' } });
  slide4.addShape('rightArrow', { x: 4.5, y: 1.8, w: 0.5, h: 0.2, fill: { color: '000000' } });
  slide4.addShape('rightArrow', { x: 6.5, y: 1.8, w: 0.5, h: 0.2, fill: { color: '000000' } });

  // Slide 5: Table
  const slide5 = pptx.addSlide();
  slide5.addText('Editable Table', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 36, bold: true, align: 'center'
  });

  const tableData = [
    ['Product', 'Q1', 'Q2', 'Q3', 'Q4'],
    ['Widget A', '100', '120', '140', '160'],
    ['Widget B', '80', '90', '110', '130'],
    ['Widget C', '60', '70', '80', '90']
  ];

  slide5.addTable(tableData, {
    x: 1, y: 1.2, w: 8, h: 3, fill: { color: 'F8F9FA' }, border: { color: '000000', pt: 1 }
  });

  // Slide 6: Layout Examples
  const slide6 = pptx.addSlide();
  slide6.addText('Slide Layouts', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 36, bold: true, align: 'center'
  });

  // Two column layout
  slide6.addText('Left Column\n\nThis demonstrates a two-column layout that can be edited in PowerPoint.', {
    x: 0.5, y: 1.2, w: 4.5, h: 3, fontSize: 16
  });

  slide6.addText('Right Column\n\nYou can modify text, add images, and adjust formatting.', {
    x: 5.5, y: 1.2, w: 4.5, h: 3, fontSize: 16
  });

  // Save the presentation
  await pptx.writeFile({ fileName: `${filename}.pptx` });
  console.log('Sample PowerPoint presentation generated');
  return `${filename}.pptx`;
};

export const exportToJSON = (slides, filename = 'presentation.json') => {
  const data = JSON.stringify({ slides, exportedAt: new Date().toISOString() }, null, 2);
  downloadFile(data, filename, 'application/json');
};

export const importFromJSON = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    return data.slides || [];
  } catch (error) {
    console.error('Error importing from JSON:', error);
    return [];
  }
};

export const exportPresentation = async (slides, format, filename = 'presentation') => {
  try {
    switch (format) {
      case 'pptx':
        return await exportToPowerPoint(slides, filename);
      case 'pdf':
        return await exportToPDF(slides, filename);
      case 'odp':
        return await exportToODP(slides, filename);
      case 'docx':
        return await exportToWord(slides, filename);
      case 'rtf':
        return await exportToRTF(slides, filename);
      case 'mp4':
        return await exportToVideo(slides, filename);
      case 'png':
        return await exportToPNG(slides, filename);
      case 'jpeg':
        return await exportToJPEG(slides, filename);
      default:
        // Fallback to JSON export for unsupported formats
        console.warn(`Format ${format} not fully supported, exporting as JSON`);
        return exportToJSON(slides, `${filename}.json`);
    }
  } catch (error) {
    console.error(`Export failed for format ${format}:`, error);
    // Fallback to JSON export if the requested format fails
    console.log('Falling back to JSON export...');
    return exportToJSON(slides, `${filename}.json`);
  }
};

const exportToPowerPoint = async (slides, filename) => {
  try {
    const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.author = 'EtherXPPT';
  pptx.company = 'EtherXPPT';
  pptx.subject = 'Presentation';
  pptx.title = filename;

  // Define slide size (16:9 aspect ratio)
  pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
  pptx.layout = 'CUSTOM';

  // Load logo as base64
  let logoData = null;
  try {
    const logoResponse = await fetch('/logo-transparent.png');
    if (!logoResponse.ok) {
      throw new Error(`HTTP error! status: ${logoResponse.status}`);
    }
    const logoBlob = await logoResponse.blob();
    logoData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read logo file'));
      reader.readAsDataURL(logoBlob);
    });
    console.log('Logo loaded successfully for PowerPoint export');
  } catch (error) {
    console.error('Could not load logo for PowerPoint export:', error);
  }

  for (const slideData of slides) {
    const slide = pptx.addSlide();

    // Set slide background
    if (slideData.background && slideData.background !== '#ffffff') {
      slide.background = { color: slideData.background };
    }

    // Add logo to each slide (top-right corner)
    if (logoData) {
      try {
        slide.addImage({
          data: logoData,
          x: 8.0,
          y: 0.1,
          w: 1.5,
          h: 0.8
        });
        console.log('Logo added to slide successfully');
      } catch (error) {
        console.error('Failed to add logo to slide:', error);
      }
    } else {
      console.warn('Logo data not available for slide');
    }

    // Add header/footer if present
    // Note: PptxGenJS doesn't directly support headers/footers, but we can add text boxes

    // Add title and content based on layout
    const layout = slideData.layout || 'title-content';

    if (layout === 'title-content') {
      // Title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 1,
          fontSize: 44,
          bold: true,
          color: (slideData.textColor || '#000000').replace('#', ''),
          align: 'center'
        });
      }

      // Content
      if (slideData.content) {
        slide.addText(slideData.content.replace(/<[^>]*>/g, ''), {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 3,
          fontSize: 24,
          color: (slideData.textColor || '#000000').replace('#', '')
        });
      }
    } else if (layout === 'title-only') {
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 2,
          fontSize: 44,
          bold: true,
          color: (slideData.textColor || '#000000').replace('#', ''),
          align: 'center'
        });
      }
    } else if (layout === 'content-only') {
      if (slideData.content) {
        slide.addText(slideData.content.replace(/<[^>]*>/g, ''), {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 4,
          fontSize: 24,
          color: (slideData.textColor || '#000000').replace('#', '')
        });
      }
    } else if (layout === 'two-column') {
      // Left content
      if (slideData.contentLeft) {
        slide.addText(slideData.contentLeft.replace(/<[^>]*>/g, ''), {
          x: 0.3,
          y: 0.8,
          w: 4.5,
          h: 3.5,
          fontSize: 20,
          color: (slideData.textColor || '#000000').replace('#', '')
        });
      }

      // Right content
      if (slideData.contentRight) {
        slide.addText(slideData.contentRight.replace(/<[^>]*>/g, ''), {
          x: 5.2,
          y: 0.8,
          w: 4.5,
          h: 3.5,
          fontSize: 20,
          color: (slideData.textColor || '#000000').replace('#', '')
        });
      }
    } else if (layout === 'comparison') {
      // Left title
      if (slideData.compLeftTitle) {
        slide.addText(slideData.compLeftTitle.replace(/<[^>]*>/g, ''), {
          x: 0.3,
          y: 0.5,
          w: 4.5,
          h: 0.8,
          fontSize: 28,
          bold: true,
          color: (slideData.textColor || '#000000').replace('#', ''),
          align: 'center'
        });
      }

      // Left content
      if (slideData.compLeftContent) {
        slide.addText(slideData.compLeftContent.replace(/<[^>]*>/g, ''), {
          x: 0.3,
          y: 1.4,
          w: 4.5,
          h: 3,
          fontSize: 18,
          color: (slideData.textColor || '#000000').replace('#', '')
        });
      }

      // Right title
      if (slideData.compRightTitle) {
        slide.addText(slideData.compRightTitle.replace(/<[^>]*>/g, ''), {
          x: 5.2,
          y: 0.5,
          w: 4.5,
          h: 0.8,
          fontSize: 28,
          bold: true,
          color: (slideData.textColor || '#000000').replace('#', ''),
          align: 'center'
        });
      }

      // Right content
      if (slideData.compRightContent) {
        slide.addText(slideData.compRightContent.replace(/<[^>]*>/g, ''), {
          x: 5.2,
          y: 1.4,
          w: 4.5,
          h: 3,
          fontSize: 18,
          color: (slideData.textColor || '#000000').replace('#', '')
        });
      }
    }

    // Add elements and their animations
    if (slideData.elements) {
      for (const element of slideData.elements) {
        const x = (element.x || 0) / 100; // Convert from pixels to inches (assuming 100px = 1 inch)
        const y = (element.y || 0) / 100;
        const w = (element.width || 200) / 100;
        const h = (element.height || 100) / 100;

        let addedObject = null;

        // Check if this element has an animation
        let animationOptions = null;
        if (slideData.animations) {
          const elementAnimation = slideData.animations.find(anim => anim.target.toString() === element.id.toString());
          if (elementAnimation) {
            // Map animation types to PowerPoint animation types
            animationOptions = {
              type: 'appear',
              duration: elementAnimation.duration || 1000,
              delay: elementAnimation.delay || 0
            };

            switch (elementAnimation.type) {
              case 'fadeIn':
                animationOptions.type = 'fade';
                break;
              case 'slideInLeft':
                animationOptions.type = 'fly';
                animationOptions.direction = 'left';
                break;
              case 'slideInRight':
                animationOptions.type = 'fly';
                animationOptions.direction = 'right';
                break;
              case 'slideInUp':
                animationOptions.type = 'fly';
                animationOptions.direction = 'up';
                break;
              case 'slideInDown':
                animationOptions.type = 'fly';
                animationOptions.direction = 'down';
                break;
              case 'zoomIn':
                animationOptions.type = 'zoom';
                animationOptions.direction = 'in';
                break;
              case 'bounce':
                animationOptions.type = 'bounce';
                break;
              case 'pulse':
                animationOptions.type = 'pulse';
                break;
              case 'float':
                animationOptions.type = 'float';
                animationOptions.direction = 'up';
                break;
              case 'rotate':
                animationOptions.type = 'spin';
                break;
              default:
                animationOptions.type = 'appear';
            }
          }
        }

        if (element.type === 'textbox') {
          slide.addText(element.content || '', {
            x,
            y,
            w,
            h,
            fontSize: element.fontSize || 16,
            fontFace: element.fontFamily || 'Arial',
            color: (element.color || '#000000').replace('#', ''),
            fill: { color: (element.backgroundColor || 'transparent').replace('#', '') },
            animation: animationOptions
          });
        } else if (element.type === 'image') {
          const imageOptions = { x, y, w, h };
          if (animationOptions) imageOptions.animation = animationOptions;

          if (element.src && element.src.startsWith('data:image')) {
            // Base64 image
            slide.addImage({ data: element.src, ...imageOptions });
          } else if (element.src) {
            // URL image
            slide.addImage({ path: element.src, ...imageOptions });
          }
        } else if (element.type === 'shape') {
          let shapeType = 'rect';
          if (element.shapeType === 'circle') shapeType = 'ellipse';
          else if (element.shapeType === 'triangle') shapeType = 'triangle';

          // Strip # from colors for PptxGenJS
          const fillColor = (element.fill || '#FFFFFF').replace('#', '');
          const strokeColor = (element.stroke || '#000000').replace('#', '');

          slide.addShape(shapeType, {
            x,
            y,
            w,
            h,
            fill: { color: fillColor },
            line: { color: strokeColor, width: element.strokeWidth || 1 },
            animation: animationOptions
          });
        } else if (element.type === 'chart') {
          // Convert chart data to PptxGenJS format
          const chartData = element.data.datasets.map(ds => ({
            name: ds.label,
            labels: element.data.labels,
            values: ds.data
          }));

          let chartType = 'bar';
          if (element.chartType === 'line') chartType = 'line';
          else if (element.chartType === 'pie') chartType = 'pie';
          else if (element.chartType === 'doughnut') chartType = 'doughnut';

          slide.addChart(chartType, chartData, {
            x,
            y,
            w,
            h,
            chartColors: element.data.datasets.map(ds => (ds.color || '#3B82F6').replace('#', '')),
            showLegend: element.options?.legend ?? true,
            showDataLabels: element.options?.dataLabels ?? true,
            title: element.title || '',
            animation: animationOptions
          });
        } else if (element.type === 'table') {
          if (element.data && element.data.length > 0) {
            const tableData = [element.data[0].map(() => '')]; // Header row
            tableData.push(...element.data);

            slide.addTable(tableData, {
              x,
              y,
              w,
              h,
              fill: { color: (element.backgroundColor || '#FFFFFF').replace('#', '') },
              border: { color: (element.borderColor || '#000000').replace('#', ''), pt: 1 },
              animation: animationOptions
            });
          }
        }
      }
    }
  }

    // Save the presentation
    await pptx.writeFile({ fileName: `${filename}.pptx` });
    console.log('PowerPoint export completed');
  } catch (error) {
    console.error('PowerPoint export failed:', error);
    throw new Error('PowerPoint export failed: ' + error.message);
  }
};

const exportToPDF = async (slides, filename) => {
  try {
    console.log('Starting PDF export with', slides.length, 'slides');
    
    if (!slides || slides.length === 0) {
      throw new Error('No slides to export');
    }

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: 'a4'
    });
    
    console.log('PDF document created');

    // Load logo
    let logoImg = null;
    try {
      const logoResponse = await fetch('/logo-transparent.png');
      if (!logoResponse.ok) {
        console.warn('Logo fetch failed, continuing without logo');
      } else {
        const logoBlob = await logoResponse.blob();
        logoImg = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read logo file'));
          reader.readAsDataURL(logoBlob);
        });
        console.log('Logo loaded successfully for PDF export');
      }
    } catch (error) {
      console.warn('Could not load logo for PDF export, continuing without logo:', error);
    }

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      console.log(`Processing slide ${i + 1}/${slides.length}`);

      try {
        // Create a temporary div to render the slide
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '11.69in'; // A4 landscape width
        tempDiv.style.height = '8.27in'; // A4 landscape height
        tempDiv.style.backgroundColor = slide.background || '#ffffff';
        tempDiv.style.color = slide.textColor || '#000000';
        tempDiv.style.padding = '0.5in';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.zIndex = '-1';
        tempDiv.style.boxSizing = 'border-box';

        // Add title
        if (slide.title) {
          const titleDiv = document.createElement('div');
          titleDiv.style.fontSize = '36px';
          titleDiv.style.fontWeight = 'bold';
          titleDiv.style.textAlign = 'center';
          titleDiv.style.marginBottom = '0.5in';
          titleDiv.style.lineHeight = '1.2';
          titleDiv.textContent = slide.title.replace(/<[^>]*>/g, '');
          tempDiv.appendChild(titleDiv);
        }

        // Add content
        if (slide.content) {
          const contentDiv = document.createElement('div');
          contentDiv.style.fontSize = '24px';
          contentDiv.style.lineHeight = '1.4';
          contentDiv.innerHTML = slide.content.replace(/<[^>]*>/g, '').replace(/\n/g, '<br>');
          tempDiv.appendChild(contentDiv);
        }

        // Handle different layouts
        if (slide.layout === 'two-column') {
          tempDiv.innerHTML = '';
          const container = document.createElement('div');
          container.style.display = 'flex';
          container.style.gap = '0.5in';
          container.style.height = '100%';

          const leftCol = document.createElement('div');
          leftCol.style.flex = '1';
          leftCol.style.fontSize = '20px';
          leftCol.style.lineHeight = '1.4';
          leftCol.innerHTML = slide.contentLeft ? slide.contentLeft.replace(/<[^>]*>/g, '').replace(/\n/g, '<br>') : '';

          const rightCol = document.createElement('div');
          rightCol.style.flex = '1';
          rightCol.style.fontSize = '20px';
          rightCol.style.lineHeight = '1.4';
          rightCol.innerHTML = slide.contentRight ? slide.contentRight.replace(/<[^>]*>/g, '').replace(/\n/g, '<br>') : '';

          container.appendChild(leftCol);
          container.appendChild(rightCol);
          tempDiv.appendChild(container);
        }

        // Handle comparison layout
        if (slide.layout === 'comparison') {
          tempDiv.innerHTML = '';
          const container = document.createElement('div');
          container.style.display = 'flex';
          container.style.flexDirection = 'column';
          container.style.height = '100%';
          container.style.gap = '0.3in';

          // Left side
          const leftSection = document.createElement('div');
          leftSection.style.flex = '1';
          leftSection.style.display = 'flex';
          leftSection.style.flexDirection = 'column';

          if (slide.compLeftTitle) {
            const leftTitle = document.createElement('div');
            leftTitle.style.fontSize = '28px';
            leftTitle.style.fontWeight = 'bold';
            leftTitle.style.textAlign = 'center';
            leftTitle.style.marginBottom = '0.2in';
            leftTitle.textContent = slide.compLeftTitle.replace(/<[^>]*>/g, '');
            leftSection.appendChild(leftTitle);
          }

          if (slide.compLeftContent) {
            const leftContent = document.createElement('div');
            leftContent.style.fontSize = '18px';
            leftContent.style.lineHeight = '1.4';
            leftContent.innerHTML = slide.compLeftContent.replace(/<[^>]*>/g, '').replace(/\n/g, '<br>');
            leftSection.appendChild(leftContent);
          }

          // Right side
          const rightSection = document.createElement('div');
          rightSection.style.flex = '1';
          rightSection.style.display = 'flex';
          rightSection.style.flexDirection = 'column';

          if (slide.compRightTitle) {
            const rightTitle = document.createElement('div');
            rightTitle.style.fontSize = '28px';
            rightTitle.style.fontWeight = 'bold';
            rightTitle.style.textAlign = 'center';
            rightTitle.style.marginBottom = '0.2in';
            rightTitle.textContent = slide.compRightTitle.replace(/<[^>]*>/g, '');
            rightSection.appendChild(rightTitle);
          }

          if (slide.compRightContent) {
            const rightContent = document.createElement('div');
            rightContent.style.fontSize = '18px';
            rightContent.style.lineHeight = '1.4';
            rightContent.innerHTML = slide.compRightContent.replace(/<[^>]*>/g, '').replace(/\n/g, '<br>');
            rightSection.appendChild(rightContent);
          }

          container.appendChild(leftSection);
          container.appendChild(rightSection);
          tempDiv.appendChild(container);
        }

        document.body.appendChild(tempDiv);

        // Convert to canvas with error handling
        let canvas;
        try {
          canvas = await html2canvas(tempDiv, {
            width: 1400,
            height: 990,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: slide.background || '#ffffff'
          });
          console.log(`Canvas created for slide ${i + 1}`);
        } catch (canvasError) {
          console.error(`Canvas creation failed for slide ${i + 1}:`, canvasError);
          // Create a fallback canvas
          canvas = document.createElement('canvas');
          canvas.width = 1400;
          canvas.height = 990;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = slide.background || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = slide.textColor || '#000000';
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(slide.title || `Slide ${i + 1}`, canvas.width / 2, 150);
          ctx.font = '32px Arial';
          const lines = (slide.content || '').replace(/<[^>]*>/g, '').split('\n');
          lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, 250 + (index * 50));
          });
        }

        // Remove temp div
        if (tempDiv.parentNode) {
          document.body.removeChild(tempDiv);
        }

        // Add logo to canvas if available
        if (logoImg) {
          try {
            const logoCanvas = document.createElement('canvas');
            logoCanvas.width = 100;
            logoCanvas.height = 50;
            const logoCtx = logoCanvas.getContext('2d');

            const logoImage = new Image();
            logoImage.crossOrigin = 'anonymous';
            logoImage.src = logoImg;

            await new Promise((resolve, reject) => {
              logoImage.onload = () => {
                logoCtx.drawImage(logoImage, 0, 0, 100, 50);
                resolve();
              };
              logoImage.onerror = () => reject(new Error('Logo image load failed'));
              // Timeout after 5 seconds
              setTimeout(() => reject(new Error('Logo load timeout')), 5000);
            });

            // Draw logo on main canvas (top-right corner)
            const ctx = canvas.getContext('2d');
            ctx.drawImage(logoCanvas, canvas.width - 120, 20, 100, 50);
            console.log('Logo added to slide canvas');
          } catch (logoError) {
            console.warn('Failed to add logo to canvas, continuing without logo:', logoError);
          }
        }

        // Add to PDF
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, 11.69, 8.27);
        console.log(`Slide ${i + 1} added to PDF`);

      } catch (slideError) {
        console.error(`Failed to process slide ${i + 1}:`, slideError);
        // Continue with next slide instead of failing completely
        continue;
      }
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);
    console.log('PDF export completed successfully');

  } catch (error) {
    console.error('PDF export failed:', error);
    alert('PDF export failed: ' + error.message + '. Please check console for details.');
    throw error;
  }
};

const exportToODP = async (slides, filename) => {
  try {
    // Create ODP XML structure
    let odpContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" 
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" 
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" 
  xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" 
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" 
  xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" 
  office:version="1.2" office:mimetype="application/vnd.oasis.opendocument.presentation">
  <office:body>
    <office:presentation>`;

    slides.forEach((slide, index) => {
      odpContent += `
      <draw:page draw:name="Slide${index + 1}" draw:style-name="dp1">
        <draw:frame draw:style-name="gr1" draw:text-style-name="P1" 
          draw:layer="layout" svg:width="25cm" svg:height="3cm" 
          svg:x="2cm" svg:y="2cm">
          <draw:text-box>
            <text:p text:style-name="P1">${(slide.title || '').replace(/[<>&]/g, '')}</text:p>
          </draw:text-box>
        </draw:frame>
        <draw:frame draw:style-name="gr2" draw:text-style-name="P2" 
          draw:layer="layout" svg:width="25cm" svg:height="12cm" 
          svg:x="2cm" svg:y="6cm">
          <draw:text-box>
            <text:p text:style-name="P2">${(slide.content || '').replace(/<[^>]*>/g, '').replace(/[<>&]/g, '')}</text:p>
          </draw:text-box>
        </draw:frame>
      </draw:page>`;
    });

    odpContent += `
    </office:presentation>
  </office:body>
</office:document>`;

    downloadFile(odpContent, `${filename}.odp`, 'application/vnd.oasis.opendocument.presentation');
    console.log('ODP export completed');
  } catch (error) {
    console.error('ODP export failed:', error);
    throw error;
  }
};

const exportToWord = async (slides, filename) => {
  try {
    // Load logo
    let logoData = null;
    try {
      const logoResponse = await fetch('/logo-transparent.png');
      if (!logoResponse.ok) {
        throw new Error(`HTTP error! status: ${logoResponse.status}`);
      }
      const logoBlob = await logoResponse.blob();
      logoData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read logo file'));
        reader.readAsDataURL(logoBlob);
      });
      console.log('Logo loaded successfully for Word export');
    } catch (error) {
      console.error('Could not load logo for Word export:', error);
    }

    // Create clean HTML content without CSS styles (Word will handle formatting)
    let htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="utf-8">
  <title>${filename}</title>
  <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotPromoteQF/><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
</head>
<body>`;

    // Add logo at the top if available
    if (logoData) {
      htmlContent += `<div style="text-align: center; margin-bottom: 20pt;"><img src="${logoData}" style="width: 120pt; height: 60pt;" alt="EtherX Logo" /></div>`;
    }

    // Add presentation title
    htmlContent += `<div style="font-size: 28pt; font-weight: bold; text-align: center; margin-bottom: 40pt; page-break-after: always;">${filename}</div>`;

    // Add each slide with clean formatting
    slides.forEach((slide, index) => {
      htmlContent += `
  <div style="page-break-before: always;">
    <div style="font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 20pt;">${slide.title || `Slide ${index + 1}`}</div>
    <div style="font-size: 14pt; line-height: 1.5; margin-bottom: 30pt;">${(slide.content || '').replace(/<[^>]*>/g, '').replace(/\n/g, '<br>')}</div>
    <div style="font-size: 10pt; text-align: right; color: #666; margin-top: 20pt;">Slide ${index + 1}</div>
  </div>`;
    });

    htmlContent += `
</body>
</html>`;

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Word export completed');
  } catch (error) {
    console.error('Word export failed:', error);
    // Fallback to JSON export
    const data = JSON.stringify({ slides, format: 'docx' });
    downloadFile(data, `${filename}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    console.log('Word export failed, falling back to JSON');
  }
};

const exportToRTF = async (slides, filename) => {
  // Rich Text Format
  let rtfContent = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
  slides.forEach((slide, index) => {
    rtfContent += `\\par\\b Slide ${index + 1}: ${slide.title || 'Untitled'}\\b0\\par`;
    rtfContent += `${slide.content || ''}\\par\\par`;
  });
  rtfContent += '}';
  
  downloadFile(rtfContent, `${filename}.rtf`, 'application/rtf');
  console.log('RTF export completed');
};

const exportToVideo = async (slides, filename) => {
  // Video export with timings - would need video processing library
  const data = JSON.stringify({ slides, format: 'mp4', duration: slides.length * 5 });
  downloadFile(data, `${filename}.mp4`, 'video/mp4');
  console.log('Video export completed');
};

const exportToPNG = async (slides, filename) => {
  // Export all slides as PNG images
  for (let i = 0; i < slides.length; i++) {
    const canvas = await slideToCanvas(slides[i]);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_slide_${i + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
  console.log('PNG export completed');
};

const exportToJPEG = async (slides, filename) => {
  // Export all slides as JPEG images
  for (let i = 0; i < slides.length; i++) {
    const canvas = await slideToCanvas(slides[i]);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_slide_${i + 1}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.9);
  }
  console.log('JPEG export completed');
};

const slideToCanvas = async (slide) => {
  // Convert slide to canvas - would use html2canvas or similar
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = slide.background || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add title
  ctx.fillStyle = slide.textColor || '#000000';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(slide.title || '', 100, 150);
  
  // Add content
  ctx.font = '32px Arial';
  const lines = (slide.content || '').split('\n');
  lines.forEach((line, index) => {
    ctx.fillText(line, 100, 250 + (index * 50));
  });
  
  return canvas;
};

const downloadFile = (data, filename, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};