## Cursor Cloud specific instructions

Dresses by Florinda is a Vite storefront (`client`, port 5173) and an Express/Prisma API (`server`, port 4000). Run commands are in the root `package.json`. `README.md` is UTF-16 LE, so plain-text tools often fail to read it.

- Copy the repo-root `.env.example` to `server/.env` before Prisma or the API. Prisma and `dotenv` load that file from the server directory. The database is SQLite at `server/prisma/dev.db`. `docker-compose.yml` Postgres is unused while `server/prisma/schema.prisma` has `provider = "sqlite"`.
- Create the database with `npm run db:setup --prefix server`. Seeding skips when products already exist. `tsx prisma/seed.ts --force` (from `server/`) deletes orders, users, and the catalog, then reseeds.
- Start `npm run dev` and `npm run dev:server` in separate terminals. Vite proxies `/api` and `/uploads` to port 4000. `npm run dev:all` fetches `concurrently` with `npx`; it is not a root dependency.
- Lint with `npm run lint --prefix client` (oxlint). There is no test runner or `test` script. `npm run build` typechecks and builds both packages.
- Card checkout stays off until `PAYMENT_SECRET_KEY` and `VITE_PAYMENT_PUBLIC_KEY` are set. Guest checkout with cash on delivery works without them. Studio admin is `/admin` (`admin@dressesbyflorinda.com` / `FlorindaAdmin2026!`, from `server/prisma/seed.ts`).
