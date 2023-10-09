## Features
- Global store with zustand
- Tailwind css for styling
- React Query for data fetching
- CRUD Admin functionality
- Homepage search functionality
- Component code composition / compound components
- I didn't use a css in js/ts lib like emotion, because the setup with the next 13 app dir was an overkill,
  but I was still able to achive some of the advantages of using it like scoped styles, dynamic stying, elimination of className collisions with the cva and
  tailwind-merge libraries, which are also more lightweight. You can find an extensive use of these in the blogCard component

## Routes
- / (homepage)
- /post/id (single post)
- /dashboard (dashboard for CRUD operations)


## Setup Instructions
First, Install the dependencies
```bash
npm i
# or
yarn i
# or
pnpm i
# or
bun i
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
