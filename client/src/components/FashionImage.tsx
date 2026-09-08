type Props = {
  src: string
  alt: string
  className?: string
  aspect?: string
  eager?: boolean
}

export function FashionImage({
  src,
  alt,
  className = '',
  aspect = 'aspect-[3/4]',
  eager = false,
}: Props) {
  return (
    <div className={`overflow-hidden bg-beige ${aspect} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover object-[center_18%]"
      />
    </div>
  )
}
