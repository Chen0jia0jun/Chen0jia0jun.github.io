# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern personal website built with **Vue.js 3** featuring a photo gallery and blog system with Markdown support. The site uses localStorage for data persistence and is designed to deploy to GitHub Pages via automated CI/CD.

**Technology Stack:**
- Vue.js 3 (Composition API)
- Vite (build tool)
- Pinia (state management)
- Vue Router 4
- Vitest (testing framework)
- marked.js (Markdown parsing)
- highlight.js (syntax highlighting)

## Common Commands

### Development
```bash
# Start development server (http://localhost:5173)
npm run dev
# Runs generate:posts first to index Markdown files from src/assets/posts/

# Run tests
npm run test

# Run tests with UI interface
npm run test:ui
```

### Building
```bash
# Production build (outputs to dist/)
npm run build

# Build for GitHub Pages (uses github-pages mode)
npm run build:github

# Preview production build locally
npm run preview

# Preview GitHub Pages build locally
npm run preview:github
```

### Data Management
```bash
# Generate posts index from Markdown files
npm run generate:posts

# Export localStorage data for migration to static files
npm run export-data

# Setup GitHub repository configuration
npm run setup:github
```

### CI/CD
- **GitHub Actions**: Automatic deployment on push to `main` branch (see `.github/workflows/deploy-pages.yml`)
- The workflow runs: `generate:posts` → `build` → deploy to GitHub Pages

## Code Architecture

### Application Structure

**Entry Point** (`src/main.js`):
- Creates Vue app instance
- Initializes Pinia for state management
- Sets up Vue Router
- Mounts to `#app` element

**Routing** (`src/router/index.js`):
- Uses `createWebHistory` for client-side routing
- Routes:
  - `/` - Home page
  - `/gallery` - Photo gallery
  - `/blog` - Blog list
  - `/blog/:id` - Individual blog post
  - `/tests` - Lab/test module
- Dynamic page titles: `<title> - Cisphus_World`
- Scroll behavior: Returns to top on navigation

**State Management** (Pinia stores in `src/store/`):
1. **`theme.js`** - Dark/light theme switching with localStorage persistence
2. **`photos.js`** - Photo gallery data (CRUD operations, drag-and-drop support)
3. **`blog.js`** - Blog posts (Markdown rendering, search, filtering)

**Views** (`src/views/`):
- `Home.vue` - Landing page
- `Gallery.vue` - Masonry layout photo grid with filtering
- `Blog.vue` - Post list with search/filter
- `BlogPost.vue` - Individual post with Markdown rendering
- `Tests.vue` - Experimental features/testing

**Components** (`src/components/`):
- `Navbar.vue` - Navigation with theme toggle
- `Footer.vue` - Site footer
- `PhotoModal.vue` - Photo viewer modal

### Build Configuration

**Vite Config** (`vite.config.js`):
- Path alias: `@/` → `src/`
- Base URL: `/` for standard deployment
- Output: `dist/` directory
- Mode: `github-pages` for GitHub Pages deployment

**Posts Index Generation** (`scripts/generatePosts.js`):
- Scans `src/assets/posts/` for `.md` files
- Creates `public/posts_index.json` with metadata
- Uses directory structure as tags (e.g., `posts/tech/article.md` → tag: `tech`)
- Auto-runs before dev/build via npm scripts

### Data Storage

**Current Approach - localStorage**:
```javascript
// Storage keys
'photos'       // Photo gallery data
'blogPosts'    // Blog posts
'theme'        // User theme preference
```

**Static Data Migration** (`src/utils/dataMigration.js`):
- Exports localStorage data to static JSON/Markdown files
- Prepares data for GitHub Pages deployment
- Run via `npm run export-data` in browser console

**Static Posts Structure**:
- Markdown files in `src/assets/posts/`
- Auto-indexed by `generate:posts` script
- Output: `public/posts_index.json`

### Testing

