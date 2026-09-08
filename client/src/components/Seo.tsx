import { useEffect } from 'react'

type Props = {
  title: string
  description: string
  canonical?: string
  image?: string
  jsonLd?: Record<string, unknown>
}

export function Seo({ title, description, canonical, image, jsonLd }: Props) {
  useEffect(() => {
    document.title = title
    upsert('name', 'description', description)
    upsert('property', 'og:title', title)
    upsert('property', 'og:description', description)
    if (image) upsert('property', 'og:image', image)
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
    let script = document.getElementById('jsonld-product')
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'jsonld-product'
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else if (script) {
      script.remove()
    }
  }, [title, description, canonical, image, jsonLd])

  return null
}

function upsert(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}
