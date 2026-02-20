# Assets Folder

This folder contains all static assets for the EtherXPPT application.

## Structure

```
assets/
├── images/     # General images (backgrounds, illustrations, etc.)
├── icons/      # Icon files (SVG, PNG icons)
├── logos/      # Logo files (brand logos, company logos)
└── README.md   # This file
```

## Usage

Import assets in your components:

```jsx
// Import images
import splashImage from '../assets/images/splash-bg.jpg';
import logo from '../assets/logos/etherxppt-logo.png';

// Use in component
<img src={splashImage} alt="Splash Background" />
<img src={logo} alt="EtherXPPT Logo" />
```

## Supported Formats

- **Images**: JPG, PNG, WebP, SVG
- **Icons**: SVG (preferred), PNG
- **Logos**: SVG (preferred), PNG

## File Naming Convention

- Use kebab-case: `splash-background.jpg`
- Be descriptive: `user-avatar-placeholder.png`
- Include size if multiple: `logo-small.svg`, `logo-large.svg`