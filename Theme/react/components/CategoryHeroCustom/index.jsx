import React from 'react'
import styles from './index.css'

const CategoryHeroCustom = ({ 
  mujerImage, 
  mujerLink, 
  hombreImage, 
  hombreLink, 
  ninosImage, 
  ninosLink,
  mujerImageMobile,
  hombreImageMobile,
  ninosImageMobile
}) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return (
    <div className={styles.heroContainer}>
      <a href={mujerLink || "/mujer"} className={styles.heroLeft}>
        <img 
          src={isMobile && mujerImageMobile ? mujerImageMobile : (mujerImage || "/arquivos/mujer_reducida2.jpg")} 
          alt="Mujer" 
          className={styles.heroImage}
        />
      </a>
      <div className={styles.heroRight}>
        <a href={hombreLink || "/hombre"} className={styles.heroRightTop}>
          <img 
            src={isMobile && hombreImageMobile ? hombreImageMobile : (hombreImage || "/arquivos/hombre_chicha.jpg")} 
            alt="Hombre" 
            className={styles.heroImage}
          />
        </a>
        <a href={ninosLink || "/ninos"} className={styles.heroRightBottom}>
          <img 
            src={isMobile && ninosImageMobile ? ninosImageMobile : (ninosImage || "/arquivos/nino_chicha.jpg")} 
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
    },
    mujerImageMobile: {
      title: 'Imagen Mujer Mobile',
      description: 'Ruta de la imagen para categoría Mujer en mobile (705x350)',
      type: 'string',
      default: '/arquivos/mujerseccionmobil.jpg',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    hombreImageMobile: {
      title: 'Imagen Hombre Mobile',
      description: 'Ruta de la imagen para categoría Hombre en mobile (350x350)',
      type: 'string',
      default: '/arquivos/seccionhombremobil.jpg',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    ninosImageMobile: {
      title: 'Imagen Niños Mobile',
      description: 'Ruta de la imagen para categoría Niños en mobile (350x350)',
      type: 'string',
      default: '/arquivos/seccionninomobil.jpg',
      widget: {
        'ui:widget': 'image-uploader'
      }
    }
  }
}

export default CategoryHeroCustom
