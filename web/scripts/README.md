# Automatic Slides System

This directory contains scripts for automatically generating slides data based on files in the `public/images/slides/` directory.

## How it works

The slides system now works automatically, similar to how office images work:

1. **Automatic Detection**: The system automatically detects all image and video files in `public/images/slides/`
2. **Filename-based Ordering**: Files are ordered alphabetically by filename (with numeric sorting)
3. **First File as Default**: The first file in the order becomes the default slide
4. **No Manual JSON Updates**: You don't need to manually update `slides.json` when adding new images

## Usage

### Adding New Slides

Simply add image or video files to `public/images/slides/` and run:

```bash
npm run generate-slides
```

The script will automatically:
- Detect all supported files (jpg, png, gif, svg, webp, mp4, webm, mov)
- Sort them alphabetically with numeric awareness
- Generate appropriate alt text from filenames
- Update `public/data/slides.json`

### Supported File Types

- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`
- **Videos**: `.mp4`, `.webm`, `.mov`

### Automatic Generation

The slides are automatically generated before each build via the `prebuild` script in `package.json`.

## File Naming

For best results, use descriptive filenames:
- `1.jpg` → "1"
- `frame-2011.jpg` → "Frame 2011"
- `short-video.mov` → "Short Video"

The system will automatically generate human-readable alt text from your filenames.




