## [Homevision Challenge: House listings](https://challenge-homevision.vercel.app/)

An implementation of an infinite scroll property listing page, available at [challenge-homevision.vercel.app](https://challenge-homevision.vercel.app/)

### Running Locally

This project is based on Next.js. Run the development server with:

```bash
npm i
npm run dev
```

### Running Tests

You can run the tests with:

```bash
npm run test
```

### Linting

You can run the linter with:

```bash
npm run lint
```

## Choices

**Next.js** - Industry standard, useful for built-in routing and image optimization. It could've been a Vite project as well.

**TanStack Query** - For data fetching and caching, with built-in pagination and error handling.

**Tailwind CSS** - For styling, with built-in support for shadcn/ui. Also used Lucide Icons for the icons.

**Playwright** - Primarly because of it's browser support and ease of use.

**Oxlint** - For linting and formatting. I wanted to try something different than ESLint + Prettier and this is a nice and performant alternative.
