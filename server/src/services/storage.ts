export async function storeImage(file: { buffer: Buffer; originalname: string; mimetype: string }) {
  const endpoint = process.env.IMAGE_STORAGE_URL
  const key = process.env.IMAGE_STORAGE_KEY
  if (!endpoint || !key) {
    return {
      url: `/uploads/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
      provider: 'local' as const,
    }
  }
  return {
    url: `${endpoint.replace(/\/$/, '')}/${file.originalname}`,
    provider: 'remote' as const,
  }
}
