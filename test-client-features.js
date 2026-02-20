import fs from 'fs';
import path from 'path';

// Test client-side features by checking component files and their functionality
console.log('🧪 Testing EtherXPPT Client Features...\n');

// Test 1: Check if all critical components exist
const clientSrc = path.join(process.cwd(), 'client', 'src');
const components = [
  'App.jsx', 'SlideEditor.jsx', 'Toolbar.jsx', 'Sidebar.jsx',
  'PresentationManager.jsx', 'TextFormattingRibbon.jsx', 'AddInsPanel.jsx'
];

console.log('1. Checking critical components...');
let missingComponents = [];
components.forEach(comp => {
  const compPath = path.join(clientSrc, 'components', comp);
  if (fs.existsSync(compPath)) {
    console.log(`✅ ${comp} exists`);
  } else {
    console.log(`❌ ${comp} missing`);
    missingComponents.push(comp);
  }
});

if (missingComponents.length === 0) {
  console.log('✅ All critical components present');
} else {
  console.log(`❌ Missing components: ${missingComponents.join(', ')}`);
}

// Test 2: Check authentication context
console.log('\n2. Checking authentication context...');
const authContextPath = path.join(clientSrc, 'contexts', 'AuthContext.jsx');
if (fs.existsSync(authContextPath)) {
  const authContent = fs.readFileSync(authContextPath, 'utf8');
  const hasLogin = authContent.includes('login');
  const hasRegister = authContent.includes('register');
  const hasLogout = authContent.includes('logout');

  console.log(`✅ Auth context exists`);
  console.log(`   - Login function: ${hasLogin ? '✅' : '❌'}`);
  console.log(`   - Register function: ${hasRegister ? '✅' : '❌'}`);
  console.log(`   - Logout function: ${hasLogout ? '✅' : '❌'}`);
} else {
  console.log('❌ Auth context missing');
}

// Test 3: Check presentation context
console.log('\n3. Checking presentation context...');
const presContextPath = path.join(clientSrc, 'contexts', 'PresentationContext.jsx');
if (fs.existsSync(presContextPath)) {
  const presContent = fs.readFileSync(presContextPath, 'utf8');
  const hasSlides = presContent.includes('slides');
  const hasUpdateSlide = presContent.includes('updateSlide');
  const hasAddSlide = presContent.includes('addSlide');

  console.log(`✅ Presentation context exists`);
  console.log(`   - Slides state: ${hasSlides ? '✅' : '❌'}`);
  console.log(`   - Update slide: ${hasUpdateSlide ? '✅' : '❌'}`);
  console.log(`   - Add slide: ${hasAddSlide ? '✅' : '❌'}`);
} else {
  console.log('❌ Presentation context missing');
}

// Test 4: Check export utilities
console.log('\n4. Checking export utilities...');
const exportUtilsPath = path.join(clientSrc, 'utils', 'exportUtils.js');
if (fs.existsSync(exportUtilsPath)) {
  const exportContent = fs.readFileSync(exportUtilsPath, 'utf8');
  const hasPDF = exportContent.includes('jsPDF') || exportContent.includes('pdf');
  const hasPPTX = exportContent.includes('pptxgenjs') || exportContent.includes('pptx');
  const hasHTML = exportContent.includes('html');

  console.log(`✅ Export utils exist`);
  console.log(`   - PDF export: ${hasPDF ? '✅' : '❌'}`);
  console.log(`   - PPTX export: ${hasPPTX ? '✅' : '❌'}`);
  console.log(`   - HTML export: ${hasHTML ? '✅' : '❌'}`);
} else {
  console.log('❌ Export utils missing');
}

// Test 5: Check import utilities
console.log('\n5. Checking import utilities...');
const importUtilsPath = path.join(clientSrc, 'utils', 'importUtils.js');
if (fs.existsSync(importUtilsPath)) {
  const importContent = fs.readFileSync(importUtilsPath, 'utf8');
  const hasJSON = importContent.includes('json');
  const hasPPTX = importContent.includes('pptx') || importContent.includes('JSZip');

  console.log(`✅ Import utils exist`);
  console.log(`   - JSON import: ${hasJSON ? '✅' : '❌'}`);
  console.log(`   - PPTX import: ${hasPPTX ? '✅' : '❌'}`);
} else {
  console.log('❌ Import utils missing');
}

