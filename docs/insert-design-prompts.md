# Presentation Tool Prompts — Insert & Design

Date: 2025-11-19

This document contains detailed prompts describing the `Insert` and `Design` functionality for a presentation tool, using Microsoft PowerPoint as a functional reference. Use these prompts for training, product spec, or implementation guidance.

---

## Prompt 1: The "Insert" Function

**Objective:** Define the complete functionality, logic, and user experience for the **"Insert"** tab and its ribbon in a presentation software application.

**Reference Application:** Microsoft PowerPoint.

**Core Principle:** The "Insert" function allows users to add and place new, editable objects onto a slide. These objects are distinct from the slide's background or master template and form the core content of the presentation.

### Key Functionalities & Sub-menus to be defined:

1.  **Slides:**
    -   **New Slide:** Inserts a new slide *after* the currently selected slide. The new slide should adopt the layout of the previous slide by default, but a dropdown should offer all available slide layouts (Title Slide, Title and Content, Two Content, etc.).
    -   **Reuse Slides:** Opens a pane to import slides from another presentation file, with an option to "Keep source formatting."

2.  **Tables:**
    -   **Insert Table:** Opens a grid to select rows and columns visually, with an option for a precise "Insert Table" dialog box to specify exact numbers.
    -   **Draw Table:** Allows freehand drawing of table cells and borders.
    -   **Excel Spreadsheet:** Embeds a fully functional, editable mini-Excel spreadsheet object.

3.  **Images:**
    -   **Pictures:** Opens a file browser to insert an image from a local device or cloud storage. Supported formats: JPG, PNG, GIF, SVG, BMP.
    -   **Online Pictures:** Provides a search interface to find and insert images from licensed online sources (e.g., Bing Image Search, OneDrive, Flickr).
    -   **Screenshot:** Captures and inserts a screenshot of another open application window or a defined screen clipping.
    -   **Photo Album:** Launches a wizard to quickly create a presentation composed primarily of images with uniform formatting.

4.  **Illustrations:**
    -   **Shapes:** A dropdown gallery of pre-defined shapes (rectangles, circles, arrows, stars, callouts). Clicking a shape allows the user to draw it on the slide.
    -   **Icons:** A library of modern, scalable vector icons (line-based and filled) sorted by category.
    -   **3D Models:** Inserts 3D model files (.glb, .fbx, .obj) that can be rotated and tilted interactively.
    -   **SmartArt:** Inserts pre-designed diagram templates (Hierarchy, Process, Cycle, Relationship) where text can be added in a dedicated pane.
    -   **Chart:** Opens a dialog to select a chart type (Column, Line, Pie, Bar, etc.), inserts the chart onto the slide, and opens a linked Excel spreadsheet for data entry.

5.  **Add-ins:** A section to access and insert content from third-party plugins and integrations.

6.  **Links:**
    -   **Link (Hyperlink):** Attaches a hyperlink to a selected object or text. Destinations can be: Another slide in this presentation, a web URL, an email address, or another file.
    -   **Action:** Defines more complex interactions, like playing a sound or running a program when the object is clicked or hovered over.

7.  **Comments:** Inserts a new comment thread anchored to the selected object or text, visible in the margins for collaboration.

8.  **Text:**
    -   **Text Box:** Inserts a clickable, draggable, and resizable box for free-form text. The cursor appears ready for input.
    -   **Header & Footer:** Opens a dialog to set text (like slide numbers, date, and custom footer) that appears on all slides or selected slides based on master settings.
    -   **WordArt:** Inserts a text box with pre-applied stylized effects (shadows, glows, bevels, 3D rotation).
    -   **Date & Time:** Inserts a dynamic date/time field that updates automatically.
    -   **Slide Number:** Inserts a dynamic field that displays the current slide number.
    -   **Object:** Embeds or links to an external file (e.g., a PDF, Word doc) as an icon on the slide.

9.  **Symbols:**
    -   **Equation:** Provides a tool for inserting and editing complex mathematical equations and structures.
    -   **Symbol:** Opens a character map to insert special characters not found on a standard keyboard (e.g., ©, ®, ±, μ).

