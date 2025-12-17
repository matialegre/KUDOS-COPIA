import React, { useRef, useEffect, useState } from 'react'
import { defineMessages } from 'react-intl'
import styles from './index.css'

const VIDEO_DURATION_MS = 60000

const VideoHeroCustom = ({ 
  videoUrl, 
  leftImage,
  inputPlaceholder,
  buttonText,
  videoDuration = VIDEO_DURATION_MS
}) => {
  const containerRef = useRef(null)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [showVideo, setShowVideo] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const timerRef = useRef(null)

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

  const sanitizeIframeUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl
    try {
      const url = new URL(rawUrl)
      url.searchParams.set('loop', 'false')
      url.searchParams.set('autoplay', 'true')
      url.searchParams.set('muted', 'true')
      return url.toString()
    } catch (e) {
      return rawUrl
    }
  }

  const getIframePosterUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return null
    try {
      const url = new URL(rawUrl)
      const poster = url.searchParams.get('poster')
      if (!poster) return null
      try {
        return decodeURIComponent(poster)
      } catch (e) {
        return poster
      }
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videoEnded) {
            setShowVideo(true)
            if (!timerRef.current) {
              timerRef.current = setTimeout(() => {
                setVideoEnded(true)
                setShowVideo(false)
              }, videoDuration)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [videoEnded, videoDuration])

  const showIframe = showVideo && !videoEnded

  const effectiveVideoUrl =
    videoUrl ||
    "https://customer-4z2czbvhbm9jeqnh.cloudflarestream.com/b6e4ca859e6972af5d17163c9b6931d4/iframe?preload=true&loop=true&autoplay=true&muted=true&controls=false&letterboxColor=transparent&poster=https%3A%2F%2Fcustomer-4z2czbvhbm9jeqnh.cloudflarestream.com%2Fb6e4ca859e6972af5d17163c9b6931d4%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"

  const sanitizedVideoUrl = sanitizeIframeUrl(effectiveVideoUrl)
  const posterUrl = getIframePosterUrl(effectiveVideoUrl)

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
          {showIframe ? (
            <iframe
              className={styles.videoElement}
              src={sanitizedVideoUrl}
              loading="lazy"
              style={{ border: 'none' }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            />
          ) : (
            posterUrl ? (
              <img
                src={posterUrl}
                alt=""
                className={styles.videoElement}
              />
            ) : null
          )}
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
