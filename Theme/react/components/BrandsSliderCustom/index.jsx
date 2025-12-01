import React from 'react'
import styles from './index.css'

const BrandsSliderCustom = ({ title, linkText, linkUrl, brands: customBrands }) => {
  const defaultBrands = [
    { name: 'Salomon', image: '/arquivos/salomon_mundooutdoor.jpg', href: '/marcas/salomon' },
    { name: 'Burton', image: '/arquivos/burton_mundooutdoor.jpg', href: '/marcas/burton' },
    { name: 'Timberland', image: '/arquivos/timberland_mundooutdoor.jpg', href: '/marcas/timberland' },
    { name: 'Roxy', image: '/arquivos/roxy_mundooutdoor.jpg', href: '/marcas/roxy' },
    { name: 'DC', image: '/arquivos/dc_mundooutdoor.jpg', href: '/marcas/dc' },
    { name: 'Montagne', image: '/arquivos/montagne_mundooutdoor.jpg', href: '/marcas/montagne' },
    { name: 'Columbia', image: '/arquivos/columbia_mundooutdoor.jpg', href: '/marcas/columbia' },
    { name: 'Öus', image: '/arquivos/ous_mundooutdoor.jpg', href: '/marcas/ous' },
    { name: 'RVCA', image: '/arquivos/rvca_mundooutdoor.jpg', href: '/marcas/rvca' },
    { name: 'Quiksilver', image: '/arquivos/quiksilver_mundooutdoor.jpg', href: '/marcas/quiksilver' },
    { name: 'Ansilta', image: '/arquivos/ansilta_mundooutdoor.jpg', href: '/marcas/ansilta' },
    { name: 'Ombak', image: '/arquivos/ombak_mundooutdoor.jpg', href: '/marcas/ombak' },
    { name: 'Sorel', image: '/arquivos/sorel_mundooutdoor.jpg', href: '/marcas/sorel' }
  ]

  const brands = customBrands && customBrands.length > 0 ? customBrands : defaultBrands

  return (
    <div className={styles.brandsContainer}>
      <h2 className={styles.brandsTitle}>{title || 'NUESTRAS MARCAS'}</h2>
      <a href={linkUrl || "/marcas"} className={styles.brandsLink}>{linkText || 'Ver todos'} &gt;</a>
      <div className={styles.brandsSlider}>
        <div className={styles.brandsTrack}>
          {brands.map((brand, index) => (
            <a
              key={index}
              className={styles.brandItem}
              href={brand.href}
              aria-label={`Ver productos de ${brand.name}`}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className={styles.brandImage}
              />
            </a>
          ))}
        </div>
      </div>
      <div className={styles.sliderDots}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
    </div>
  )
}

BrandsSliderCustom.schema = {
  title: 'Brands Slider',
  description: 'Slider horizontal de marcas con scroll automático',
  type: 'object',
  properties: {
    title: {
      title: 'Título',
      description: 'Título del slider de marcas',
      type: 'string',
      default: 'NUESTRAS MARCAS'
    },
    linkText: {
      title: 'Texto del Link',
      description: 'Texto del link "Ver todos"',
      type: 'string',
      default: 'Ver todos'
    },
    linkUrl: {
      title: 'URL del Link',
      description: 'URL a donde redirige el link',
      type: 'string',
      default: '/marcas'
    }
  }
}

export default BrandsSliderCustom
