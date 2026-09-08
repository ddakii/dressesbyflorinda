import type { Category, Collection, Product } from '@/types'

export const categories: Category[] = [
  {
    id: 'cat-evening',
    slug: 'evening',
    name: { en: 'Evening Dresses', sq: 'Fustane Mbrëmjeje' },
    description: {
      en: 'Sculpted silhouettes for nights that stay with you.',
      sq: 'Silueta të skulpturuara për netët që mbahen mend.',
    },
    image: '/images/look-16.jpg',
  },
  {
    id: 'cat-occasion',
    slug: 'occasion',
    name: { en: 'Occasion Dresses', sq: 'Fustane për Raste' },
    description: {
      en: 'Refined pieces for celebrations, ceremonies and gatherings.',
      sq: 'Modele të rafinuara për festime, ceremonia dhe takime.',
    },
    image: '/images/look-19.jpg',
  },
  {
    id: 'cat-cocktail',
    slug: 'cocktail',
    name: { en: 'Cocktail Dresses', sq: 'Fustane Cocktail' },
    description: {
      en: 'Shorter, luminous forms with a quiet sense of occasion.',
      sq: 'Forma më të shkurtra dhe të ndritshme, me elegancë të qetë.',
    },
    image: '/images/look-12.jpg',
  },
  {
    id: 'cat-bridal',
    slug: 'bridal',
    name: { en: 'Bridal / Special Occasion', sq: 'Nuse / Raste të Veçanta' },
    description: {
      en: 'Ivory and white gowns for the most considered moments.',
      sq: 'Fustane ivori dhe të bardha për momentet më të veçanta.',
    },
    image: '/images/look-27.jpg',
  },
  {
    id: 'cat-new',
    slug: 'new-arrivals',
    name: { en: 'New Arrivals', sq: 'Të Rejat' },
    description: {
      en: 'The latest silhouettes from the atelier.',
      sq: 'Siluetat më të reja nga atelieja.',
    },
    image: '/images/look-14.jpg',
  },
  {
    id: 'cat-bestsellers',
    slug: 'best-sellers',
    name: { en: 'Best Sellers', sq: 'Më të Kërkuarat' },
    description: {
      en: 'The pieces most often chosen by our clients.',
      sq: 'Modelet që zgjidhen më shpesh nga klientet tona.',
    },
    image: '/images/look-25.jpg',
  },
]

