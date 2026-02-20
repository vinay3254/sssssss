// Standalone script to generate sample PowerPoint presentation
import PptxGenJS from 'pptxgenjs';

const generateSamplePresentation = async (filename = 'EtherXPPT_Sample') => {
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

  // Text box with animation
  slide2.addText('This is an editable text box. You can modify this text in PowerPoint.', {
    x: 1, y: 1.5, w: 4, h: 1, fontSize: 18, fill: { color: 'E6F3FF' },
    animation: { type: 'fade', duration: 1000 }
  });

  // Rectangle shape with animation
  slide2.addShape('rect', {
    x: 6, y: 1.5, w: 2, h: 1, fill: { color: 'FF6B6B' }, line: { color: '000000', width: 2 },
    animation: { type: 'fly', direction: 'left', duration: 1500, delay: 500 }
  });

  // Circle shape with animation
  slide2.addShape('ellipse', {
    x: 6.5, y: 3, w: 1, h: 1, fill: { color: '4ECDC4' }, line: { color: '000000', width: 2 },
    animation: { type: 'zoom', direction: 'in', duration: 1000, delay: 1000 }
  });

  // Triangle shape with animation
  slide2.addShape('triangle', {
    x: 7.5, y: 3, w: 1, h: 1, fill: { color: '45B7D1' }, line: { color: '000000', width: 2 },
    animation: { type: 'spin', duration: 2000, delay: 1500 }
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
    chartColors: ['4ECDC4', '45B7D1'],
    animation: { type: 'fly', direction: 'up', duration: 1500 }
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
    chartColors: ['FF6B6B', '4ECDC4', '45B7D1'],
    animation: { type: 'fly', direction: 'right', duration: 1500, delay: 500 }
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
  console.log(`Sample PowerPoint presentation saved as ${filename}.pptx`);
  return `${filename}.pptx`;
};

// Run the generator
generateSamplePresentation().then(() => {
  console.log('Presentation generation complete!');
}).catch(error => {
  console.error('Error generating presentation:', error);
});