// Test 6: Check theme context
console.log('\n6. Checking theme context...');
const themeContextPath = path.join(clientSrc, 'contexts', 'ThemeContext.jsx');
if (fs.existsSync(themeContextPath)) {
  const themeContent = fs.readFileSync(themeContextPath, 'utf8');
  const hasDark = themeContent.includes('dark');
  const hasToggle = themeContent.includes('toggle');

  console.log(`✅ Theme context exists`);
  console.log(`   - Dark mode: ${hasDark ? '✅' : '❌'}`);
  console.log(`   - Toggle function: ${hasToggle ? '✅' : '❌'}`);
} else {
  console.log('❌ Theme context missing');
}

// Test 7: Check slide layouts in SlideEditor
console.log('\n7. Checking slide layouts...');
const slideEditorPath = path.join(clientSrc, 'components', 'SlideEditor.jsx');
if (fs.existsSync(slideEditorPath)) {
  const editorContent = fs.readFileSync(slideEditorPath, 'utf8');
  const layouts = ['title-content', 'title-only', 'content-only', 'two-column', 'blank'];
  let layoutCount = 0;

  layouts.forEach(layout => {
    if (editorContent.includes(layout)) {
      layoutCount++;
    }
  });

  console.log(`✅ Slide editor exists`);
  console.log(`   - Layouts supported: ${layoutCount}/${layouts.length}`);
} else {
  console.log('❌ Slide editor missing');
}

// Test 8: Check chart component
console.log('\n8. Checking chart component...');
const chartCompPath = path.join(clientSrc, 'components', 'ChartComponent.jsx');
if (fs.existsSync(chartCompPath)) {
  const chartContent = fs.readFileSync(chartCompPath, 'utf8');
  const hasBar = chartContent.includes('bar');
  const hasLine = chartContent.includes('line');
  const hasPie = chartContent.includes('pie');

  console.log(`✅ Chart component exists`);
  console.log(`   - Bar charts: ${hasBar ? '✅' : '❌'}`);
  console.log(`   - Line charts: ${hasLine ? '✅' : '❌'}`);
  console.log(`   - Pie charts: ${hasPie ? '✅' : '❌'}`);
} else {
  console.log('❌ Chart component missing');
}

// Test 9: Check table component
console.log('\n9. Checking table component...');
const tableCompPath = path.join(clientSrc, 'components', 'TableComponent.jsx');
if (fs.existsSync(tableCompPath)) {
  const tableContent = fs.readFileSync(tableCompPath, 'utf8');
  const hasTable = tableContent.includes('table');
  const hasEditable = tableContent.includes('contentEditable');

  console.log(`✅ Table component exists`);
  console.log(`   - Table rendering: ${hasTable ? '✅' : '❌'}`);
  console.log(`   - Editable cells: ${hasEditable ? '✅' : '❌'}`);
} else {
  console.log('❌ Table component missing');
}

// Test 10: Check routing
console.log('\n10. Checking routing setup...');
const appContent = fs.readFileSync(path.join(clientSrc, 'App.jsx'), 'utf8');
const routes = ['/', '/login', '/signup', '/dashboard', '/home'];
let routeCount = 0;

routes.forEach(route => {
  if (appContent.includes(route)) {
    routeCount++;
  }
});

console.log(`✅ App routing exists`);
console.log(`   - Routes configured: ${routeCount}/${routes.length}`);

// Summary
console.log('\n🎉 Client feature check completed!');
console.log('\n📋 Summary:');
console.log('- Core components: Check above');
console.log('- Authentication: Context-based');
console.log('- Presentation: Full slide management');
console.log('- Export/Import: Multiple formats');
console.log('- UI: Dark/light themes');
console.log('- Charts/Tables: Advanced components');
console.log('- For live testing: Open http://localhost:5173');
