import React from 'react'
import styles from './index.css'

const CategoryHeroCustom = () => {
  return (
    <div className={styles.heroContainer}>
      <a href="/mujer" className={styles.heroLeft}>
        <img 
          src="/arquivos/imagen_bld.jpg" 
          alt="Mujer" 
          className={styles.heroImage}
        />
      </a>
      <div className={styles.heroRight}>
        <a href="/hombre" className={styles.heroRightTop}>
          <img 
            src="/arquivos/hombre_chicha.jpg" 
            alt="Hombre" 
            className={styles.heroImage}
          />
        </a>
        <a href="/ninos" className={styles.heroRightBottom}>
          <img 
            src="/arquivos/nino_chicha.jpg" 
            alt="Niños" 
            className={styles.heroImage}
          />
        </a>
      </div>
    </div>
  )
}

export default CategoryHeroCustom
