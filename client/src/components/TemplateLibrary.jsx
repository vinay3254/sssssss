import React, { useState } from 'react';
import { usePresentation } from '../contexts/PresentationContext';

const TemplateLibrary = ({ onClose }) => {
  const { setSlides, setCurrentSlide, setPresentationMeta } = usePresentation();
  const [selectedCategory, setSelectedCategory] = useState('business');

  const templates = {
    business: [
      {
        id: 'business-pitch',
        name: 'Business Pitch',
        description: 'Professional presentation for business proposals',
        slides: [
          {
            id: 1,
            title: 'Company Overview',
            content: 'Present your company vision and mission',
            background: '#1E40AF',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Problem Statement',
            content: 'Define the problem you are solving',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Our Solution',
            content: 'Present your innovative solution',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'quarterly-report',
        name: 'Quarterly Report',
        description: 'Professional quarterly business report template',
        slides: [
          {
            id: 1,
            title: 'Q4 2024 Report',
            content: 'Quarterly Performance Overview',
            background: '#059669',
            textColor: '#FFFFFF',
            layout: 'title-only',
            elements: []
          },
          {
            id: 2,
            title: 'Key Metrics',
            content: 'Revenue, Growth, and Performance Indicators',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'product-launch',
        name: 'Product Launch',
        description: 'Exciting presentation for new product announcements',
        slides: [
          {
            id: 1,
            title: 'Product Launch',
            content: 'Introducing our latest innovation',
            background: '#DC2626',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Features & Benefits',
            content: 'What makes this product special',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Market Impact',
            content: 'How this changes the industry',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'team-meeting',
        name: 'Team Meeting',
        description: 'Structured agenda for team meetings and updates',
        slides: [
          {
            id: 1,
            title: 'Team Meeting Agenda',
            content: 'Weekly team updates and discussions',
            background: '#2563EB',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Progress Updates',
            content: 'Current project status and milestones',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ],
    education: [
      {
        id: 'lecture-slides',
        name: 'Lecture Slides',
        description: 'Educational presentation template',
        slides: [
          {
            id: 1,
            title: 'Course Introduction',
            content: 'Welcome to the course',
            background: '#7C3AED',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Learning Objectives',
            content: 'What you will learn in this session',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'workshop',
        name: 'Workshop Presentation',
        description: 'Interactive workshop session template',
        slides: [
          {
            id: 1,
            title: 'Workshop Overview',
            content: 'Hands-on learning session',
            background: '#10B981',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Activities',
            content: 'Interactive exercises and discussions',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Key Takeaways',
            content: 'What participants will learn',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'research-presentation',
        name: 'Research Presentation',
        description: 'Academic research findings template',
        slides: [
          {
            id: 1,
            title: 'Research Title',
            content: 'Presenting our findings',
            background: '#6366F1',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Methodology',
            content: 'Research approach and methods used',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Results',
            content: 'Key findings and conclusions',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ],
    creative: [
      {
        id: 'portfolio',
        name: 'Portfolio Showcase',
        description: 'Creative portfolio presentation',
        slides: [
          {
            id: 1,
            title: 'My Portfolio',
            content: 'Showcasing my best work',
            background: '#EC4899',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'About Me',
            content: 'Professional background and skills',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'art-showcase',
        name: 'Art Showcase',
        description: 'Gallery-style presentation for artistic works',
        slides: [
          {
            id: 1,
            title: 'Art Exhibition',
            content: 'Exploring creative expressions',
            background: '#8B5CF6',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Featured Pieces',
            content: 'Highlights from the collection',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Artist Statement',
            content: 'The inspiration behind the work',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'design-pitch',
        name: 'Design Pitch',
        description: 'Creative design proposal presentation',
        slides: [
          {
            id: 1,
            title: 'Design Concept',
            content: 'Innovative design solutions',
            background: '#F59E0B',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Design Process',
            content: 'From concept to creation',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Final Design',
            content: 'The complete creative vision',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ],
    marketing: [
      {
        id: 'social-media-campaign',
        name: 'Social Media Campaign',
        description: 'Engaging social media strategy presentation',
        slides: [
          {
            id: 1,
            title: 'Campaign Overview',
            content: 'Building brand awareness online',
            background: '#3B82F6',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Target Audience',
            content: 'Who we want to reach',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Content Strategy',
            content: 'Planning engaging posts and stories',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'brand-identity',
        name: 'Brand Identity',
        description: 'Comprehensive brand identity presentation',
        slides: [
          {
            id: 1,
            title: 'Brand Story',
            content: 'The heart of our brand',
            background: '#EF4444',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Visual Identity',
            content: 'Colors, fonts, and imagery',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Brand Guidelines',
            content: 'How to use our brand elements',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ],
    personal: [
      {
        id: 'personal-resume',
        name: 'Personal Resume',
        description: 'Professional personal resume presentation',
        slides: [
          {
            id: 1,
            title: 'Professional Profile',
            content: 'My career journey',
            background: '#10B981',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Experience',
            content: 'Key roles and achievements',
            background: '#FFFFFF',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Skills & Education',
            content: 'What I bring to the table',
            background: '#F3F4F6',
            textColor: '#1F2937',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ],
    design: [
      {
        id: 'modern-dark-gold',
        name: 'Modern Dark Gold',
        description: 'Sleek dark theme with gold accents',
        slides: [
          {
            id: 1,
            title: 'Welcome',
            content: 'Modern Presentation Design',
            background: '#1B1A17',
            textColor: '#F0A500',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Our Vision',
            content: 'Creating impactful presentations',
            background: '#1B1A17',
            textColor: '#F0A500',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Key Points',
            content: 'Professional design made simple',
            background: '#1B1A17',
            textColor: '#F0A500',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        description: 'Professional blue corporate theme',
        slides: [
          {
            id: 1,
            title: 'Corporate Overview',
            content: 'Business Presentation Template',
            background: '#1E3A5F',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Strategic Goals',
            content: 'Our mission and objectives',
            background: '#1E3A5F',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Growth Strategy',
            content: 'Key initiatives and milestones',
            background: '#1E3A5F',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'minimal-light',
        name: 'Minimal Light',
        description: 'Clean minimal white design',
        slides: [
          {
            id: 1,
            title: 'Minimal Design',
            content: 'Less is More',
            background: '#FAFAFA',
            textColor: '#333333',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Clean Layout',
            content: 'Focus on your content',
            background: '#FAFAFA',
            textColor: '#333333',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Simple Elegance',
            content: 'Modern and uncluttered',
            background: '#FAFAFA',
            textColor: '#333333',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'sunset-gradient',
        name: 'Sunset Gradient',
        description: 'Warm gradient sunset theme',
        slides: [
          {
            id: 1,
            title: 'Welcome',
            content: 'Creative Presentation',
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Our Story',
            content: 'Passion and creativity',
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Creative Vision',
            content: 'Thinking outside the box',
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'ocean-teal',
        name: 'Ocean Teal',
        description: 'Fresh ocean teal theme',
        slides: [
          {
            id: 1,
            title: 'Ocean Blue',
            content: 'Fresh & Modern Design',
            background: '#0D9488',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Marine Theme',
            content: 'Calm and professional',
            background: '#0D9488',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Deep Dive',
            content: 'Explore the possibilities',
            background: '#0D9488',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'royal-purple',
        name: 'Royal Purple',
        description: 'Elegant royal purple theme',
        slides: [
          {
            id: 1,
            title: 'Royal Presentation',
            content: 'Sophisticated Design',
            background: '#5B21B6',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Premium Quality',
            content: 'Elegant and refined',
            background: '#5B21B6',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Excellence',
            content: 'Setting new standards',
            background: '#5B21B6',
            textColor: '#FFFFFF',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      // Pattern Variants
      {
        id: 'geometric-grid',
        name: 'Geometric Grid',
        description: 'Subtle grid pattern for professional look',
        slides: [
          {
            id: 1,
            title: 'Grid Pattern',
            content: 'Modern Geometric Design',
            background: '#FAFAFA',
            textColor: '#1B1A17',
            patternClass: 'pattern-grid',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Structured Layout',
            content: 'Clean and organized presentation',
            background: '#FAFAFA',
            textColor: '#1B1A17',
            patternClass: 'pattern-grid',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Data Driven',
            content: 'Insights and analytics',
            background: '#FAFAFA',
            textColor: '#1B1A17',
            patternClass: 'pattern-grid',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'polka-dots',
        name: 'Polka Dots',
        description: 'Playful dotted pattern design',
        slides: [
          {
            id: 1,
            title: 'Polka Dots',
            content: 'Fun and Modern Presentation',
            background: '#FEF3C7',
            textColor: '#92400E',
            patternClass: 'pattern-dots',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Creative Touch',
            content: 'Adding visual interest',
            background: '#FEF3C7',
            textColor: '#92400E',
            patternClass: 'pattern-dots',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Unique Style',
            content: 'Stand out from the crowd',
            background: '#FEF3C7',
            textColor: '#92400E',
            patternClass: 'pattern-dots',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'diamond-pattern',
        name: 'Diamond Pattern',
        description: 'Elegant diamond grid pattern',
        slides: [
          {
            id: 1,
            title: 'Diamond Design',
            content: 'Sophisticated Pattern Layout',
            background: '#F3F4F6',
            textColor: '#374151',
            patternClass: 'pattern-diamond',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Modern Texture',
            content: 'Subtle visual depth',
            background: '#F3F4F6',
            textColor: '#374151',
            patternClass: 'pattern-diamond',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Professional Edge',
            content: 'Clean and refined',
            background: '#F3F4F6',
            textColor: '#374151',
            patternClass: 'pattern-diamond',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'diagonal-lines',
        name: 'Diagonal Lines',
        description: 'Dynamic diagonal line pattern',
        slides: [
          {
            id: 1,
            title: 'Diagonal Motion',
            content: 'Dynamic Presentation Design',
            background: '#DBEAFE',
            textColor: '#1E40AF',
            patternClass: 'pattern-diagonal',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Forward Motion',
            content: 'Moving towards goals',
            background: '#DBEAFE',
            textColor: '#1E40AF',
            patternClass: 'pattern-diagonal',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Progress',
            content: 'Continuous improvement',
            background: '#DBEAFE',
            textColor: '#1E40AF',
            patternClass: 'pattern-diagonal',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'soft-gradient',
        name: 'Soft Gradient',
        description: 'Smooth gradient blend background',
        slides: [
          {
            id: 1,
            title: 'Soft Gradients',
            content: 'Elegant Color Transitions',
            background: 'linear-gradient(135deg, #E0E7FF, #FAE8FF)',
            textColor: '#3730A3',
            patternClass: 'pattern-gradient-soft',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Smooth Blend',
            content: 'Harmonious color schemes',
            background: 'linear-gradient(135deg, #E0E7FF, #FAE8FF)',
            textColor: '#3730A3',
            patternClass: 'pattern-gradient-soft',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Modern Feel',
            content: 'Contemporary and fresh',
            background: 'linear-gradient(135deg, #E0E7FF, #FAE8FF)',
            textColor: '#3730A3',
            patternClass: 'pattern-gradient-soft',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'split-layout',
        name: 'Split Layout',
        description: 'Two-tone split background layout',
        slides: [
          {
            id: 1,
            title: 'Split Design',
            content: 'Bold Two-Tone Layout',
            background: 'linear-gradient(90deg, #1E3A5F 50%, #ffffff 50%)',
            textColor: '#FFFFFF',
            patternClass: 'pattern-split-left',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Dual Sections',
            content: 'Contrast and balance',
            background: 'linear-gradient(90deg, #1E3A5F 50%, #ffffff 50%)',
            textColor: '#FFFFFF',
            patternClass: 'pattern-split-left',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Modern Split',
            content: 'Eye-catching design',
            background: 'linear-gradient(90deg, #1E3A5F 50%, #ffffff 50%)',
            textColor: '#FFFFFF',
            patternClass: 'pattern-split-left',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'gold-dots',
        name: 'Gold Dots',
        description: 'Elegant gold dotted accent pattern',
        slides: [
          {
            id: 1,
            title: 'Gold Accents',
            content: 'Premium Presentation Design',
            background: '#1B1A17',
            textColor: '#F0A500',
            patternClass: 'pattern-dots-gold',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Subtle Luxury',
            content: 'Understated elegance',
            background: '#1B1A17',
            textColor: '#F0A500',
            patternClass: 'pattern-dots-gold',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Golden Touch',
            content: 'Adding warmth and class',
            background: '#1B1A17',
            textColor: '#F0A500',
            patternClass: 'pattern-dots-gold',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'gold-grid',
        name: 'Gold Grid',
        description: 'Professional grid with gold accent',
        slides: [
          {
            id: 1,
            title: 'Gold Grid',
            content: 'Sophisticated Pattern Design',
            background: '#1B1A17',
            textColor: '#F0A500',
            patternClass: 'pattern-grid-gold',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Structured Gold',
            content: 'Organized and refined',
            background: '#1B1A17',
            textColor: '#F0A500',
            patternClass: 'pattern-grid-gold',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Executive Look',
            content: 'Professional presentation',
            background: '#1B1A17',
            textColor: '#F0A500',
            patternClass: 'pattern-grid-gold',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'zigzag-pattern',
        name: 'Zigzag Pattern',
        description: 'Contemporary zigzag geometric pattern',
        slides: [
          {
            id: 1,
            title: 'Zigzag Design',
            content: 'Contemporary Pattern Layout',
            background: '#F5F3FF',
            textColor: '#5B21B6',
            patternClass: 'pattern-zigzag',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Modern Geometry',
            content: 'Sharp and clean lines',
            background: '#F5F3FF',
            textColor: '#5B21B6',
            patternClass: 'pattern-zigzag',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Dynamic Feel',
            content: 'Energy and movement',
            background: '#F5F3FF',
            textColor: '#5B21B6',
            patternClass: 'pattern-zigzag',
            layout: 'title-content',
            elements: []
          }
        ]
      },
      {
        id: 'hexagon-pattern',
        name: 'Hexagon Pattern',
        description: 'Modern hexagon honeycomb pattern',
        slides: [
          {
            id: 1,
            title: 'Hexagon Design',
            content: 'Modern Honeycomb Pattern',
            background: '#F0F9FF',
            textColor: '#0369A1',
            patternClass: 'pattern-hexagon',
            layout: 'title-content',
            elements: []
          },
          {
            id: 2,
            title: 'Connected Cells',
            content: 'Interconnected design',
            background: '#F0F9FF',
            textColor: '#0369A1',
            patternClass: 'pattern-hexagon',
            layout: 'title-content',
            elements: []
          },
          {
            id: 3,
            title: 'Technical Feel',
            content: 'Modern and precise',
            background: '#F0F9FF',
            textColor: '#0369A1',
            patternClass: 'pattern-hexagon',
            layout: 'title-content',
            elements: []
          }
        ]
      }
    ]
  };

  const categories = [
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'personal', name: 'Personal', icon: '👤' },
    { id: 'design', name: 'Design', icon: '🎯' }
  ];

  const handleUseTemplate = (template) => {
    // Generate unique IDs for slides to avoid conflicts
    const baseId = Date.now();
    const slidesWithUniqueIds = template.slides.map((slide, index) => ({
      ...slide,
      id: baseId + index
    }));

    // Create a cover slide and prepend it to the template slides
    const cover = {
      id: baseId - 1,
      title: template.name || 'Cover',
      content: template.description || '',
      background: template.slides?.[0]?.background || '#1E40AF',
      textColor: template.slides?.[0]?.textColor || '#FFFFFF',
      layout: 'title-only',
      elements: []
    };

    const slidesWithCover = [cover, ...slidesWithUniqueIds];

    setSlides(slidesWithCover);
    setCurrentSlide(0);
    // Update presentation meta with template name
    setPresentationMeta(prev => ({
      ...prev,
      title: template.name || 'Untitled',
      updatedAt: new Date().toISOString()
    }));
    // Save to localStorage for persistence
    localStorage.setItem('undoHistory', JSON.stringify([slidesWithCover]));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="panel w-4/5 max-w-5xl h-4/5 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b gold-border-light">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold nav-title">Template Library</h2>
            <button onClick={onClose} className="toolbar-btn">✕</button>
          </div>
          
          {/* Categories */}
          <div className="flex space-x-4 mt-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates[selectedCategory]?.map(template => (
              <div key={template.id} className="panel overflow-hidden hover:glow transition-shadow">
                {/* Preview: render first slide as cover */}
                {(() => {
                  const cover = template.slides?.[0] || {};
                  const bg = cover.background || '#4F46E5';
                  const text = cover.textColor || '#FFFFFF';
                  return (
                    <div className="h-40 overflow-hidden" style={{ background: `linear-gradient(135deg, ${bg}, ${bg}dd)` }}>
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <div className="text-lg font-bold mb-2" style={{ color: text }}>{cover.title || template.name}</div>
                        <div className="text-sm" style={{ color: text, opacity: 0.9 }}>{cover.content || template.description}</div>
                        <div className="text-xs mt-3" style={{ color: text, opacity: 0.85 }}>{template.slides?.length || 1} slides</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-neutral-300 mb-4">{template.description}</p>

                  {/* Slide Preview */}
                  <div className="mb-4">
                    <div className="text-xs text-neutral-400 mb-2">Slide Themes:</div>
                    <div className="flex space-x-2">
                      {template.slides.slice(0, 3).map((slide, index) => (
                        <div key={index} className="w-8 h-6 rounded border" style={{ backgroundColor: slide.background }} title={slide.title} />
                      ))}
                    </div>
                  </div>

                  <button onClick={() => handleUseTemplate(template)} className="w-full btn-primary">Use Template</button>
                </div>
              </div>
            ))}
          </div>
          
          {(!templates[selectedCategory] || templates[selectedCategory].length === 0) && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎨</div>
              <div className="text-gray-500 dark:text-gray-400">
                No templates available in this category yet.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;