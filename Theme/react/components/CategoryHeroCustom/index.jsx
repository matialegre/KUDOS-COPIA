import React from 'react'
import styles from './index.css'

const CategoryHeroCustom = ({ 
  mujerImage, 
  mujerLink, 
  hombreImage, 
  hombreLink, 
  ninosImage, 
  ninosLink 
}) => {
  return (
    <div className={styles.heroContainer}>
      <a href={mujerLink || "/mujer"} className={styles.heroLeft}>
        <img 
          src={mujerImage || "/arquivos/imagen_bld.jpg"} 
          alt="Mujer" 
          className={styles.heroImage}
        />
      </a>
      <div className={styles.heroRight}>
        <a href={hombreLink || "/hombre"} className={styles.heroRightTop}>
          <img 
            src={hombreImage || "/arquivos/hombre_chicha.jpg"} 
            alt="Hombre" 
            className={styles.heroImage}
          />
        </a>
        <a href={ninosLink || "/ninos"} className={styles.heroRightBottom}>
          <img 
            src={ninosImage || "/arquivos/nino_chicha.jpg"} 
            alt="Niños" 
            className={styles.heroImage}
          />
        </a>
      </div>
    </div>
  )
}

CategoryHeroCustom.schema = {
  title: 'Category Hero',
  description: 'Hero de categorías (Mujer, Hombre, Niños)',
  type: 'object',
  properties: {
    mujerImage: {
      title: 'Imagen Mujer',
      description: 'Ruta de la imagen para categoría Mujer',
      type: 'string',
      default: '/arquivos/imagen_bld.jpg',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    mujerLink: {
      title: 'Link Mujer',
      description: 'URL de la categoría Mujer',
      type: 'string',
      default: '/mujer'
    },
    hombreImage: {
      title: 'Imagen Hombre',
      description: 'Ruta de la imagen para categoría Hombre',
      type: 'string',
      default: '/arquivos/hombre_chicha.jpg',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    hombreLink: {
      title: 'Link Hombre',
      description: 'URL de la categoría Hombre',
      type: 'string',
      default: '/hombre'
    },
    ninosImage: {
      title: 'Imagen Niños',
      description: 'Ruta de la imagen para categoría Niños',
      type: 'string',
      default: '/arquivos/nino_chicha.jpg',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    ninosLink: {
      title: 'Link Niños',
      description: 'URL de la categoría Niños',
      type: 'string',
      default: '/ninos'
    }
  }
}

export default CategoryHeroCustom
