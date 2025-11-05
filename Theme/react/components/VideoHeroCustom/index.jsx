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
      title: 'URL del Video',
      description: 'URL completa del video (962px de ancho)',
      type: 'string',
      default: 'https://res.cloudinary.com/dqeivjlr9/video/upload/v1762285025/video_para_parte_final_5_zassmm.mp4'
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
