# Background Slides

This folder contains images used for the landing page background carousel.

## How to Add New Images

1. **Add images to this folder** (`/public/images/slides/`)
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Recommended size: High resolution (1920x1080 or larger)
   - File naming: Use descriptive names (e.g., `lab-workspace-01.jpg`)

2. **Update the configuration** in `/public/data/slides.json`:
   ```json
   {
     "slides": [
       {
         "id": "slide-1",
         "filename": "your-image.jpg",
         "alt": "Descriptive alt text for accessibility",
         "order": 1
       }
     ]
   }
   ```

3. **Image order**: Use the `order` field to control the sequence of images

## Current Images

- `DSC06369.jpg` - Research lab workspace with electronics
- `DSC06366.jpg` - Close-up view of circuit board development

## Best Practices

- **Accessibility**: Always provide meaningful `alt` text
- **Performance**: Optimize images before adding (compress, appropriate resolution)
- **Consistency**: Maintain similar aspect ratios and visual style
- **File size**: Keep individual images under 2MB for optimal loading

## Technical Notes

- Images are automatically preloaded to prevent flashing
- The component supports dynamic loading from the configuration
- Fallback system ensures the carousel works even if config fails
- Click areas are positioned over the main content area only
