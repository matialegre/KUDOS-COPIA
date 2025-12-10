import React, { useEffect, useState } from 'react'
import styles from './index.css'

const BrandsSliderCustom = ({ title, linkText, linkUrl, brands: customBrands }) => {
  const defaultBrands = [
    { name: 'National Geographic', image: 'https://mundooutdoorar.vtexassets.com/arquivos/nationalimagenicono.png', href: '/marcas/national-geographic' },
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

  const brandsPerPage = 7
  const totalPages = Math.max(1, Math.ceil(brands.length / brandsPerPage))
  const [{ position, direction }, setMotion] = useState({ position: 0, direction: 1 })

  useEffect(() => {
    if (totalPages <= 1) return undefined

    const interval = setInterval(() => {
      setMotion((prev) => {
        const speed = 0.01
        let nextPosition = prev.position + prev.direction * speed
        let nextDirection = prev.direction

        if (nextPosition >= totalPages - 1) {
          nextPosition = totalPages - 1
          nextDirection = -1
        } else if (nextPosition <= 0) {
          nextPosition = 0
          nextDirection = 1
        }

        return {
          position: nextPosition,
          direction: nextDirection,
        }
      })
    }, 120)

    return () => clearInterval(interval)
  }, [totalPages])

  const currentPage = Math.round(position)

  const pages = []
  for (let i = 0; i < totalPages; i += 1) {
    pages.push(brands.slice(i * brandsPerPage, (i + 1) * brandsPerPage))
  }

  return (
    <div className={styles.brandsContainer}>
      <h2 className={styles.brandsTitle}>{title || 'NUESTRAS MARCAS'}</h2>
      <a href={linkUrl || "/marcas"} className={styles.brandsLink}>{linkText || 'Ver todos'} &gt;</a>
      <div className={styles.brandsSlider}>
        <div
          className={styles.brandsTrack}
          style={{ transform: `translateX(-${position * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className={styles.brandsPage}>
              {page.map((brand, index) => (
                <a
                  key={`${brand.name}-${index}`}
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
          ))}
        </div>
      </div>
      <div className={styles.sliderDots}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentPage ? styles.dotActive : ''}`}
            onClick={() => setMotion((prev) => ({ ...prev, position: index }))}
          />
        ))}
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