**Test Setup** (`src/test/setup.ts`):
- Vue Test Utils for component testing
- JSDOM environment for browser API simulation

**Test Examples** (`src/test/basic.test.js`):
- Store testing (theme, photos, blog)
- Component rendering tests
- State persistence tests

## Key Features

### Photo Gallery
- Masonry/瀑布流 layout
- Drag-and-drop upload
- Tag-based filtering
- Photo modal viewer
- CRUD operations
- Base64 encoding for localStorage storage

### Blog System
- Markdown support with syntax highlighting
- Auto-generated excerpts
- Search functionality
- Tag-based filtering
- Reading time calculation
- Dynamic routing (`/blog/:id`)

### Theme System
- Dark/light mode toggle
- CSS custom properties for theming
- localStorage persistence
- Automatic application to `document.documentElement`

### Responsive Design
- Mobile-first approach
- Breakpoints: <768px (mobile), 768-1024px (tablet), >1024px (desktop)
- CSS Grid and Flexbox layouts

## GitHub Pages Deployment

**CI/CD Workflow** (`.github/workflows/deploy-pages.yml`):
1. Checks out code on `main` branch push
2. Sets up Node.js 18
3. Installs dependencies (including Linux rollup)
4. Runs `npm run generate:posts`
5. Builds with `npm run build`
6. Uploads `dist/` as GitHub Pages artifact
7. Deploys to `https://Chen0jia0jun.github.io/`

**Deployment Notes**:
- GitHub Actions handles deployment automatically
- No manual intervention required
- Build takes 3-5 minutes
- Ignore paths: README.md, LICENSE, test files, .vscode/, scripts/setupGitHub.js
- Manual deployment available via `npm run build:github`

## Important Notes

1. **localStorage Limitation**: Current storage approach doesn't sync with GitHub Pages. Use `export-data` to migrate to static files.

2. **Base URL Configuration**: Update `vite.config.js` base if deploying to username.github.io/repository instead of username.github.io

3. **Markdown Files**: Place blog posts in `src/assets/posts/` as `.md` files. The `generate:posts` script auto-indexes them.

4. **Image Handling**: Photos are stored as Base64 in localStorage. For production, consider migrating to static image files.

5. **Test Execution**: Tests use Vitest. Run with UI via `npm run test:ui` for better debugging.

6. **Code Style**: Vue 3 Composition API with `<script setup>` syntax. Components use PascalCase naming.

## Working with the Code

### Adding a New Blog Post
1. Create `.md` file in `src/assets/posts/` (subdirectories become tags)
2. First line should be `# Title` for automatic title detection
3. Run `npm run generate:posts` or rebuild
4. Visit `/blog/:id` to view (ID is auto-generated index)

### Adding a New Photo
1. Use the gallery page upload interface
2. Photos stored in localStorage as Base64
3. Data format:
   ```javascript
   { id, title, description, url, thumbnail, date, tags, uploadedAt }
   ```

### Modifying Theme
1. Edit CSS custom properties in `src/style.css`
2. Theme toggle updates `document.documentElement.dataset.theme`
3. Stored in localStorage under `theme` key

### Running Specific Tests
```bash
# Run all tests
npm test

# Run specific test file
npx vitest run src/test/basic.test.js

# Run in watch mode
npm test -- --watch
```

## Configuration Files

- **package.json** - Scripts, dependencies, npm configuration
- **vite.config.js** - Build configuration, path aliases, base URL
- **vitest.config.js** (if exists) - Test environment configuration
- **.github/workflows/deploy-pages.yml** - CI/CD pipeline
- **.gitignore** - Ignored files (dist, node_modules, etc.)
- **.npmrc** - npm configuration (registry, etc.)

## Browser Compatibility

- Modern browsers with ES2020+ support
- Vue 3 and Vite require relatively recent browser versions
- localStorage API required for data persistence
- CSS Grid and Flexbox support needed
