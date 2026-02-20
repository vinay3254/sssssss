import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import RenameModal from '../components/RenameModal';
import TemplateLibrary from '../components/TemplateLibrary';
import Logo from '../components/Logo';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [pinnedFiles, setPinnedFiles] = useState([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const templates = {
    1: { id: 1, name: 'Blank Presentation', category: 'Basic', description: 'Start with a blank presentation', slides: [{ id: 1, title: 'Click to add title', content: 'Click to add content', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }] },
    2: { id: 2, name: 'Business Pitch', category: 'Business', description: 'Professional business presentation', slides: [
      { id: 1, title: 'Company Overview', content: 'Present your company vision and mission', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Problem Statement', content: 'Define the problem you are solving', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Our Solution', content: 'Present your innovative solution', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    3: { id: 3, name: 'Project Report', category: 'Project', description: 'Project status and updates', slides: [
      { id: 1, title: 'Project Status Report', content: 'Q4 2024 Progress Update', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Key Achievements', content: 'Major milestones and accomplishments', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    4: { id: 4, name: 'Educational', category: 'Education', description: 'Educational content template', slides: [
      { id: 1, title: 'Course Introduction', content: 'Welcome to the course', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Learning Objectives', content: 'What you will learn today', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    5: { id: 5, name: 'Marketing Plan', category: 'Marketing', description: 'Marketing strategy presentation', slides: [
      { id: 1, title: 'Marketing Strategy 2024', content: 'Our comprehensive marketing approach', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Target Audience', content: 'Understanding our customers', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    6: { id: 6, name: 'SWOT Analysis', category: 'Business', description: 'Strategic planning template', slides: [
      { id: 1, title: 'SWOT Analysis', content: 'Strategic Planning Framework', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Strengths', content: 'Internal positive attributes', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Weaknesses', content: 'Internal challenges to address', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Opportunities', content: 'External favorable conditions', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 5, title: 'Threats', content: 'External challenges to overcome', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    7: { id: 7, name: 'Product Launch', category: 'Business', description: 'New product introduction', slides: [
      { id: 1, title: 'Product Launch', content: 'Introducing Our New Innovation', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Market Need', content: 'The problem we solve', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Product Features', content: 'Key capabilities and benefits', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Target Market', content: 'Who will love this product', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    8: { id: 8, name: 'Financial Report', category: 'Business', description: 'Quarterly financial results', slides: [
      { id: 1, title: 'Q4 Financial Report', content: '2024 Financial Performance', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Revenue Overview', content: 'Income statement highlights', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Profit & Loss', content: 'Key financial metrics', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Future Outlook', content: 'Q1 2025 projections', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    9: { id: 9, name: 'Team Meeting', category: 'Business', description: 'Weekly team sync template', slides: [
      { id: 1, title: 'Team Standup', content: 'Weekly Progress Update', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'What I Did', content: 'Accomplishments this week', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'What I Will Do', content: 'Next week priorities', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Blockers', content: 'Issues needing attention', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    10: { id: 10, name: 'Lesson Plan', category: 'Education', description: 'Structured lesson template', slides: [
      { id: 1, title: 'Lesson Plan', content: 'Today\'s Learning Objectives', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Introduction', content: 'Hook and background knowledge', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Main Activity', content: 'Core learning content', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Assessment', content: 'Check for understanding', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 5, title: 'Summary', content: 'Key takeaways and next steps', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    11: { id: 11, name: 'Research Paper', category: 'Education', description: 'Academic research presentation', slides: [
      { id: 1, title: 'Research Title', content: 'Paper Abstract and Overview', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Introduction', content: 'Research question and significance', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Methodology', content: 'Research approach and methods', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Results', content: 'Key findings and data', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 5, title: 'Conclusion', content: 'Implications and future work', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    12: { id: 12, name: 'Thesis Defense', category: 'Education', description: 'Graduate thesis presentation', slides: [
      { id: 1, title: 'Thesis Defense', content: 'Research Overview and Contributions', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Problem Statement', content: 'Research gap and motivation', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Literature Review', content: 'Related work and background', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Proposed Solution', content: 'Methodology and approach', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 5, title: 'Experimental Results', content: 'Evaluation and findings', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 6, title: 'Conclusion', content: 'Contributions and future work', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    13: { id: 13, name: 'Social Media Strategy', category: 'Marketing', description: 'Digital marketing plan', slides: [
      { id: 1, title: 'Social Media Strategy', content: '2024 Digital Marketing Plan', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Platform Analysis', content: 'Where our audience is active', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Content Calendar', content: 'Posting schedule and themes', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Engagement Goals', content: 'Metrics and KPIs to track', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    14: { id: 14, name: 'Brand Guidelines', category: 'Marketing', description: 'Brand identity presentation', slides: [
      { id: 1, title: 'Brand Guidelines', content: 'Our Visual Identity System', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Logo Usage', content: 'Proper logo application rules', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Color Palette', content: 'Brand colors and usage guidelines', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Typography', content: 'Font families and text styling', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 5, title: 'Brand Voice', content: 'Tone and messaging guidelines', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    15: { id: 15, name: 'Campaign Report', category: 'Marketing', description: 'Marketing campaign results', slides: [
      { id: 1, title: 'Campaign Results', content: 'Q4 Marketing Campaign Performance', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Campaign Overview', content: 'Goals, timeline, and budget', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Key Metrics', content: 'Reach, engagement, and conversions', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Success Stories', content: 'Campaign highlights and wins', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 5, title: 'Lessons Learned', content: 'What worked and what to improve', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    16: { id: 16, name: 'Resume/CV', category: 'Personal', description: 'Professional resume template', slides: [
      { id: 1, title: 'Professional Resume', content: 'Your Career Summary', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Work Experience', content: 'Professional background and achievements', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Education', content: 'Academic qualifications and certifications', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Skills & Expertise', content: 'Technical and soft skills', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    17: { id: 17, name: 'Portfolio', category: 'Personal', description: 'Creative work showcase', slides: [
      { id: 1, title: 'Portfolio', content: 'Showcase of My Work', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'About Me', content: 'Background and expertise', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Project Gallery', content: 'Featured work and case studies', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Contact Information', content: 'How to reach me', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    18: { id: 18, name: 'Event Planning', category: 'Personal', description: 'Wedding or event planning', slides: [
      { id: 1, title: 'Event Planning', content: 'Special Day Timeline and Details', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Venue & Date', content: 'Location and timing details', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Guest List', content: 'Invitations and RSVPs', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Vendor Contacts', content: 'Catering, photography, and services', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    19: { id: 19, name: 'Photo Album', category: 'Creative', description: 'Digital photo presentation', slides: [
      { id: 1, title: 'Photo Album', content: 'Memorable Moments Collection', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Family Memories', content: 'Cherished family moments', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Travel Adventures', content: 'Journey highlights and destinations', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Special Occasions', content: 'Celebrations and milestones', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    20: { id: 20, name: 'Newsletter', category: 'Creative', description: 'Monthly newsletter template', slides: [
      { id: 1, title: 'Monthly Newsletter', content: 'December 2024 Edition', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 2, title: 'Highlights', content: 'Key updates and announcements', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 3, title: 'Upcoming Events', content: 'Calendar of important dates', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] },
      { id: 4, title: 'Community Spotlight', content: 'Member stories and features', background: '#ffffff', textColor: '#000000', layout: 'title-content', elements: [] }
    ]},
    21: { id: 21, name: 'Centered Title', category: 'Basic', description: 'Slide with perfectly centered title', slides: [
      { id: 1, title: 'Welcome to EtherX PPT Demo', content: '', background: '#ffffff', textColor: '#000000', layout: 'title-only', elements: [] },
      { id: 2, title: 'Another Centered Slide', content: '', background: '#ffffff', textColor: '#000000', layout: 'title-only', elements: [] }
    ]},
    // Professional Design Variants
    22: { id: 22, name: 'Modern Dark Gold', category: 'Design', description: 'Sleek dark theme with gold accents', slides: [
      { id: 1, title: 'Welcome', content: 'Modern Presentation Design', background: '#1B1A17', textColor: '#F0A500', layout: 'title-content', elements: [] },
      { id: 2, title: 'Our Vision', content: 'Creating impactful presentations', background: '#1B1A17', textColor: '#F0A500', layout: 'title-content', elements: [] },
      { id: 3, title: 'Key Points', content: 'Professional design made simple', background: '#1B1A17', textColor: '#F0A500', layout: 'title-content', elements: [] }
    ]},
    23: { id: 23, name: 'Corporate Blue', category: 'Design', description: 'Professional blue corporate theme', slides: [
      { id: 1, title: 'Corporate Overview', content: 'Business Presentation Template', background: '#1E3A5F', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 2, title: 'Strategic Goals', content: 'Our mission and objectives', background: '#1E3A5F', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 3, title: 'Growth Strategy', content: 'Key initiatives and milestones', background: '#1E3A5F', textColor: '#FFFFFF', layout: 'title-content', elements: [] }
    ]},
    24: { id: 24, name: 'Minimal Light', category: 'Design', description: 'Clean minimal white design', slides: [
      { id: 1, title: 'Minimal Design', content: 'Less is More', background: '#FAFAFA', textColor: '#333333', layout: 'title-content', elements: [] },
      { id: 2, title: 'Clean Layout', content: 'Focus on your content', background: '#FAFAFA', textColor: '#333333', layout: 'title-content', elements: [] },
      { id: 3, title: 'Simple Elegance', content: 'Modern and uncluttered', background: '#FAFAFA', textColor: '#333333', layout: 'title-content', elements: [] }
    ]},
    25: { id: 25, name: 'Sunset Gradient', category: 'Design', description: 'Warm gradient sunset theme', slides: [
      { id: 1, title: 'Welcome', content: 'Creative Presentation', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 2, title: 'Our Story', content: 'Passion and creativity', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 3, title: 'Creative Vision', content: 'Thinking outside the box', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', textColor: '#FFFFFF', layout: 'title-content', elements: [] }
    ]},
    26: { id: 26, name: 'Ocean Teal', category: 'Design', description: 'Fresh ocean teal theme', slides: [
      { id: 1, title: 'Ocean Blue', content: 'Fresh & Modern Design', background: '#0D9488', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 2, title: 'Marine Theme', content: 'Calm and professional', background: '#0D9488', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 3, title: 'Deep Dive', content: 'Explore the possibilities', background: '#0D9488', textColor: '#FFFFFF', layout: 'title-content', elements: [] }
    ]},
    27: { id: 27, name: 'Royal Purple', category: 'Design', description: 'Elegant royal purple theme', slides: [
      { id: 1, title: 'Royal Presentation', content: 'Sophisticated Design', background: '#5B21B6', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 2, title: 'Premium Quality', content: 'Elegant and refined', background: '#5B21B6', textColor: '#FFFFFF', layout: 'title-content', elements: [] },
      { id: 3, title: 'Excellence', content: 'Setting new standards', background: '#5B21B6', textColor: '#FFFFFF', layout: 'title-content', elements: [] }
    ]},
    // Pattern Variants
    28: { id: 28, name: 'Geometric Grid', category: 'Design', description: 'Subtle grid pattern for professional look', slides: [
      { id: 1, title: 'Grid Pattern', content: 'Modern Geometric Design', background: '#FAFAFA', textColor: '#1B1A17', patternClass: 'pattern-grid', layout: 'title-content', elements: [] },
      { id: 2, title: 'Structured Layout', content: 'Clean and organized presentation', background: '#FAFAFA', textColor: '#1B1A17', patternClass: 'pattern-grid', layout: 'title-content', elements: [] },
      { id: 3, title: 'Data Driven', content: 'Insights and analytics', background: '#FAFAFA', textColor: '#1B1A17', patternClass: 'pattern-grid', layout: 'title-content', elements: [] }
    ]},
    29: { id: 29, name: 'Polka Dots', category: 'Design', description: 'Playful dotted pattern design', slides: [
      { id: 1, title: 'Polka Dots', content: 'Fun and Modern Presentation', background: '#FEF3C7', textColor: '#92400E', patternClass: 'pattern-dots', layout: 'title-content', elements: [] },
      { id: 2, title: 'Creative Touch', content: 'Adding visual interest', background: '#FEF3C7', textColor: '#92400E', patternClass: 'pattern-dots', layout: 'title-content', elements: [] },
      { id: 3, title: 'Unique Style', content: 'Stand out from the crowd', background: '#FEF3C7', textColor: '#92400E', patternClass: 'pattern-dots', layout: 'title-content', elements: [] }
    ]},
    30: { id: 30, name: 'Diamond Pattern', category: 'Design', description: 'Elegant diamond grid pattern', slides: [
      { id: 1, title: 'Diamond Design', content: 'Sophisticated Pattern Layout', background: '#F3F4F6', textColor: '#374151', patternClass: 'pattern-diamond', layout: 'title-content', elements: [] },
      { id: 2, title: 'Modern Texture', content: 'Subtle visual depth', background: '#F3F4F6', textColor: '#374151', patternClass: 'pattern-diamond', layout: 'title-content', elements: [] },
      { id: 3, title: 'Professional Edge', content: 'Clean and refined', background: '#F3F4F6', textColor: '#374151', patternClass: 'pattern-diamond', layout: 'title-content', elements: [] }
    ]},
    31: { id: 31, name: 'Diagonal Lines', category: 'Design', description: 'Dynamic diagonal line pattern', slides: [
      { id: 1, title: 'Diagonal Motion', content: 'Dynamic Presentation Design', background: '#DBEAFE', textColor: '#1E40AF', patternClass: 'pattern-diagonal', layout: 'title-content', elements: [] },
      { id: 2, title: 'Forward Motion', content: 'Moving towards goals', background: '#DBEAFE', textColor: '#1E40AF', patternClass: 'pattern-diagonal', layout: 'title-content', elements: [] },
      { id: 3, title: 'Progress', content: 'Continuous improvement', background: '#DBEAFE', textColor: '#1E40AF', patternClass: 'pattern-diagonal', layout: 'title-content', elements: [] }
    ]},
    32: { id: 32, name: 'Soft Gradient', category: 'Design', description: 'Smooth gradient blend background', slides: [
      { id: 1, title: 'Soft Gradients', content: 'Elegant Color Transitions', background: 'linear-gradient(135deg, #E0E7FF, #FAE8FF)', textColor: '#3730A3', patternClass: 'pattern-gradient-soft', layout: 'title-content', elements: [] },
      { id: 2, title: 'Smooth Blend', content: 'Harmonious color schemes', background: 'linear-gradient(135deg, #E0E7FF, #FAE8FF)', textColor: '#3730A3', patternClass: 'pattern-gradient-soft', layout: 'title-content', elements: [] },
      { id: 3, title: 'Modern Feel', content: 'Contemporary and fresh', background: 'linear-gradient(135deg, #E0E7FF, #FAE8FF)', textColor: '#3730A3', patternClass: 'pattern-gradient-soft', layout: 'title-content', elements: [] }
    ]},
    33: { id: 33, name: 'Split Layout', category: 'Design', description: 'Two-tone split background layout', slides: [
      { id: 1, title: 'Split Design', content: 'Bold Two-Tone Layout', background: 'linear-gradient(90deg, #1E3A5F 50%, #ffffff 50%)', textColor: '#FFFFFF', patternClass: 'pattern-split-left', layout: 'title-content', elements: [] },
      { id: 2, title: 'Dual Sections', content: 'Contrast and balance', background: 'linear-gradient(90deg, #1E3A5F 50%, #ffffff 50%)', textColor: '#FFFFFF', patternClass: 'pattern-split-left', layout: 'title-content', elements: [] },
      { id: 3, title: 'Modern Split', content: 'Eye-catching design', background: 'linear-gradient(90deg, #1E3A5F 50%, #ffffff 50%)', textColor: '#FFFFFF', patternClass: 'pattern-split-left', layout: 'title-content', elements: [] }
    ]},
    34: { id: 34, name: 'Gold Dots', category: 'Design', description: 'Elegant gold dotted accent pattern', slides: [
      { id: 1, title: 'Gold Accents', content: 'Premium Presentation Design', background: '#1B1A17', textColor: '#F0A500', patternClass: 'pattern-dots-gold', layout: 'title-content', elements: [] },
      { id: 2, title: 'Subtle Luxury', content: 'Understated elegance', background: '#1B1A17', textColor: '#F0A500', patternClass: 'pattern-dots-gold', layout: 'title-content', elements: [] },
      { id: 3, title: 'Golden Touch', content: 'Adding warmth and class', background: '#1B1A17', textColor: '#F0A500', patternClass: 'pattern-dots-gold', layout: 'title-content', elements: [] }
    ]},
    35: { id: 35, name: 'Gold Grid', category: 'Design', description: 'Professional grid with gold accent', slides: [
      { id: 1, title: 'Gold Grid', content: 'Sophisticated Pattern Design', background: '#1B1A17', textColor: '#F0A500', patternClass: 'pattern-grid-gold', layout: 'title-content', elements: [] },
      { id: 2, title: 'Structured Gold', content: 'Organized and refined', background: '#1B1A17', textColor: '#F0A500', patternClass: 'pattern-grid-gold', layout: 'title-content', elements: [] },
      { id: 3, title: 'Executive Look', content: 'Professional presentation', background: '#1B1A17', textColor: '#F0A500', patternClass: 'pattern-grid-gold', layout: 'title-content', elements: [] }
    ]},
    36: { id: 36, name: 'Warm Gradient', category: 'Design', description: 'Cozy warm gradient background', slides: [
      { id: 1, title: 'Warm Tones', content: 'Cozy and Inviting Design', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', textColor: '#92400E', patternClass: 'pattern-gradient-warm', layout: 'title-content', elements: [] },
      { id: 2, title: 'Comfortable Feel', content: 'Welcoming atmosphere', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', textColor: '#92400E', patternClass: 'pattern-gradient-warm', layout: 'title-content', elements: [] },
      { id: 3, title: 'Friendly Touch', content: 'Approachable design', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', textColor: '#92400E', patternClass: 'pattern-gradient-warm', layout: 'title-content', elements: [] }
    ]},
    37: { id: 37, name: 'Circles Pattern', category: 'Design', description: 'Subtle circular pattern overlay', slides: [
      { id: 1, title: 'Circular Motion', content: 'Flowing Design Pattern', background: '#ECFDF5', textColor: '#065F46', patternClass: 'pattern-circles', layout: 'title-content', elements: [] },
      { id: 2, title: 'Organic Shapes', content: 'Natural and smooth', background: '#ECFDF5', textColor: '#065F46', patternClass: 'pattern-circles', layout: 'title-content', elements: [] },
      { id: 3, title: 'Fluid Design', content: 'Dynamic and engaging', background: '#ECFDF5', textColor: '#065F46', patternClass: 'pattern-circles', layout: 'title-content', elements: [] }
    ]},
    38: { id: 38, name: 'Zigzag Pattern', category: 'Design', description: 'Contemporary zigzag geometric pattern', slides: [
      { id: 1, title: 'Zigzag Design', content: 'Contemporary Pattern Layout', background: '#F5F3FF', textColor: '#5B21B6', patternClass: 'pattern-zigzag', layout: 'title-content', elements: [] },
      { id: 2, title: 'Modern Geometry', content: 'Sharp and clean lines', background: '#F5F3FF', textColor: '#5B21B6', patternClass: 'pattern-zigzag', layout: 'title-content', elements: [] },
      { id: 3, title: 'Dynamic Feel', content: 'Energy and movement', background: '#F5F3FF', textColor: '#5B21B6', patternClass: 'pattern-zigzag', layout: 'title-content', elements: [] }
    ]},
    39: { id: 39, name: 'Hexagon Pattern', category: 'Design', description: 'Modern hexagon honeycomb pattern', slides: [
      { id: 1, title: 'Hexagon Design', content: 'Modern Honeycomb Pattern', background: '#F0F9FF', textColor: '#0369A1', patternClass: 'pattern-hexagon', layout: 'title-content', elements: [] },
      { id: 2, title: 'Connected Cells', content: 'Interconnected design', background: '#F0F9FF', textColor: '#0369A1', patternClass: 'pattern-hexagon', layout: 'title-content', elements: [] },
      { id: 3, title: 'Technical Feel', content: 'Modern and precise', background: '#F0F9FF', textColor: '#0369A1', patternClass: 'pattern-hexagon', layout: 'title-content', elements: [] }
    ]}
  };
  
  const templateList = Object.values(templates);

  useEffect(() => {
    loadRecentFiles();
    loadPinnedFiles();
  }, []);

  const loadRecentFiles = () => {
    // Load from recentFiles first
    const recent = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    
    // Also load from savedPresentations
    const saved = JSON.parse(localStorage.getItem('savedPresentations') || '{}');
    const savedFiles = Object.values(saved).map(p => ({
      id: Date.now() + Math.random(),
      name: p.name + '.pptx',
      modified: p.timestamp,
      slides: p.slides,
      title: p.name
    }));
    
    // Merge and deduplicate by name
    const allFiles = [...recent, ...savedFiles];
    const uniqueFiles = allFiles.filter((file, index, self) => 
      index === self.findIndex(f => f.name === file.name)
    );
    
    setRecentFiles(uniqueFiles.slice(0, 10));
  };

  const loadPinnedFiles = () => {
    const pinned = JSON.parse(localStorage.getItem('pinnedFiles') || '[]');
    setPinnedFiles(pinned);
  };

  const handleCreateNew = (templateId = null) => {
    const template = templateId ? templates[templateId] : null;

    if (template && template.slides) {
      // Generate unique IDs for slides to avoid conflicts
      const baseId = Date.now();
      const slidesWithUniqueIds = template.slides.map((slide, index) => ({
        ...slide,
        id: baseId + index
      }));
      // Add a cover slide to the beginning of the template
      const cover = {
        id: baseId - 1,
        title: template.name || 'Cover',
        content: template.description || '',
        background: template.slides?.[0]?.background || '#1E40AF',
        textColor: template.slides?.[0]?.textColor || '#FFFFFF',
        layout: 'title-only',
        elements: []
      };

      const templateWithUniqueIds = {
        ...template,
        slides: [cover, ...slidesWithUniqueIds]
      };
      navigate('/dashboard', { state: { template: templateWithUniqueIds } });
    } else {
      navigate('/dashboard');
    }
  };

  const handleOpenFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pptx,.ppt,.json';
    input.onchange = (e) => {
      try {
        const file = e.target.files[0];
        if (file) {
          const newFile = {
            id: Date.now(),
            name: file.name,
            modified: new Date().toISOString(),
            file: file
          };
          const recent = JSON.parse(localStorage.getItem('recentFiles') || '[]');
          recent.unshift(newFile);
          localStorage.setItem('recentFiles', JSON.stringify(recent.slice(0, 20)));
          navigate('/dashboard', { state: { file } });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Failed to open file. Please try again.');
      }
    };
    input.click();
  };

  const handlePinFile = (fileId) => {
    const file = recentFiles.find(f => f.id === fileId);
    if (file) {
      const pinned = JSON.parse(localStorage.getItem('pinnedFiles') || '[]');
      if (!pinned.find(p => p.id === fileId)) {
        pinned.push(file);
        localStorage.setItem('pinnedFiles', JSON.stringify(pinned));
        setPinnedFiles(pinned);
      }
    }
  };

  const handleUnpinFile = (fileId) => {
    const pinned = pinnedFiles.filter(f => f.id !== fileId);
    localStorage.setItem('pinnedFiles', JSON.stringify(pinned));
    setPinnedFiles(pinned);
  };

  const handleShareFile = (fileId) => {
    const shareUrl = `${window.location.origin}/dashboard?share=${fileId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const handleDeleteFile = (fileId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const recent = recentFiles.filter(f => f.id !== fileId);
      localStorage.setItem('recentFiles', JSON.stringify(recent));
      setRecentFiles(recent);
    }
  };

  const handleRenameFile = (fileId) => {
    const file = recentFiles.find(f => f.id === fileId);
    if (file) {
      setSelectedFile(file);
      setShowRenameModal(true);
    }
  };

  const handleFileRenamed = (newName) => {
    if (selectedFile) {
      const updatedFiles = recentFiles.map(f => 
        f.id === selectedFile.id ? { ...f, name: newName } : f
      );
      setRecentFiles(updatedFiles);
      localStorage.setItem('recentFiles', JSON.stringify(updatedFiles));
      
      // Also update pinned files if this file is pinned
      const updatedPinned = pinnedFiles.map(f => 
        f.id === selectedFile.id ? { ...f, name: newName } : f
      );
      setPinnedFiles(updatedPinned);
      localStorage.setItem('pinnedFiles', JSON.stringify(updatedPinned));
    }
  };

  const filteredTemplates = templateList.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-black' : 'bg-white'} border-b`} style={{ borderColor: '#F0A500' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Logo className="h-10" />
                <h1 className="text-xl font-semibold" style={{ color: '#F0A500' }}>PowerPoint</h1>
              </div>
              
              {/* Navigation */}
              <nav className="flex space-x-8">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-2 text-sm font-medium hover:opacity-80 cursor-pointer"
                  style={{ color: '#F0A500', pointerEvents: 'auto' }}
                >
                  Dashboard
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates and files"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-80 px-4 py-2 pl-10 pr-4 text-sm border rounded-lg focus:ring-2 focus:outline-none ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}
                  style={{ borderColor: '#F0A500' }}
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ color: '#F0A500' }}
                title="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-white">{user?.name || user?.email}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        Account Settings
                      </button>
                      <button
                        onClick={() => navigate('/change-password')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        Change Password
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-600" />
                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Templates */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#F0A500' }}>Create a new presentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Blank Presentation */}
              <div
                onClick={() => handleCreateNew()}
                className={`cursor-pointer group bg-white rounded-xl border hover:shadow-xl transition-all duration-300 overflow-hidden`}
                style={{ pointerEvents: 'auto', borderColor: '#F0A500' }}
              >
              <div className="aspect-[4/3] bg-white flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-golden-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-lg font-semibold text-golden-500">Blank Presentation</p>
                  <p className="text-sm text-golden-500 mt-1 opacity-90">Start from scratch</p>
                </div>
              </div>
            </div>

            {/* Template Previews */}
            {filteredTemplates.slice(1, 4).map((template) => {
              const cover = template.slides?.[0] || {};
              const bgColor = cover.background || '#4F46E5';
              const textColor = cover.textColor || '#FFFFFF';
              return (
                <div
                  key={template.id}
                  onClick={() => handleCreateNew(template.id)}
                  className={`cursor-pointer group ${isDark ? 'bg-black' : 'bg-white'} rounded-xl border hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  style={{ borderColor: '#F0A500' }}
                  title={template.description}
                >
                  <div className="aspect-[4/3] overflow-hidden" style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)` }}>
                    <div className="w-full h-full flex items-center justify-center text-center p-6">
                      <div className="w-full">
                        <div className="text-xl font-bold mb-2 truncate" style={{ color: textColor }}>{cover.title || template.name}</div>
                        <div className="text-sm mb-3 truncate" style={{ color: textColor, opacity: 0.95 }}>{cover.content || template.description}</div>
                        <div className="text-xs mt-3" style={{ color: textColor, opacity: 0.85 }}>{template.slides?.length || 1} slides</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: '#F0A500' }}>{template.name}</h3>
                    <p className="text-sm" style={{ color: '#F0A500', opacity: 0.7 }}>{template.category}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Browse All Templates removed per UX request */}
        </div>

        {/* Recent Presentations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#F0A500' }}>Recent presentations</h2>
            <button
              onClick={handleOpenFile}
              className="px-4 py-2 rounded-lg transition-colors cursor-pointer"
              style={{ backgroundColor: '#F0A500', color: '#000000', pointerEvents: 'auto' }}
            >
              Open from file
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFiles.slice(0, 6).map((file) => (
              <div
                key={file.id}
                onClick={() => navigate('/dashboard', { state: { template: { name: file.name.replace('.pptx', ''), slides: file.slides } } })}
                className={`cursor-pointer ${isDark ? 'bg-black' : 'bg-white'} rounded-xl border hover:shadow-lg transition-all duration-300 p-6 group`}
                style={{ borderColor: '#F0A500' }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate mb-1" style={{ color: '#F0A500' }}>{file.name}</h3>
                    <p className="text-sm" style={{ color: '#F0A500', opacity: 0.7 }}>Modified {new Date(file.modified).toLocaleDateString()}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameFile(file.id);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinFile(file.id);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Pin"
                    >
                      📌
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareFile(file.id);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Share"
                    >
                      🔗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recentFiles.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recent presentations</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your first presentation to get started</p>
            </div>
          )}
        </div>

        {/* Pinned Files */}
        {pinnedFiles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#F0A500' }}>Pinned</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => navigate('/dashboard')}
                  className={`cursor-pointer ${isDark ? 'bg-black' : 'bg-white'} rounded-xl border hover:shadow-lg transition-all duration-300 p-6 group`}
                  style={{ borderColor: '#F0A500' }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">{file.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Modified {new Date(file.modified).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnpinFile(file.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Unpin"
                    >
                      📌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Rename Modal */}
      <RenameModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        currentName={selectedFile?.name || ''}
        onRename={handleFileRenamed}
      />

      {/* Click outside to close account menu */}
      {showAccountMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAccountMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default Home;