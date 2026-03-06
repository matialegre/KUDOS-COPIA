import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './index.css'

const DISPLAY_INTERVAL = 5000

const BenefitsBar = ({ benefits: customBenefits }) => {
  const defaultBenefits = [
    {
      id: 'pago-blanco',
      image: '/arquivos/pago_blanco_2.png',
      alt: 'Medios de pago - logos en blanco',
      href: '/pagos-y-promociones',
      theme: 'dark',
      backgroundColor: '#0f0f0f'
    }
  ]

  const benefits = customBenefits && customBenefits.length > 0 ? customBenefits : defaultBenefits

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState('left')
  const hasMultiple = benefits.length > 1
  const currentBenefit = benefits[currentIndex]
  const timerRef = useRef(null)
  
  // Color de fondo actual
  const bgColor = currentBenefit?.backgroundColor && currentBenefit.backgroundColor.trim() !== '' 
    ? currentBenefit.backgroundColor 
    : (currentBenefit?.theme === 'light' ? '#f5f5f5' : '#0f0f0f')

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const goToSlide = useCallback((newIndex, direction = 'left') => {
    if (isSliding) return
    setSlideDirection(direction)
    setIsSliding(true)
    
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setIsSliding(false)
    }, 400)
  }, [isSliding])

  const scheduleNext = useCallback(() => {
    if (!hasMultiple) return
    clearTimer()
    timerRef.current = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % benefits.length
      goToSlide(nextIndex, 'left')
    }, DISPLAY_INTERVAL)
  }, [benefits.length, hasMultiple, clearTimer, currentIndex, goToSlide])

  useEffect(() => {
    scheduleNext()
    return clearTimer
  }, [scheduleNext, clearTimer, currentIndex])

  const handlePrev = () => {
    clearTimer()
    const prevIndex = (currentIndex - 1 + benefits.length) % benefits.length
    goToSlide(prevIndex, 'right')
    setTimeout(scheduleNext, 500)
  }

  const handleNext = () => {
    clearTimer()
    const nextIndex = (currentIndex + 1) % benefits.length
    goToSlide(nextIndex, 'left')
    setTimeout(scheduleNext, 500)
  }

  const slideClass = isSliding 
    ? (slideDirection === 'left' ? styles.slideOutLeft : styles.slideOutRight)
    : styles.slideIn

  return (
    <div 
      className={styles.benefitsBarContainer} 
      style={{ backgroundColor: bgColor, transition: 'background-color 0.4s ease' }}
    >
      <div className={styles.benefitsBar}>
        <div className={styles.slideWrapper}>
          <a
            href={currentBenefit.href}
            className={`${styles.benefitLink} ${slideClass}`}
            aria-label={currentBenefit.alt}
          >
            <img
              src={currentBenefit.image}
              alt={currentBenefit.alt}
              className={styles.benefitImage}
            />
          </a>
        </div>
      </div>
    </div>
  )
}

BenefitsBar.schema = {
  title: 'Benefits Bar',
  description: 'Barra de beneficios rotativa con imágenes',
  type: 'object',
  properties: {
    benefits: {
      title: 'Beneficios',
      description: 'Lista de beneficios a mostrar. Hacé clic en cada item para editarlo.',
      type: 'array',
      minItems: 0,
      maxItems: 10,
      items: {
        title: 'Beneficio',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Nombre del beneficio',
            description: 'Nombre para identificar este beneficio en el editor',
            type: 'string',
            default: 'Nuevo beneficio'
          },
          id: {
            title: 'ID',
            type: 'string'
          },
          image: {
            title: 'Imagen',
            description: 'Ruta de la imagen del beneficio',
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
          href: {
            title: 'Link',
            description: 'URL a donde redirige',
            type: 'string'
          },
          theme: {
            title: 'Tema',
            description: 'Tema de fondo (dark o light) - se ignora si hay color personalizado',
            type: 'string',
            enum: ['dark', 'light'],
            enumNames: ['Oscuro', 'Claro'],
            default: 'dark'
          },
          backgroundColor: {
            title: 'Color de Fondo',
            description: 'Color de fondo personalizado (ej: #0f0f0f, #ff5500). Deja vacío para usar el tema.',
            type: 'string',
            default: ''
          }
        }
      }
    }
  }
}

export default BenefitsBar
