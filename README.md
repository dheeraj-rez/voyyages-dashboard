# AgentFlow Dashboard

A modern dashboard for managing agent onboarding and tour management built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Modern UI with Tailwind CSS and Radix UI components
- Dark mode support
- Responsive design
- Type-safe database operations with Drizzle ORM
- PostgreSQL database integration
- Toast notifications
- Form validation with React Hook Form and Zod

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** PostgreSQL
- **ORM:** Drizzle
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Font:** Geist Sans

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agentflow.git
cd agentflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```env
DATABASE_URL=your_database_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
└── types/           # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run server` - Start the backend server
- `npm run dev:all` - Run both frontend and backend servers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
