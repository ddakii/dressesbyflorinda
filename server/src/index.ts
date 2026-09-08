import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import fs from 'node:fs'
import path from 'node:path'
import { storeRouter } from './routes/store.js'
import { adminRouter, webhookRouter } from './routes/admin.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const storeUrl =
  process.env.PUBLIC_STORE_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5173')

app.set('trust proxy', 1)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(cors({
  origin: [storeUrl, 'http://localhost:5173'],
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }))

app.use('/api', storeRouter)
app.use('/api/admin', adminRouter)
app.use('/api', webhookRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/sitemap.xml', async (_req, res) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${storeUrl}/</loc></url>
  <url><loc>${storeUrl}/shop</loc></url>
  <url><loc>${storeUrl}/about</loc></url>
  <url><loc>${storeUrl}/contact</loc></url>
</urlset>`)
})

const clientDist = [
  process.env.CLIENT_DIST,
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
].find((dir) => dir && fs.existsSync(path.join(dir, 'index.html')))

if (clientDist) {
  app.use(express.static(clientDist))
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = (err as Error & { status?: number }).status || 500
  res.status(status).json({ error: status === 500 ? 'server_error' : err.message })
})

app.listen(port, () => {
  console.log(`Florinda API listening on ${port}`)
})
