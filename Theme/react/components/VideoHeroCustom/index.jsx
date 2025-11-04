import React, { useRef, useEffect, useState } from 'react'
import { defineMessages } from 'react-intl'
import styles from './index.css'

const VideoHeroCustom = ({ 
  videoUrl, 
  leftImage,
  logoImage,
  title,
  subtitle,
  inputPlaceholder,
  buttonText
}) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

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
      // Por ahora simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('¡Gracias por suscribirte!')
      setEmail('')
    } catch (error) {
      setMessage('Hubo un error. Intentá de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.videoHeroContainer} ref={containerRef}>
      <div className={styles.videoHeroContent}>
        {/* Columna izquierda - Newsletter */}
        <div className={styles.newsletterColumn}>
          <div className={styles.newsletterContent}>
            {logoImage && (
              <img 
                src={logoImage} 
                alt="Logo" 
                className={styles.newsletterLogo}
              />
            )}
            
            <h2 className={styles.newsletterTitle}>
              {title || "Entérate de todas las novedades y ofertas"}
            </h2>
            
            <form onSubmit={handleSubmit} className={styles.newsletterForm}>
              <label htmlFor="newsletter-email" className={styles.newsletterLabel}>
                {subtitle || "Ingresa tu e-mail"}
              </label>
              
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={inputPlaceholder || "tu@email.com"}
                className={styles.newsletterInput}
                disabled={isSubmitting}
                required
              />
              
              <button 
                type="submit" 
                className={styles.newsletterButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ENVIANDO...' : (buttonText || 'SUSCRIBITE')}
              </button>
              
              {message && (
                <p className={styles.newsletterMessage}>{message}</p>
              )}
            </form>
          </div>
        </div>

        {/* Columna derecha - Video */}
        <div className={styles.videoColumn}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            src={videoUrl || "https://res.cloudinary.com/dqeivjlr9/video/upload/v1762285025/video_para_parte_final_5_zassmm.mp4"}
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </div>
  )
}

VideoHeroCustom.schema = {
  title: 'Video Hero con Newsletter',
  description: 'Hero con formulario de newsletter a la izquierda y video a la derecha',
  type: 'object',
  properties: {
    videoUrl: {
      title: 'URL del Video',
      description: 'URL completa del video (962px de ancho)',
      type: 'string',
      default: 'https://res.cloudinary.com/dqeivjlr9/video/upload/v1762285025/video_para_parte_final_5_zassmm.mp4'
    },
    logoImage: {
      title: 'Logo',
      description: 'URL del logo (opcional)',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    title: {
      title: 'Título',
      description: 'Título principal del newsletter',
      type: 'string',
      default: 'Entérate de todas las novedades y ofertas'
    },
    subtitle: {
      title: 'Subtítulo',
      description: 'Texto sobre el input de email',
      type: 'string',
      default: 'Ingresa tu e-mail'
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
