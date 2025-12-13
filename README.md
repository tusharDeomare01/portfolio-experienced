# Animated Portfolio Website

A modern, animated portfolio website built with React, TypeScript, and Vite. Features an AI assistant, interactive UI components, and optimized for both Vercel and Docker deployments.

## Features

- 🎨 Modern, animated UI with Framer Motion
- 🤖 AI Assistant powered by OpenAI
- 📧 Contact form with EmailJS integration
- 📱 Fully responsive design
- 🚀 Optimized for performance
- 🐳 Docker containerization support
- ☁️ Vercel deployment ready
- 🔒 Security headers and best practices
- ⚡ Fast builds with Vite

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Nginx** - Production web server (Docker)

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Animated-Portfolio-Website-Lightswind-UI-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start development server:
```bash
npm run dev
```

## Deployment

### Vercel Deployment (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_OPENAI_API_KEY`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
3. Deploy automatically on push to main branch

Vercel will automatically:
- Build the application
- Optimize assets
- Handle routing with `vercel.json` configuration

### Docker Deployment

For self-hosted or containerized deployments, see [DOCKER.md](./DOCKER.md) for detailed instructions.

Quick start:
```bash
docker-compose up --build
```

The application will be available at http://localhost:8080

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/          # Route pages
│   ├── store/          # Redux store
│   ├── lib/            # Utilities and helpers
│   └── App.tsx         # Main app component
├── public/             # Static assets
├── dist/               # Build output
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── vercel.json         # Vercel configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run generate-seo` - Generate SEO files

## Environment Variables

See `.env.example` for required environment variables. All `VITE_*` variables are needed at build time.

## Performance Optimizations

- Code splitting with React.lazy()
- Asset optimization and compression
- Static asset caching (1 year)
- Gzip compression
- Security headers
- Multi-stage Docker builds

## Security

- Security headers (XSS protection, frame options, etc.)
- Non-root user in Docker containers
- Environment variable validation
- Content Security Policy ready

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on the repository.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
