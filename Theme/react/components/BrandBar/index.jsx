import React from 'react'
import styles from './index.css'

const BrandBar = ({ brands: customBrands }) => {
  const defaultBrands = [
    { name: 'DC', logo: '/arquivos/banner-menu-dc.png', href: '/marcas/dc' },
    { name: 'Roxy', logo: '/arquivos/banner-menu-roxy.png', href: '/marcas/roxy' },
    { name: 'Columbia', logo: '/arquivos/banner-menu-columbia.png', href: '/marcas/columbia' },
    { name: 'Quiksilver', logo: '/arquivos/banner-menu-quiksilver.png', href: '/marcas/quiksilver' },
    { name: 'Montagne', logo: '/arquivos/banner-menu-montagne.png', href: '/marcas/montagne' },
    { name: 'Ombak', logo: '/arquivos/banner-menu-obka.png', href: '/marcas/ombak' },
    { name: 'Salomon', logo: '/arquivos/banner-menu-salomon.png', href: '/marcas/salomon' },
    { name: 'RVCA', logo: '/arquivos/banner-menu-rvca.png', href: '/marcas/rvca' },
    { name: 'Burton', logo: '/arquivos/banner-menu-burton.png', href: '/marcas/burton' },
    { name: 'Waterdog', logo: '/arquivos/logo-waterdog-49-49-49 (1).png', href: '/marcas/waterdog' },
    { name: 'Ansilta', logo: '/arquivos/banner-menu-ansilta.png', href: '/marcas/ansilta' },
    { name: 'National Geographic', logo: 'https://mundooutdoorar.vtexassets.com/arquivos/nationalimagenicono.png', href: '/marcas/national-geographic' },
    { name: 'Weis', logo: '/arquivos/logo_weis.png', href: '/marcas/weis' }
  ]

  const brands = customBrands && customBrands.length > 0 ? customBrands : defaultBrands

  return (
    <div className={styles.brandBarContainer}>
      <div className={styles.brandBar}>
        {brands.map((brand, idx) => (
          <a
            key={idx}
            href={brand.href}
            className={styles.brandLink}
            aria-label={`Ver productos de ${brand.name}`}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className={styles.brandLogo}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

BrandBar.schema = {
  title: 'Brand Bar',
  description: 'Barra horizontal de logos de marcas',
  type: 'object',
  properties: {
    brands: {
      title: 'Marcas',
      description: 'Lista de marcas a mostrar',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            title: 'Nombre',
            type: 'string'
          },
          logo: {
            title: 'Logo',
            description: 'URL del logo de la marca',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          },
          href: {
            title: 'Link',
            description: 'URL de la marca',
            type: 'string'
          }
        }
      }
    }
  }
}

export default BrandBar
