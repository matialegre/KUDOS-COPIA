const IMAGE_BASE_URL = 'https://mundooutdoorar.vtexassets.com/arquivos'

const BRAND_ALIASES = {
  DC: 'dc',
  'DC SHOES': 'dc',
  ROXY: 'roxy',
  MONTAGNE: 'montagne',
  SALOMON: 'salomon',
  'HI TEC': 'hi-tec',
  'HI-TEC': 'hi-tec',
  HITECH: 'hi-tec',
  TIMBERLAND: 'timberland',
  ANSILTA: 'ansilta',
  MAKALU: 'makalu',
  WEISS: 'weiss',
  TREVO: 'trevo',
  OMBAK: 'ombak',
  COLUMBIA: 'columbia',
}

const IMAGE_MAP = {
  'ansilta|hombre|indumentaria': 'guia-ansilta-hombre-indumentaria.jpg',
  'ansilta|mujer|indumentaria': 'guia-ansilta-mujer-indumentaria.jpg',

  'dc|hombre|calzado': 'guia-dc-hombre-calzado.jpg',
  'dc|mujer|calzado': 'guia-dc-mujer-calzado.jpg',
  'dc|nino|calzado': 'guia-dc-nino-calzado.jpg',
  'dc|nino|indumentaria': 'guia-dc-nino-indumentaria.jpg',
  'dc|hombre|indumentaria-inferior': 'guia-dc-hombre-indumentaria-inferior.jpg',
  'dc|mujer|indumentaria-inferior': 'guia-dc-mujer-indumentaria-inferior.jpg',
  'dc|mujer|snow': 'guia-dc-mujer-snow.jpg',
  'dc|hombre|snow': 'guia-generic-hombre-snow.jpg',
  'dc|hombre|tejido-de-punto-superior': 'guia-dc-hombre-tejido-de-punto-superior.jpg',
  'dc|mujer|tejido-de-punto-superior': 'guia-dc-mujer-tejido-de-punto-superior.jpg',

  'hi-tec|hombre|calzado': 'guia-hi-tec-hombre-calzado.jpg',
  'hi-tec|mujer|calzado': 'guia-hi-tec-mujer-calzado.jpg',
  'hi-tec|unisex|calzado-44': 'guia-hi-tec-unisex-calzado-44.jpg',

  'makalu|unisex|indumentaria': 'guia-makalu-unisex-indumentaria.jpg',
  'makalu|unisex|indumentaria-2': 'guia-makalu-unisex-indumentaria-2.jpg',

  'montagne|hombre|indumentaria': 'guia-montagne-hombre-indumentaria.jpg',
  'montagne|hombre|running': 'guia-montagne-hombre-running.jpg',
  'montagne|mujer|indumentaria': 'guia-montagne-mujer-indumentaria.jpg',
  'montagne|mujer|trekking': 'guia-montagne-mujer-trekking.jpg',
  'montagne|mujer|guantes': 'guia-montagne-mujer-guantes.jpg',
  'montagne|nino|calzado': 'guia-montagne-nino-calzado.jpg',
  'montagne|ninos|indumentaria': 'guia-montagne-ninos-indumentaria.jpg',

  'ombak|unisex|guantes-ayampe': 'guia-ombak-unisex-guantes-ayampe.jpg',
  'ombak|unisex|guantes-chicama': 'guia-ombak-unisex-guantes-chicama.jpg',
  'ombak|unisex|guantes-silveira': 'guia-ombak-unisex-guantes-silveira.jpg',
  'ombak|unisex|guantes-tahiti': 'guia-ombak-unisex-guantes-tahiti.jpg',

  'roxy|mujer|indumentaria-superior': 'guia-roxy-mujer-indumentaria-superior.jpg',
  'roxy|mujer|indumentaria-inferior': 'guia-roxy-mujer-indumentaria-inferior.jpg',

  'salomon|hombre|camperas': 'guia-salomon-hombre-camperas.jpg',
  'salomon|hombre|polar': 'guia-salomon-hombre-polar.jpg',
  'salomon|mujer|calzado': 'guia-salomon-mujer-calzado.jpg',
  'salomon|mujer|camperas': 'guia-salomon-mujer-camperas.jpg',
  'salomon|mujer|indumentaria': 'guia-salomon-mujer-indumentaria.jpg',

  'timberland|mujer|calzado': 'guia-timberland-mujer-calzado.jpg',
  'timberland|unisex|calzado': 'guia-timberland-unisex-calzado.jpg',

  'trevo|unisex|buzos': 'guia-trevo-unisex-buzos.jpg',

  'weiss|unisex|chalecos': 'guia-weiss-unisex-chalecos.jpg',
}

