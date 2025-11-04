import React from 'react'
import styles from './index.css'

const BrandsSliderCustom = () => {
  const brands = [
    { name: 'Salomon', image: '/arquivos/salomon_mundooutdoor.jpg' },
    { name: 'Burton', image: '/arquivos/burton_mundooutdoor.jpg' },
    { name: 'Timberland', image: '/arquivos/timberland_mundooutdoor.jpg' },
    { name: 'Roxy', image: '/arquivos/roxy_mundooutdoor.jpg' },
    { name: 'DC', image: '/arquivos/dc_mundooutdoor.jpg' },
    { name: 'Volcom', image: '/arquivos/volcom_mundooutdoor.jpg' },
    { name: 'Montagne', image: '/arquivos/montagne_mundooutdoor.jpg' },
    { name: 'Columbia', image: '/arquivos/columbia_mundooutdoor.jpg' },
    { name: 'Ous', image: '/arquivos/ous_mundooutdoor.jpg' },
    { name: 'RVCA', image: '/arquivos/rvca_mundooutdoor.jpg' },
    { name: 'Quiksilver', image: '/arquivos/quiksilver_mundooutdoor.jpg' },
    { name: 'Ansilta', image: '/arquivos/ansilta_mundooutdoor.jpg' },
    { name: 'Ombak', image: '/arquivos/ombak_mundooutdoor.jpg' },
    { name: 'Sorel', image: '/arquivos/sorel_mundooutdoor.jpg' }
  ]

  return (
    <div className={styles.brandsContainer}>
      <h2 className={styles.brandsTitle}>NUESTRAS MARCAS</h2>
      <a href="/marcas" className={styles.brandsLink}>Ver todos &gt;</a>
      <div className={styles.brandsSlider}>
        <div className={styles.brandsTrack}>
          {brands.map((brand, index) => (
            <div key={index} className={styles.brandItem}>
              <img 
                src={brand.image} 
                alt={brand.name}
                className={styles.brandImage}
              />
            </div>
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
