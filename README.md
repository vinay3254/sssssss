# EtherXPPT - PowerPoint Replica

A complete PowerPoint-like presentation application built with React and Node.js. Create, edit, and manage professional presentations with advanced features including rich text editing, image support, shapes, templates, and comprehensive export options.

## ✨ Key Features

### 🎨 **Advanced Slide Editor**
- **Rich Text Editing** - Bold, italic, underline, font selection, colors, alignment
- **Dynamic Elements** - Draggable text boxes, images, shapes, and icons
- **Image Support** - Upload and position images with drag-and-drop
- **Shape Tools** - Rectangles, circles, triangles with customizable colors
- **Icon Library** - Pre-built icons (star, heart, check, arrow, warning, info)
- **Live Editing** - Real-time content editing with visual feedback

### 📁 **Presentation Management**
- **File Organization** - Custom folders (Personal, Work, Templates)
- **Search Functionality** - Full-text search across presentations and content
- **Recent Presentations** - Quick access to last 10 presentations
- **Template Library** - Professional templates (Business, Education, Creative)
- **Duplicate & Delete** - Complete file management operations

### 📤 **Enhanced Export & Import**
- **PowerPoint (.pptx)** - Full compatibility with Microsoft PowerPoint
- **PDF Export** - High-quality PDF generation with backgrounds and formatting
- **HTML Export** - Web-ready presentations viewable in any browser
- **JSON Format** - Native format preserving all features
- **Image Archive** - Export all slides as high-resolution PNG images
- **PowerPoint Import** - Basic PPTX file import support

### 🎯 **Core Features**
- **Modern UI** - Dark theme with custom colors (#1B1A17 background, #F0A500 accents)
- **Authentication** - Secure login, signup, and OTP-based password reset
- **Email Integration** - Gmail SMTP for OTP delivery
- **Slideshow Mode** - Full-screen presentation view with navigation
- **Auto-save** - Automatic local storage backup
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tooling and development server
- **Axios** - HTTP client for API calls
- **html2canvas** - Screenshot generation for exports
- **jsPDF** - PDF generation
- **pptxgenjs** - PowerPoint file generation
- **JSZip** - Archive creation and PPTX parsing
- **file-saver** - File download utilities

### Backend
- **Node.js with Express** - Server framework
- **JWT Authentication** - Secure token-based auth
- **Nodemailer** - Email service integration
- **bcryptjs** - Password hashing
- **Rate limiting** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gmail account for SMTP (optional)

### Installation

1. Clone the repository:
```bash
git clone  https://github.com/sanvi-oss/ppt8.git 
cd Ether-x-ppt1
```

2. Install dependencies:
```bash
npm run install-all
```

3. Configure environment variables:
```bash
# In server/.env
PORT=3000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the application:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
Ether-x-ppt1/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── SlideEditor.jsx     # Advanced slide editor
│   │   │   ├── PresentationManager.jsx # File management
│   │   │   ├── TemplateLibrary.jsx     # Template system
│   │   │   ├── ImportExport.jsx        # Export/import features
│   │   │   ├── FormatPanel.jsx         # Formatting controls
│   │   │   ├── AddInsPanel.jsx         # Elements and shapes
│   │   │   └── ...                     # Other components
│   │   ├── contexts/           # React context providers
│   │   │   ├── PresentationContext.jsx # Slide management
│   │   │   ├── AuthContext.jsx         # Authentication
│   │   │   └── ThemeContext.jsx        # Theme management
│   │   ├── pages/              # Main application pages
│   │   ├── utils/              # Utility functions
│   │   │   ├── exportUtils.js          # Export/import logic
│   │   │   └── cloudStorage.js         # Storage utilities
│   │   └── styles/             # CSS and styling
│   ├── public/                 # Static assets
│   └── package.json            # Frontend dependencies
├── server/                     # Node.js backend
│   ├── src/                    # Server source code
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Data models
│   │   ├── routes/             # API routes
│   │   └── services/           # Business logic
│   ├── production-server.js    # Production server
│   ├── .env.example           # Environment template
│   └── package.json           # Backend dependencies
├── package.json               # Root package configuration
└── README.md                  # This file
```

## 🚀 Advanced Features

### Rich Slide Editor
- **Content Editing** - Click-to-edit titles and content with HTML support
- **Formatting Toolbar** - Font selection, sizes, colors, and text alignment
- **Element Management** - Add, move, resize, and delete slide elements
- **Visual Feedback** - Hover states, selection indicators, and drag handles
- **Keyboard Shortcuts** - Standard shortcuts for formatting and navigation

### Presentation Management System
- **Library View** - Grid-based presentation browser with thumbnails
- **Folder Organization** - Create and manage custom folder structures
- **Advanced Search** - Search by filename or slide content with match highlighting
- **Template System** - Professional templates for quick presentation starts
- **Recent Access** - Smart recent presentations with relative date display

### Export & Import Capabilities
- **Multi-format Export** - PPTX, PDF, HTML, JSON, and image formats
- **Batch Operations** - Export all slides as image archive
- **Import Support** - JSON (full features) and PPTX (basic) import
- **Cloud Ready** - Infrastructure for future cloud storage integration
- **Quality Control** - High-resolution exports with proper formatting

### User Experience
- **Responsive Design** - Optimized for desktop and mobile devices
- **Dark/Light Themes** - Toggle between themes with persistent settings
- **Progress Indicators** - Loading states for better user feedback
- **Error Handling** - Graceful error recovery with user-friendly messages
- **Accessibility** - Keyboard navigation and screen reader support

## Development

### Available Scripts

```bash
# Start development servers
npm run dev

# Start only client
npm run client

# Start only server
npm run server

# Build for production
npm run build

# Install all dependencies
npm run install-all
```

### Testing OTP Functionality

```bash
cd server
node test-otp.js
```

## Deployment

1. Build the client:
```bash
cd client
npm run build
```

2. Configure production environment variables

3. Start the production server:
```bash
cd server
npm start
```

## 📋 Usage Guide

### Creating Presentations
1. **Start New** - Use "New Slide" or choose from templates
2. **Add Content** - Click on title/content areas to edit
3. **Insert Elements** - Add text boxes, images, shapes, and icons
4. **Format** - Use formatting panel for colors, fonts, and layouts
5. **Save** - Use quick save or presentation manager

### Managing Presentations
1. **Access Manager** - File → Manage Presentations
2. **Organize** - Create folders and move presentations
3. **Search** - Use global search or File → Search Presentations
4. **Templates** - File → Template Library for quick starts

### Export Options
1. **Quick Export** - Toolbar dropdown for common formats
2. **Advanced Export** - Import/Export button for all options
3. **Batch Export** - Export all slides as images
4. **Format Selection** - Choose based on your needs:
   - PPTX for PowerPoint compatibility
   - PDF for sharing and printing
   - HTML for web publishing
   - JSON for backup and transfer

## 🤝 Contributing

1. Fork the repository from [GitHub](https://github.com/sanvi-oss/ppt8.git )
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Open an issue on [GitHub](https://github.com/sanvi-oss/ppt8.git)/issues)
- 💬 Check existing issues for solutions
- 📖 Review this README for usage guidance

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Microsoft PowerPoint
- Community feedback and contributions

---

**Repository**: https://github.com/Gella-Uday-kumar/Ether-x-ppt1.git

Built with ❤️ by the EtherXPPT contributors
#   l  
 