const normalizeBrand = (brand) => {
  if (!brand) return null
  const key = brand.trim().toUpperCase()
  if (BRAND_ALIASES[key]) return BRAND_ALIASES[key]
  return brand.trim().toLowerCase().replace(/\s+/g, '-')
}

const hasCategoryMatch = (categories, text) => {
  if (!Array.isArray(categories)) return false
  const lowered = text.toLowerCase()
  return categories.some((path) =>
    typeof path === 'string' && path.toLowerCase().includes(lowered)
  )
}

const normalizeType = (brand, type, categories, productName) => {
  const brandKey = normalizeBrand(brand)
  const t = (type || '').toLowerCase()
  const name = (productName || '').toLowerCase()

  if (!brandKey && !t && !categories?.length) return null

  if (brandKey === 'trevo') return 'buzos'
  if (brandKey === 'weiss') return 'chalecos'
  if (brandKey === 'makalu') return 'indumentaria'
  if (brandKey === 'ansilta') return 'indumentaria'

  if (hasCategoryMatch(categories, 'snow') || hasCategoryMatch(categories, 'ski y snowboard') || t.includes('snow')) {
    return 'snow'
  }

  if (
    t.includes('calzado') ||
    t.includes('zapatilla') ||
    t.includes('zapatillas') ||
    t.includes('bota') ||
    t.includes('botas') ||
    t.includes('sandalia') ||
    t.includes('sandalias') ||
    t.includes('ojotas') ||
    t.includes('ojota')
  ) {
    return 'calzado'
  }

  if (hasCategoryMatch(categories, 'trekking') || t.includes('trekking')) {
    return 'trekking'
  }

  if (hasCategoryMatch(categories, 'running') || t.includes('running')) {
    return 'running'
  }

  if (t.includes('guante')) {
    if (brandKey === 'ombak') {
      if (name.includes('ayampe')) return 'guantes-ayampe'
      if (name.includes('chicama')) return 'guantes-chicama'
      if (name.includes('silveira')) return 'guantes-silveira'
      if (name.includes('tahiti')) return 'guantes-tahiti'
    }

    return 'guantes'
  }

  if (t.includes('chaleco')) {
    return 'chalecos'
  }

  if (t.includes('polar')) {
    if (brandKey === 'salomon' && hasCategoryMatch(categories, 'hombre')) {
      return 'polar'
    }

    return 'indumentaria'
  }

  if (t.includes('campera') || t.includes('camperas') || t.includes('abrigos')) {
    return 'camperas'
  }

  if (t.includes('buzo') || t.includes('buzos') || t.includes('sudadera')) {
    if (brandKey === 'trevo') return 'buzos'

    return 'indumentaria'
  }

  if (hasCategoryMatch(categories, 'pantalones') || hasCategoryMatch(categories, 'jeans') || hasCategoryMatch(categories, 'shorts') || hasCategoryMatch(categories, 'bermudas')) {
    if (brandKey === 'roxy' || brandKey === 'dc') {
      return 'indumentaria-inferior'
    }

    return 'indumentaria'
  }

  if (
    hasCategoryMatch(categories, 'remeras') ||
    hasCategoryMatch(categories, 'camisas') ||
    hasCategoryMatch(categories, 'chombas') ||
    hasCategoryMatch(categories, 'musculosas') ||
    hasCategoryMatch(categories, 'rompevientos') ||
    hasCategoryMatch(categories, 'interiores térmicos')
  ) {
    if (brandKey === 'roxy' || brandKey === 'dc') {
      return 'indumentaria-superior'
    }

    return 'indumentaria'
  }

  if (hasCategoryMatch(categories, 'indumentaria') || t) {
    return 'indumentaria'
  }

  return null
}

const normalizeGender = (gender, normalizedType) => {
  if (!gender) return null

  const g = gender.toLowerCase()

  if (g.startsWith('hombre')) return 'hombre'
  if (g.startsWith('mujer')) return 'mujer'

  if (g.startsWith('ni')) {
    if (normalizedType === 'calzado') return 'nino'

    return 'ninos'
  }

  if (g.startsWith('unisex')) return 'unisex'

  return 'unisex'
}

export const getGuideImageUrl = ({ brand, gender, type, categories = [], productName = '' }) => {
  const normalizedBrand = normalizeBrand(brand)
  const normalizedType = normalizeType(brand, type, categories, productName)
  const normalizedGender = normalizeGender(gender, normalizedType)

  if (!normalizedBrand || !normalizedGender || !normalizedType) {
    return null
  }

  const key = `${normalizedBrand}|${normalizedGender}|${normalizedType}`
  const fileName = IMAGE_MAP[key]

  if (!fileName) {
    return null
  }

  return `${IMAGE_BASE_URL}/${fileName}`
}
