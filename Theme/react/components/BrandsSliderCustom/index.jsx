import React from 'react'
import styles from './index.css'

const BrandsSliderCustom = () => {
  const brands = [
    { name: 'Salomon', image: '/arquivos/salomon_mundooutdoor.jpg', href: '/marcas/salomon' },
    { name: 'Burton', image: '/arquivos/burton_mundooutdoor.jpg', href: '/marcas/burton' },
    { name: 'Timberland', image: '/arquivos/timberland_mundooutdoor.jpg', href: '/marcas/timberland' },
    { name: 'Roxy', image: '/arquivos/roxy_mundooutdoor.jpg', href: '/marcas/roxy' },
    { name: 'DC', image: '/arquivos/dc_mundooutdoor.jpg', href: '/marcas/dc' },
    { name: 'Volcom', image: '/arquivos/volcom_mundooutdoor.jpg', href: '/marcas/volcom' },
    { name: 'Montagne', image: '/arquivos/montagne_mundooutdoor.jpg', href: '/marcas/montagne' },
    { name: 'Columbia', image: '/arquivos/columbia_mundooutdoor.jpg', href: '/marcas/columbia' },
    { name: 'Öus', image: '/arquivos/ous_mundooutdoor.jpg', href: '/marcas/ous' },
    { name: 'RVCA', image: '/arquivos/rvca_mundooutdoor.jpg', href: '/marcas/rvca' },
    { name: 'Quiksilver', image: '/arquivos/quiksilver_mundooutdoor.jpg', href: '/marcas/quiksilver' },
    { name: 'Ansilta', image: '/arquivos/ansilta_mundooutdoor.jpg', href: '/marcas/ansilta' },
    { name: 'Ombak', image: '/arquivos/ombak_mundooutdoor.jpg', href: '/marcas/ombak' },
    { name: 'Sorel', image: '/arquivos/sorel_mundooutdoor.jpg', href: '/marcas/sorel' }
  ]

  return (
    <div className={styles.brandsContainer}>
      <h2 className={styles.brandsTitle}>NUESTRAS MARCAS</h2>
      <a href="/marcas" className={styles.brandsLink}>Ver todos &gt;</a>
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

export default BrandsSliderCustom
