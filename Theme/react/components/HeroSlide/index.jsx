import React from 'react'
import styles from './index.css'

const HeroSlide = ({
  mode = 'image',
  desktopImage,
  mobileImage,
  videoUrl,
  link,
  alt,
}) => {
  const isVideo = mode === 'video' && videoUrl

  const content = isVideo ? (
    <video
      className={styles.heroSlideVideo}
      src={videoUrl}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : (
    <>
      {desktopImage && (
        <img
          src={desktopImage}
          alt={alt || ''}
          className={`${styles.heroSlideImage} ${styles.heroSlideImageDesktop}`}
        />
      )}
      {mobileImage && (
        <img
          src={mobileImage}
          alt={alt || ''}
          className={`${styles.heroSlideImage} ${styles.heroSlideImageMobile}`}
        />
      )}
    </>
  )

  if (link) {
    return (
      <a href={link} className={styles.heroSlideLink}>
        {content}
      </a>
    )
  }

  return <div className={styles.heroSlide}>{content}</div>
}

HeroSlide.schema = {
  title: 'Slide principal (imagen o video)',
  description: 'Slide del banner principal que puede ser imagen o video',
  type: 'object',
  properties: {
    mode: {
      title: 'Tipo de contenido',
      description: 'Elegí si este slide muestra una imagen o un video',
      type: 'string',
      enum: ['image', 'video'],
      enumNames: ['Imagen', 'Video'],
      default: 'image',
    },
    desktopImage: {
      title: 'Imagen desktop',
      description: 'Imagen para desktop (1920x614 aprox.)',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    mobileImage: {
      title: 'Imagen mobile',
      description: 'Imagen para mobile (750x458 aprox.)',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    videoUrl: {
      title: 'URL del video (.mp4)',
      description: 'URL completa del video (por ejemplo de Cloudinary)',
      type: 'string',
    },
    link: {
      title: 'Link al hacer clic',
      description: 'URL a donde redirige el slide (opcional)',
      type: 'string',
    },
    alt: {
      title: 'Texto alternativo',
      description: 'Texto alternativo para accesibilidad (solo imágenes)',
      type: 'string',
    },
  },
}

export default HeroSlide
