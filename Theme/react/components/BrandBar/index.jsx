import React from 'react'
import styles from './index.css'

const BrandBar = () => {
  const brands = [
    { name: 'DC', logo: '/arquivos/banner-menu-dc.png', href: '/marcas/dc' },
    { name: 'Roxy', logo: '/arquivos/banner-menu-roxy.png', href: '/marcas/roxy' },
    { name: 'Columbia', logo: '/arquivos/banner-menu-columbia.png', href: '/marcas/columbia' },
    { name: 'Quiksilver', logo: '/arquivos/banner-menu-quiksilver.png', href: '/marcas/quiksilver' },
    { name: 'Montagne', logo: '/arquivos/banner-menu-montagne.png', href: '/marcas/montagne' },
    { name: 'OBKA', logo: '/arquivos/banner-menu-obka.png', href: '/marcas/obka' },
    { name: 'Salomon', logo: '/arquivos/banner-menu-salomon.png', href: '/marcas/salomon' },
    { name: 'RVCA', logo: '/arquivos/banner-menu-rvca.png', href: '/marcas/rvca' },
    { name: 'Burton', logo: '/arquivos/banner-menu-burton.png', href: '/marcas/burton' },
    { name: 'Sorel', logo: '/arquivos/banner-menu-sorel.png', href: '/marcas/sorel' },
    { name: 'Ansilta', logo: '/arquivos/banner-menu-ansilta.png', href: '/marcas/ansilta' }
  ]

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

export default BrandBar