10. **Media:**
    -   **Video:** Inserts a video file from the local device or an online source (e.g., YouTube). Must support common formats (MP4, MOV).
    -   **Audio:** Inserts an audio file to play in the background or on click. An audio icon appears on the slide.
    -   **Screen Recording:** Opens a control panel to record a portion of the screen and directly insert the video recording into the slide.

### Behavioral Rules:
-   All inserted objects are placed centrally on the active slide by default.
-   All inserted objects are immediately selectable, movable, and resizable.
-   Inserting an object should automatically switch the ribbon context to the relevant "Format" tab for that object (e.g., Picture Format, Shape Format).

---

## Prompt 2: The "Design" Function

**Objective:** Define the complete functionality, logic, and user experience for the **"Design"** tab and its ribbon in a presentation software application.

**Reference Application:** Microsoft PowerPoint.

**Core Principle:** The "Design" function controls the overall aesthetic, consistency, and visual foundation of the entire presentation. It applies global changes rather than editing individual objects.

### Key Functionalities & Sub-menus to be defined:

1.  **Themes:**
    -   **Theme Gallery:** A horizontally scrolling gallery of pre-designed themes. Each theme is a comprehensive package including:
        -   **Color Palette:** A set of coordinated colors for text, backgrounds, accents, and hyperlinks.
        -   **Font Scheme:** A pair of complementary fonts for headings and body text.
        -   **Effect Scheme:** A set of predefined styles for shapes and lines (shadows, glows, bevels).
        -   **Background Style:** A default background fill (often with a gradient or subtle texture).
    -   **Behavior:** Applying a theme changes the look of *every slide* in the presentation instantly. It provides visual consistency.
    -   **Save Current Theme:** Allows the user to save their custom combinations of Colors, Fonts, and Effects as a new, reusable theme file.

2.  **Variant Group:**
    -   **Variants Gallery:** A set of visual alternatives for the *currently selected theme*. These typically offer different:
        -   **Color Schemes:** Alternate palettes for the same theme structure.
        -   **Background Styles:** Different background fills (solid, gradient, pattern) for the slides.
    -   **Behavior:** Clicking a variant applies it to all slides that are using the main theme.

3.  **Customize Group (Theme Tools):**
    -   **Format Background:** Opens a detailed pane on the right side of the screen with advanced options:
        -   **Fill:** Solid fill, Gradient fill, Picture or texture fill, Pattern fill.
        -   **Hide Background Graphics:** A checkbox to temporarily hide graphics from the slide master on the current slide(s).
        -   **Apply to All:** A button to apply the background settings to every slide.
    -   **Colors:** A dropdown to select from all built-in color palettes or create a **Custom Color Scheme**.
    -   **Fonts:** A dropdown to select from all built-in font pairs or create a **Custom Font Scheme**.
    -   **Effects:** A dropdown to select a different set of object effects (e.g., "Glossy," "Metallic," "Flat").

4.  **Slide Size:**
    -   **Standard (4:3):** Sets the slide dimensions to the traditional aspect ratio.
    -   **Widescreen (16:9):** Sets the slide dimensions to the modern widescreen aspect ratio.
    -   **Custom Slide Size:** Opens a dialog for precise control over slide width, height, orientation (Portrait/Landscape), and numbering.

### Behavioral Rules:
-   Changes in the Design tab are typically **global**, affecting the entire presentation's appearance.
-   The "Format Background" pane allows for per-slide customization, but includes an explicit "Apply to All" button.
-   The user should be able to right-click a variant or theme and choose "Apply to Selected Slides" to break consistency for specific slides.
-   The Design functions work in tandem with the "Slide Master" view. Changes in the Slide Master (like placeholder positions) are reflected in the themes, but the Design tab is the primary user-facing interface for applying these aesthetics.

---

### Usage notes

- These prompts are intentionally detailed to be used either verbatim as training examples, or as a product specification for implementation. They focus on user intent, UI affordances, and behavioral rules.
- If you'd like, I can split these into separate files per feature (e.g., `insert.md`, `design.md`) or convert them into JSON or YAML for ingestion by tooling.


---

*End of document.*
