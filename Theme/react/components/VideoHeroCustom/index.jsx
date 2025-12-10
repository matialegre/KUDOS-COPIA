import React, { useRef, useEffect, useState } from 'react'
import { defineMessages } from 'react-intl'
import styles from './index.css'

const VideoHeroCustom = ({ 
  videoUrl, 
  leftImage,
  inputPlaceholder,
  buttonText
}) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setMessage('Por favor ingresá un email válido')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      // Aquí se integraría con el sistema de newsletter de VTEX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('¡Gracias por suscribirte!')
      setEmail('')
    } catch (error) {
      setMessage('Hubo un error. Intentá de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div className={styles.videoHeroContainer} ref={containerRef}>
      <div className={styles.videoHeroContent}>
        {/* Columna izquierda - Imagen con formulario */}
        <div className={styles.imageColumn}>
          <img 
            src={leftImage || "https://mundooutdoorar.vteximg.com.br/arquivos/suscribitenegro.jpg"} 
            alt="Suscribite" 
            className={styles.leftImage}
          />
          
          {/* Formulario overlay */}
          <div className={styles.formOverlay}>
            <form onSubmit={handleSubmit} className={styles.newsletterForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={inputPlaceholder || "tu@email.com"}
                className={styles.emailInput}
                disabled={isSubmitting}
                required
              />
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ENVIANDO...' : (buttonText || 'SUSCRIBITE')}
              </button>
              
              {message && (
                <p className={styles.formMessage}>{message}</p>
              )}
            </form>
          </div>
        </div>

        {/* Columna derecha - Video */}
        <div className={styles.videoColumn}>
          <iframe
            className={styles.videoElement}
            src={
              videoUrl ||
              "https://customer-4z2czbvhbm9jeqnh.cloudflarestream.com/b6e4ca859e6972af5d17163c9b6931d4/iframe?preload=true&loop=true&autoplay=true&muted=true&controls=false&letterboxColor=transparent&poster=https%3A%2F%2Fcustomer-4z2czbvhbm9jeqnh.cloudflarestream.com%2Fb6e4ca859e6972af5d17163c9b6931d4%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
            }
            loading="lazy"
            style={{ border: 'none' }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      </div>
    </div>
  )
}

VideoHeroCustom.schema = {
  title: 'Video Hero con Newsletter',
  description: 'Hero con imagen y formulario a la izquierda, video a la derecha',
  type: 'object',
  properties: {
    leftImage: {
      title: 'Imagen Izquierda',
      description: 'Imagen para el lado izquierdo (530px de ancho)',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader'
      },
      default: 'https://mundooutdoorar.vteximg.com.br/arquivos/suscribitenegro.jpg'
    },
    videoUrl: {
      title: 'URL iframe video (escritorio y celular)',
      description:
        'Pegá aquí la URL completa del iframe de Cloudflare (valor de src). Se usa el mismo video para escritorio y celular.',
      type: 'string',
      default:
        'https://customer-4z2czbvhbm9jeqnh.cloudflarestream.com/b6e4ca859e6972af5d17163c9b6931d4/iframe?preload=true&loop=true&autoplay=true&muted=true&controls=false&letterboxColor=transparent&poster=https%3A%2F%2Fcustomer-4z2czbvhbm9jeqnh.cloudflarestream.com%2Fb6e4ca859e6972af5d17163c9b6931d4%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600'
    },
    inputPlaceholder: {
      title: 'Placeholder del Input',
      description: 'Texto placeholder del campo de email',
      type: 'string',
      default: 'tu@email.com'
    },
    buttonText: {
      title: 'Texto del Botón',
      description: 'Texto del botón de suscripción',
      type: 'string',
      default: 'SUSCRIBITE'
    }
  }
}

export default VideoHeroCustom
