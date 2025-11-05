import React from 'react'

const BenefitCardImage = ({ 
  srcDesktop,
  srcMobile,
  alt,
  link
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

  const imageSrc = isMobile && srcMobile ? srcMobile : srcDesktop

  if (link) {
    return (
      <a href={link} style={{ display: 'block', width: '100%', height: 'auto' }}>
        <img 
          src={imageSrc}
          alt={alt || 'Beneficio'}
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            borderRadius: '16px',
            objectFit: 'contain'
          }}
        />
      </a>
    )
  }

  return (
    <img 
      src={imageSrc}
      alt={alt || 'Beneficio'}
      style={{ 
        width: '100%', 
        height: 'auto', 
        display: 'block',
        borderRadius: '16px',
        objectFit: 'contain'
      }}
    />
  )
}

BenefitCardImage.schema = {
  title: 'Benefit Card Image',
  description: 'Imagen de tarjeta de beneficio con versión desktop y mobile',
  type: 'object',
  properties: {
    srcDesktop: {
      title: 'Imagen Desktop',
      description: 'URL de la imagen para desktop',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    srcMobile: {
      title: 'Imagen Mobile',
      description: 'URL de la imagen para mobile (117x49)',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    alt: {
      title: 'Texto Alternativo',
      description: 'Descripción de la imagen',
      type: 'string'
    },
    link: {
      title: 'Link',
      description: 'URL de destino al hacer clic',
      type: 'string'
    }
  }
}

export default BenefitCardImage