export const collections: Collection[] = [
  {
    id: 'col-evening',
    slug: 'evening-edit',
    name: { en: 'The Evening Edit', sq: 'Përzgjedhja e Mbrëmjes' },
    description: {
      en: 'Voluminous gowns and precise evening lines, photographed in a quieter light.',
      sq: 'Fustane voluminoze dhe linja të sakta mbrëmjeje, në një dritë më të qetë.',
    },
    heroImage: '/images/look-16.jpg',
  },
  {
    id: 'col-signature',
    slug: 'signature',
    name: { en: 'Signature', sq: 'Nënshkrimi' },
    description: {
      en: 'The house codes — lace, cape, crystal and a considered silhouette.',
      sq: 'Gjuha e shtëpisë — dantellë, kepë, kristal dhe një siluetë e menduar.',
    },
    heroImage: '/images/look-14.jpg',
  },
  {
    id: 'col-season',
    slug: 'new-season',
    name: { en: 'New Season', sq: 'Sezoni i Ri' },
    description: {
      en: 'Fresh arrivals in champagne, ivory and rose gold.',
      sq: 'Modele të reja në shampanjë, ivor dhe ar trëndafili.',
    },
    heroImage: '/images/look-12.jpg',
  },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL'] as const

function variants(
  prefix: string,
  colors: { name: string; hex: string }[],
  stockMap: Record<string, number>,
) {
  return colors.flatMap((color) =>
    sizes.map((size) => ({
      id: `${prefix}-${color.name.toLowerCase().replace(/\s+/g, '')}-${size.toLowerCase()}`,
      size,
      color: color.name,
      colorHex: color.hex,
      sku: `${prefix}-${color.name.slice(0, 3).toUpperCase()}-${size}`,
      stock: stockMap[size] ?? 6,
    })),
  )
}

export const products: Product[] = [
  {
    id: 'p-luna',
    slug: 'luna-silk-dress',
    sku: 'DBF-LUNA',
    name: { en: 'Luna Silk Dress', sq: 'Fustani Luna Silk' },
    description: {
      en: 'An elegant silhouette crafted for sophisticated evenings, with a sculpted bodice and a quietly luminous skirt.',
      sq: 'Një siluetë elegante për mbrëmje të rafinuara, me korset të skulpturuar dhe fustan që ndriçon butësisht.',
    },
    details: {
      en: 'Fully lined. Concealed zip. Dry clean only. Store hanging, away from direct light.',
      sq: 'I astaruar plotësisht. Zip i fshehur. Vetëm pastrim kimik. Ruajeni të varur, larg dritës së drejtpërdrejtë.',
    },
    sizeFit: {
      en: 'Fitted through the bodice with a fluid hem. Model wears size S.',
      sq: 'Ngushtë te korseti, me fund të lëvizshëm. Modelja mban madhësinë S.',
    },
    price: 24900,
    salePrice: null,
    categoryId: 'cat-occasion',
    collectionId: 'col-season',
    featured: true,
    newArrival: true,
    archived: false,
    images: [
      { url: '/images/look-19.jpg', alt: { en: 'Luna silk dress, front view', sq: 'Fustani Luna Silk, pamje e përparme' } },
      { url: '/images/look-21.jpg', alt: { en: 'Luna silk dress, terrace', sq: 'Fustani Luna Silk, tarracë' } },
      { url: '/images/look-01.jpg', alt: { en: 'Luna silk dress, editorial', sq: 'Fustani Luna Silk, editorial' } },
    ],
    variants: variants('luna', [{ name: 'Champagne', hex: '#C4B7A0' }, { name: 'Ivory', hex: '#F4F0E8' }], {
      XS: 4, S: 8, M: 6, L: 2, XL: 0,
    }),
    metaTitle: { en: 'Luna Silk Dress | Dresses by Florinda', sq: 'Fustani Luna Silk | Dresses by Florinda' },
    metaDescription: {
      en: 'The Luna Silk Dress — a champagne evening silhouette by Dresses by Florinda.',
      sq: 'Fustani Luna Silk — një siluetë mbrëmjeje në shampanjë nga Dresses by Florinda.',
    },
  },
  {
    id: 'p-celeste',
    slug: 'celeste-evening-gown',
    sku: 'DBF-CELESTE',
    name: { en: 'Celeste Evening Gown', sq: 'Fustani i Mbrëmjes Celeste' },
    description: {
      en: 'A voluminous ivory gown with floral texture, designed to hold the light of a formal room.',
      sq: 'Një fustan ivor voluminos me teksturë lulesh, i menduar për dritën e një salla formale.',
    },
    details: {
      en: 'Layered skirt. Structured bodice. Dry clean only.',
      sq: 'Fund me shtresa. Korset i strukturuar. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Ballgown volume from the waist. Allow extra length for heels.',
      sq: 'Volum topaze nga beli. Lini gjatësi shtesë për taka.',
    },
    price: 38900,
    salePrice: null,
    categoryId: 'cat-evening',
    collectionId: 'col-evening',
    featured: true,
    newArrival: false,
    archived: false,
    images: [
      { url: '/images/look-16.jpg', alt: { en: 'Celeste evening gown', sq: 'Fustani i mbrëmjes Celeste' } },
      { url: '/images/look-15.jpg', alt: { en: 'Celeste evening gown, bodice', sq: 'Fustani Celeste, korset' } },
      { url: '/images/look-02.jpg', alt: { en: 'Celeste evening gown, editorial', sq: 'Fustani Celeste, editorial' } },
    ],
    variants: variants('celeste', [{ name: 'Ivory', hex: '#F4F0E8' }], { XS: 2, S: 5, M: 5, L: 3, XL: 1 }),
    metaTitle: { en: 'Celeste Evening Gown | Dresses by Florinda', sq: 'Fustani Celeste | Dresses by Florinda' },
    metaDescription: {
      en: 'Celeste — an ivory evening gown with floral volume.',
      sq: 'Celeste — fustan mbrëmjeje ivor me volum lulesh.',
    },
  },
  {
    id: 'p-amelia',
    slug: 'amelia-satin-dress',
    sku: 'DBF-AMELIA',
    name: { en: 'Amelia Satin Dress', sq: 'Fustani Amelia Satin' },
    description: {
      en: 'A rose-gold cocktail dress with a matching cape — luminous, precise, and made for the hour after dusk.',
      sq: 'Fustan cocktail në ar trëndafili me kepë përputhëse — i ndritshëm, i saktë, për orën pas muzgut.',
    },
    details: {
      en: 'Sequinned surface. Detachable cape. Dry clean only.',
      sq: 'Sipërfaqe me sequin. Kepë e shkëputshme. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Mini length with a long cape. Fitted bodice.',
      sq: 'Gjatësi mini me kepë të gjatë. Korset i ngushtë.',
    },
    price: 27900,
    salePrice: null,
    categoryId: 'cat-cocktail',
    collectionId: 'col-season',
    featured: true,
    newArrival: true,
    archived: false,
    images: [
      { url: '/images/look-12.jpg', alt: { en: 'Amelia satin dress with cape', sq: 'Fustani Amelia me kepë' } },
      { url: '/images/look-14.jpg', alt: { en: 'Amelia satin dress, standing', sq: 'Fustani Amelia, në këmbë' } },
      { url: '/images/look-03.jpg', alt: { en: 'Amelia satin dress, detail', sq: 'Fustani Amelia, detaj' } },
    ],
    variants: variants('amelia', [{ name: 'Rose Gold', hex: '#C9A48A' }], { XS: 3, S: 6, M: 4, L: 2, XL: 0 }),
    metaTitle: { en: 'Amelia Satin Dress | Dresses by Florinda', sq: 'Fustani Amelia Satin | Dresses by Florinda' },
    metaDescription: {
      en: 'Amelia — a rose-gold cocktail dress with cape.',
      sq: 'Amelia — fustan cocktail në ar trëndafili me kepë.',
    },
  },
  {
    id: 'p-elara',
    slug: 'elara-velvet-dress',
    sku: 'DBF-ELARA',
    name: { en: 'Elara Velvet Dress', sq: 'Fustani Elara Velvet' },
    description: {
      en: 'A pale, pleated cape dress with a quiet drama — designed to move through a paneled room.',
      sq: 'Një fustan i zbehtë me kepë të palosur dhe dramë të qetë — i menduar për t’u lëvizur në një dhomë me panele.',
    },
    details: {
      en: 'Pleated overlay. Soft lining. Dry clean only.',
      sq: 'Mbulesë e palosur. Astar i butë. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Short dress with floor-length cape. True to size.',
      sq: 'Fustan i shkurtër me kepë deri në tokë. Sipas madhësisë.',
    },
    price: 31900,
    salePrice: null,
    categoryId: 'cat-occasion',
    collectionId: 'col-signature',
    featured: false,
    newArrival: true,
    archived: false,
    images: [
      { url: '/images/look-14.jpg', alt: { en: 'Elara cape dress, standing', sq: 'Fustani Elara, në këmbë' } },
      { url: '/images/look-12.jpg', alt: { en: 'Elara cape dress, seated', sq: 'Fustani Elara, ulur' } },
      { url: '/images/look-04.jpg', alt: { en: 'Elara cape dress, editorial', sq: 'Fustani Elara, editorial' } },
    ],
    variants: variants('elara', [{ name: 'Ivory', hex: '#F4F0E8' }, { name: 'Blush', hex: '#E8D5CC' }], {
      XS: 4, S: 7, M: 5, L: 3, XL: 1,
    }),
    metaTitle: { en: 'Elara Velvet Dress | Dresses by Florinda', sq: 'Fustani Elara Velvet | Dresses by Florinda' },
    metaDescription: {
      en: 'Elara — a pleated ivory cape dress.',
      sq: 'Elara — fustan ivor me kepë të palosur.',
    },
  },
  {
    id: 'p-sienna',
    slug: 'sienna-draped-dress',
    sku: 'DBF-SIENNA',
    name: { en: 'Sienna Draped Dress', sq: 'Fustani Sienna Draped' },
    description: {
      en: 'An ivory gown with pearl and floral embroidery, made for daylight ceremonies.',
      sq: 'Një fustan ivor me qëndisje perlash dhe lulesh, për ceremonia në dritë dite.',
    },
    details: {
      en: 'Beaded illusion neckline. Soft drape. Dry clean only.',
      sq: 'Jaka me rruaza. draperim i butë. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Fitted through the torso with a fluid skirt.',
      sq: 'Ngushtë te trupi, me fund të lëvizshëm.',
    },
    price: 22900,
    salePrice: null,
    categoryId: 'cat-bridal',
    collectionId: 'col-season',
    featured: false,
    newArrival: true,
    archived: false,
    images: [
      { url: '/images/look-13.jpg', alt: { en: 'Sienna draped dress', sq: 'Fustani Sienna' } },
      { url: '/images/look-22.jpg', alt: { en: 'Sienna draped dress, atelier', sq: 'Fustani Sienna, atelie' } },
      { url: '/images/look-05.jpg', alt: { en: 'Sienna draped dress, editorial', sq: 'Fustani Sienna, editorial' } },
    ],
    variants: variants('sienna', [{ name: 'Ivory', hex: '#F4F0E8' }], { XS: 5, S: 8, M: 6, L: 4, XL: 2 }),
    metaTitle: { en: 'Sienna Draped Dress | Dresses by Florinda', sq: 'Fustani Sienna | Dresses by Florinda' },
    metaDescription: {
      en: 'Sienna — an embroidered ivory draped dress.',
      sq: 'Sienna — fustan ivor i qëndisur me draperim.',
    },
  },
  {
    id: 'p-isabelle',
    slug: 'isabelle-signature-dress',
    sku: 'DBF-ISABELLE',
    name: { en: 'Isabelle Signature Dress', sq: 'Fustani Isabelle Signature' },
    description: {
      en: 'A grand white ball gown with floral lace and a long veil — the house signature in its most formal expression.',
      sq: 'Një fustan i bardhë madhështor me dantellë lulesh dhe velo të gjatë — nënshkrimi i shtëpisë në formën e tij më formale.',
    },
    details: {
      en: 'Lace appliqué bodice. Full skirt. Veil available separately. Dry clean only.',
      sq: 'Korset me aplikime dantelle. Fund i plotë. Veloja ofrohet veçmas. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Ballgown. Structured waist. Appointment recommended for fitting.',
      sq: 'Siluetë topaze. Bel i strukturuar. Rekomandohet takim për provë.',
    },
    price: 34900,
    salePrice: null,
    categoryId: 'cat-bridal',
    collectionId: 'col-signature',
    featured: true,
    newArrival: false,
    archived: false,
    images: [
      { url: '/images/look-27.jpg', alt: { en: 'Isabelle signature dress', sq: 'Fustani Isabelle Signature' } },
      { url: '/images/look-18.jpg', alt: { en: 'Isabelle signature dress, atelier', sq: 'Fustani Isabelle, atelie' } },
      { url: '/images/look-24.jpg', alt: { en: 'Isabelle signature dress, evening light', sq: 'Fustani Isabelle, dritë mbrëmjeje' } },
      { url: '/images/look-26.jpg', alt: { en: 'Isabelle signature dress, veil', sq: 'Fustani Isabelle, velo' } },
    ],
    variants: variants('isabelle', [{ name: 'Ivory', hex: '#F4F0E8' }, { name: 'White', hex: '#FFFFFF' }], {
      XS: 1, S: 3, M: 4, L: 2, XL: 0,
    }),
    metaTitle: { en: 'Isabelle Signature Dress | Dresses by Florinda', sq: 'Fustani Isabelle | Dresses by Florinda' },
    metaDescription: {
      en: 'Isabelle — the signature white ball gown.',
      sq: 'Isabelle — fustani i bardhë nënshkrim i shtëpisë.',
    },
  },
  {
    id: 'p-valentina',
    slug: 'valentina-lace-gown',
    sku: 'DBF-VALENTINA',
    name: { en: 'Valentina Lace Gown', sq: 'Fustani Valentina Lace' },
    description: {
      en: 'Long sleeves, a cinched waist and all-over lace — a quieter kind of evening formality.',
      sq: 'Mëngë të gjata, bel i ngushtë dhe dantellë e plotë — një formalitet mbrëmjeje më i qetë.',
    },
    details: {
      en: 'Stretch lace over lining. Concealed zip. Dry clean only.',
      sq: 'Dantellë elastike mbi astar. Zip i fshehur. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Fitted through the body with a full skirt.',
      sq: 'Ngushtë te trupi, me fund të plotë.',
    },
    price: 42900,
    salePrice: null,
    categoryId: 'cat-evening',
    collectionId: 'col-evening',
    featured: false,
    newArrival: false,
    archived: false,
    images: [
      { url: '/images/look-16.jpg', alt: { en: 'Valentina lace gown', sq: 'Fustani Valentina Lace' } },
      { url: '/images/look-20.jpg', alt: { en: 'Valentina lace gown, staircase', sq: 'Fustani Valentina, shkallë' } },
      { url: '/images/look-06.jpg', alt: { en: 'Valentina lace gown, detail', sq: 'Fustani Valentina, detaj' } },
    ],
    variants: variants('valentina', [{ name: 'Ivory', hex: '#F4F0E8' }], { XS: 2, S: 4, M: 4, L: 2, XL: 1 }),
    metaTitle: { en: 'Valentina Lace Gown | Dresses by Florinda', sq: 'Fustani Valentina | Dresses by Florinda' },
    metaDescription: {
      en: 'Valentina — an ivory lace evening gown.',
      sq: 'Valentina — fustan mbrëmjeje ivor me dantellë.',
    },
  },
  {
    id: 'p-aurora',
    slug: 'aurora-crystal-gown',
    sku: 'DBF-AURORA',
    name: { en: 'Aurora Crystal Gown', sq: 'Fustani Aurora Crystal' },
    description: {
      en: 'A strapless white gown with crystal scallops at the bodice — architectural, bright, and exact.',
      sq: 'Një fustan i bardhë pa rripash me kristale në korset — arkitektonik, i ndritshëm dhe i saktë.',
    },
    details: {
      en: 'Crystal embroidery. Mermaid hem. Dry clean only.',
      sq: 'Qëndisje kristali. Fund mermaid. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Structured strapless bodice. Fitted through the hip.',
      sq: 'Korset i strukturuar pa rripash. Ngushtë te ijet.',
    },
    price: 45900,
    salePrice: null,
    categoryId: 'cat-evening',
    collectionId: 'col-evening',
    featured: true,
    newArrival: false,
    archived: false,
    images: [
      { url: '/images/look-25.jpg', alt: { en: 'Aurora crystal gown', sq: 'Fustani Aurora Crystal' } },
      { url: '/images/look-15.jpg', alt: { en: 'Aurora crystal gown, bodice', sq: 'Fustani Aurora, korset' } },
      { url: '/images/look-07.jpg', alt: { en: 'Aurora crystal gown, editorial', sq: 'Fustani Aurora, editorial' } },
    ],
    variants: variants('aurora', [{ name: 'White', hex: '#FFFFFF' }], { XS: 1, S: 3, M: 3, L: 1, XL: 0 }),
    metaTitle: { en: 'Aurora Crystal Gown | Dresses by Florinda', sq: 'Fustani Aurora | Dresses by Florinda' },
    metaDescription: {
      en: 'Aurora — a crystal-embroidered white evening gown.',
      sq: 'Aurora — fustan i bardhë mbrëmjeje me kristale.',
    },
  },
  {
    id: 'p-camille',
    slug: 'camille-bridal-gown',
    sku: 'DBF-CAMILLE',
    name: { en: 'Camille Bridal Gown', sq: 'Fustani i Nuses Camille' },
    description: {
      en: 'A fitted lace bridal gown with a long train, intended for gardens and open terraces.',
      sq: 'Një fustan nuseje me dantellë, i ngushtë, me tren të gjatë, për kopshte dhe tarraca të hapura.',
    },
    details: {
      en: 'Lace overlay. Chapel train. Dry clean only.',
      sq: 'Mbulesë dantelle. Tren chapel. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Column silhouette. Recommended fitting.',
      sq: 'Siluetë kolonë. Rekomandohet provë.',
    },
    price: 52000,
    salePrice: null,
    categoryId: 'cat-bridal',
    collectionId: 'col-signature',
    featured: false,
    newArrival: false,
    archived: false,
    images: [
      { url: '/images/look-13.jpg', alt: { en: 'Camille bridal gown', sq: 'Fustani i nuses Camille' } },
      { url: '/images/look-22.jpg', alt: { en: 'Camille bridal gown, portrait', sq: 'Fustani Camille, portret' } },
      { url: '/images/look-08.jpg', alt: { en: 'Camille bridal gown, editorial', sq: 'Fustani Camille, editorial' } },
    ],
    variants: variants('camille', [{ name: 'Ivory', hex: '#F4F0E8' }, { name: 'White', hex: '#FFFFFF' }], {
      XS: 2, S: 4, M: 5, L: 3, XL: 1,
    }),
    metaTitle: { en: 'Camille Bridal Gown | Dresses by Florinda', sq: 'Fustani Camille | Dresses by Florinda' },
    metaDescription: {
      en: 'Camille — a fitted lace bridal gown with train.',
      sq: 'Camille — fustan nuseje me dantellë dhe tren.',
    },
  },
  {
    id: 'p-noor',
    slug: 'noor-pearl-dress',
    sku: 'DBF-NOOR',
    name: { en: 'Noor Pearl Dress', sq: 'Fustani Noor Pearl' },
    description: {
      en: 'A strapless ivory gown with pearl and crystal work along a sharp sweetheart line.',
      sq: 'Një fustan ivor pa rripash me perlë dhe kristal përgjatë një linje sweetheart të mprehtë.',
    },
    details: {
      en: 'Hand-applied pearls. Satin base. Dry clean only.',
      sq: 'Perla të vendosura me dorë. Bazë sateni. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Corset bodice. Full skirt. True to size.',
      sq: 'Korset. Fund i plotë. Sipas madhësisë.',
    },
    price: 39900,
    salePrice: 34900,
    categoryId: 'cat-evening',
    collectionId: 'col-evening',
    featured: false,
    newArrival: false,
    archived: false,
    images: [
      { url: '/images/look-25.jpg', alt: { en: 'Noor pearl dress', sq: 'Fustani Noor Pearl' } },
      { url: '/images/look-22.jpg', alt: { en: 'Noor pearl dress, atelier', sq: 'Fustani Noor, atelie' } },
      { url: '/images/look-09.jpg', alt: { en: 'Noor pearl dress, editorial', sq: 'Fustani Noor, editorial' } },
    ],
    variants: variants('noor', [{ name: 'Ivory', hex: '#F4F0E8' }], { XS: 3, S: 5, M: 4, L: 2, XL: 0 }),
    metaTitle: { en: 'Noor Pearl Dress | Dresses by Florinda', sq: 'Fustani Noor | Dresses by Florinda' },
    metaDescription: {
      en: 'Noor — a pearl-embroidered ivory gown.',
      sq: 'Noor — fustan ivor me qëndisje perlash.',
    },
  },
  {
    id: 'p-seraphine',
    slug: 'seraphine-cape-dress',
    sku: 'DBF-SERAPHINE',
    name: { en: 'Seraphine Cape Dress', sq: 'Fustani Seraphine Cape' },
    description: {
      en: 'A champagne cape that falls like light through a paneled hall — the image of the new collection.',
      sq: 'Një kepë shampanjë që bie si dritë nëpër një sallë me panele — imazhi i koleksionit të ri.',
    },
    details: {
      en: 'Sheer overlay. Soft lining. Dry clean only.',
      sq: 'Mbulesë e tejdukshme. Astar i butë. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Relaxed cape over a fitted dress.',
      sq: 'Kepë e lirë mbi fustan të ngushtë.',
    },
    price: 36900,
    salePrice: null,
    categoryId: 'cat-evening',
    collectionId: 'col-signature',
    featured: true,
    newArrival: true,
    archived: false,
    images: [
      { url: '/images/look-14.jpg', alt: { en: 'Seraphine cape dress', sq: 'Fustani Seraphine Cape' } },
      { url: '/images/look-12.jpg', alt: { en: 'Seraphine cape dress, seated', sq: 'Fustani Seraphine, ulur' } },
      { url: '/images/look-10.jpg', alt: { en: 'Seraphine cape dress, editorial', sq: 'Fustani Seraphine, editorial' } },
    ],
    variants: variants('seraphine', [{ name: 'Champagne', hex: '#C4B7A0' }], { XS: 3, S: 6, M: 5, L: 3, XL: 1 }),
    metaTitle: { en: 'Seraphine Cape Dress | Dresses by Florinda', sq: 'Fustani Seraphine | Dresses by Florinda' },
    metaDescription: {
      en: 'Seraphine — a champagne cape dress from the new collection.',
      sq: 'Seraphine — fustan me kepë shampanjë nga koleksioni i ri.',
    },
  },
  {
    id: 'p-odette',
    slug: 'odette-ball-gown',
    sku: 'DBF-ODETTE',
    name: { en: 'Odette Ball Gown', sq: 'Fustani Odette Ball Gown' },
    description: {
      en: 'An ivory ball gown with a plunging neckline and a skirt that holds its own architecture.',
      sq: 'Një fustan ivor me dekolte të thellë dhe një fund që ruan arkitekturën e vet.',
    },
    details: {
      en: 'Embroidered bodice. Full skirt. Dry clean only.',
      sq: 'Korset i qëndisur. Fund i plotë. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Ballgown volume. Structured shoulders.',
      sq: 'Volum topaze. Supet të strukturuara.',
    },
    price: 41900,
    salePrice: null,
    categoryId: 'cat-evening',
    collectionId: 'col-evening',
    featured: false,
    newArrival: false,
    archived: false,
    images: [
      { url: '/images/look-17.jpg', alt: { en: 'Odette ball gown', sq: 'Fustani Odette' } },
      { url: '/images/look-16.jpg', alt: { en: 'Odette ball gown, roses', sq: 'Fustani Odette, trëndafila' } },
      { url: '/images/look-11.jpg', alt: { en: 'Odette ball gown, studio', sq: 'Fustani Odette, studio' } },
    ],
    variants: variants('odette', [{ name: 'Ivory', hex: '#F4F0E8' }], { XS: 2, S: 4, M: 4, L: 2, XL: 1 }),
    metaTitle: { en: 'Odette Ball Gown | Dresses by Florinda', sq: 'Fustani Odette | Dresses by Florinda' },
    metaDescription: {
      en: 'Odette — an ivory embroidered ball gown.',
      sq: 'Odette — fustan ivor i qëndisur me siluetë topaze.',
    },
  },
  {
    id: 'p-marina',
    slug: 'marina-beaded-dress',
    sku: 'DBF-MARINA',
    name: { en: 'Marina Beaded Dress', sq: 'Fustani Marina Beaded' },
    description: {
      en: 'A cobalt halter gown with silver crystal geometry — precise, luminous, and made for the evening.',
      sq: 'Një fustan kobalt me halter dhe gjeometri kristali argjendi — i saktë, i ndritshëm, për mbrëmjen.',
    },
    details: {
      en: 'Beaded surface. Halter neckline. Dry clean only.',
      sq: 'Sipërfaqe me rruaza. Jaka halter. Vetëm pastrim kimik.',
    },
    sizeFit: {
      en: 'Fitted through the body. True to size.',
      sq: 'Ngushtë te trupi. Sipas madhësisë.',
    },
    price: 33900,
    salePrice: null,
    categoryId: 'cat-evening',
    collectionId: 'col-season',
    featured: true,
    newArrival: true,
    archived: false,
    images: [
      { url: '/images/look-23.jpg', alt: { en: 'Marina beaded dress', sq: 'Fustani Marina' } },
      { url: '/images/look-20.jpg', alt: { en: 'Marina beaded dress, atelier', sq: 'Fustani Marina, atelie' } },
    ],
    variants: variants('marina', [{ name: 'Cobalt', hex: '#1E3A8A' }], { XS: 3, S: 5, M: 4, L: 2, XL: 1 }),
    metaTitle: { en: 'Marina Beaded Dress | Dresses by Florinda', sq: 'Fustani Marina | Dresses by Florinda' },
    metaDescription: {
      en: 'Marina — a cobalt beaded evening dress.',
      sq: 'Marina — fustan mbrëmjeje kobalt me rruaza.',
    },
  },
]

export const siteContent = {
  about: {
    title: { en: 'The Art of Dressing', sq: 'Arti i Veshjes' },
    intro: {
      en: 'Dresses by Florinda is a women’s fashion house devoted to evening, occasion and bridal silhouettes. Each piece is designed to feel considered — in proportion, in fabric, and in the way it is worn.',
      sq: 'Dresses by Florinda është një shtëpi mode për femra, e përqendruar te siluetat e mbrëmjes, rasteve dhe nuseve. Çdo model mendohet me kujdes — në përmasa, në pëlhurë dhe në mënyrën se si vishet.',
    },
    florinda: {
      en: 'Florinda works from a simple premise: a dress should hold presence without raising its voice. The atelier favours clean lines, quiet luxury and a feminine architecture that can move from a paneled room to an open terrace.',
      sq: 'Florinda niset nga një ide e thjeshtë: një fustan duhet të ketë prani, pa ngritur zërin. Atelieja zgjedh linja të pastra, luks të qetë dhe një arkitekturë femërore që lëviz nga një dhomë me panele te një tarracë e hapur.',
    },
    craft: {
      en: 'Attention sits in the details — the fall of a cape, the weight of a skirt, the exactness of a neckline. We do not claim a mythology of origin. We claim care: fittings, fabric choices, and a standard that can be felt before it is named.',
      sq: 'Vëmendja qëndron te detajet — rënia e një kepe, pesha e një fundi, saktësia e një jake. Nuk pretendojmë një mit origjine. Pretendojmë kujdes: prova, zgjedhje pëlhure dhe një standard që ndihet para se të emërtohet.',
    },
    philosophy: {
      en: 'Elegance, here, is not decoration. It is proportion, restraint and the confidence of a woman who knows how she wishes to be seen.',
      sq: 'Eleganca, këtu, nuk është zbukurim. Është përmasë, përmbajtje dhe siguria e një gruaje që di se si dëshiron të shihet.',
    },
  },
  contact: {
    email: 'hello@dressesbyflorinda.com',
    phone: '+355 69 000 0000',
    instagram: 'https://instagram.com/dressesbyflorinda',
    location: { en: 'Showroom by appointment', sq: 'Showroom me takim' },
  },
  shipping: {
    en: 'Orders are prepared with care and dispatched once payment is confirmed. Delivery times vary by destination. A more precise estimate is shown at checkout. This copy can be updated from the studio dashboard.',
    sq: 'Porositë përgatiten me kujdes dhe nisen pasi pagesa konfirmohet. Koha e dërgesës ndryshon sipas destinacionit. Një vlerësim më i saktë shfaqet në pagesë. Ky tekst mund të përditësohet nga paneli i studios.',
  },
  returns: {
    en: 'Unworn pieces in original condition may be returned within 14 days of delivery, subject to the returns policy. Bridal and made-to-order garments follow a separate process. This copy can be updated from the studio dashboard.',
    sq: 'Modelet e paveshura, në gjendjen origjinale, mund të kthehen brenda 14 ditëve nga dërgesa, sipas politikës së kthimeve. Fustanet e nuses dhe porositë e veçanta ndjekin një proces tjetër. Ky tekst mund të përditësohet nga paneli i studios.',
  },
  privacy: {
    en: 'We collect only what is needed to fulfil orders, manage accounts and improve the store. Personal data is not sold. Cookie preferences can be managed from the consent banner. This is placeholder legal copy and should be reviewed before public launch.',
    sq: 'Mbledhim vetëm të dhënat e nevojshme për porosi, llogari dhe përmirësimin e dyqanit. Të dhënat personale nuk shiten. Preferencat e cookies menaxhohen nga njoftimi i pëlqimit. Ky është tekst ligjor vendmbajtës dhe duhet rishikuar para publikimit.',
  },
  terms: {
    en: 'By placing an order you agree to these terms of sale, including pricing, availability and delivery. Prices are calculated by the studio at checkout and may change. This is placeholder legal copy and should be reviewed before public launch.',
    sq: 'Duke bërë një porosi, pranoni këto kushte shitjeje, përfshirë çmimin, disponueshmërinë dhe dërgesën. Çmimet llogariten nga studioja në pagesë dhe mund të ndryshojnë. Ky është tekst ligjor vendmbajtës dhe duhet rishikuar para publikimit.',
  },
  faqs: [
    {
      q: { en: 'How do I choose a size?', sq: 'Si ta zgjedh madhësinë?' },
      a: {
        en: 'Use the size guide on each product page. If you are between sizes, we generally recommend the larger. For bridal pieces, a fitting is advised.',
        sq: 'Përdorni udhëzuesin e madhësive në çdo faqe produkti. Nëse jeni mes dy madhësive, zakonisht rekomandojmë atë më të madhe. Për fustanet e nuses, këshillohet një provë.',
      },
    },
    {
      q: { en: 'Do you offer fittings?', sq: 'A ofroni prova?' },
      a: {
        en: 'Showroom fittings are available by appointment. Write to us with the piece and your preferred dates.',
        sq: 'Provat në showroom bëhen me takim. Na shkruani për modelin dhe datat e preferuara.',
      },
    },
    {
      q: { en: 'When will card payments be available?', sq: 'Kur do të jenë të gatshme pagesat me kartë?' },
      a: {
        en: 'Card checkout will be connected through a payment provider. Until then, orders can be placed with cash on delivery or bank transfer where offered.',
        sq: 'Pagesa me kartë do të lidhet përmes një ofruesi pagesash. Deri atëherë, porositë mund të bëhen me para në dorëzim ose transfertë bankare, ku ofrohet.',
      },
    },
    {
      q: { en: 'Can I shop as a guest?', sq: 'A mund të blej pa llogari?' },
      a: {
        en: 'Yes. An account is optional. You may check out as a guest and create an account later to follow orders and save a wishlist.',
        sq: 'Po. Llogaria është opsionale. Mund të paguani si vizitore dhe të krijoni llogari më vonë për të ndjekur porositë dhe listën e dëshirave.',
      },
    },
  ],
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug && !p.archived)
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug)
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}
