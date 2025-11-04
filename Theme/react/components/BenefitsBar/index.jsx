import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './index.css'

const DISPLAY_INTERVAL = 5000
const IMAGE_SWAP_DELAY = 180

const BenefitsBar = ({ benefits: customBenefits }) => {
  const defaultBenefits = [
    {
      id: 'pago-blanco',
      image: '/arquivos/pago_blanco_2.png',
      alt: 'Medios de pago - logos en blanco',
      href: '/institucional/medios-de-pago',
      theme: 'dark'
    }
  ]

  const benefits = customBenefits && customBenefits.length > 0 ? customBenefits : defaultBenefits

  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const hasMultiple = benefits.length > 1
  const themeBenefit = benefits[currentIndex]
  const displayBenefit = benefits[displayIndex]
  const timerRef = useRef(null)
  const imageTimerRef = useRef(null)
  const containerClass = `${styles.benefitsBarContainer} ${
    themeBenefit?.theme === 'light' ? styles.benefitsBarContainerLight : styles.benefitsBarContainerDark
  }`

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleNext = useCallback(() => {
    if (!hasMultiple) {
      return
    }

    clearTimer()
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length)
    }, DISPLAY_INTERVAL)
  }, [benefits.length, hasMultiple, clearTimer])

  useEffect(() => {
    scheduleNext()

    return clearTimer
  }, [scheduleNext, clearTimer, currentIndex])

  useEffect(() => {
    if (!hasMultiple) {
      setDisplayIndex(currentIndex)
      return
    }

    if (displayIndex === currentIndex) {
      return
    }

    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current)
    }

    imageTimerRef.current = setTimeout(() => {
      setDisplayIndex(currentIndex)
      imageTimerRef.current = null
    }, IMAGE_SWAP_DELAY)

    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current)
        imageTimerRef.current = null
      }
    }
  }, [currentIndex, displayIndex, hasMultiple])

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const nextIndex = (prev - 1 + benefits.length) % benefits.length
      return nextIndex
    })
    scheduleNext()
  }

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % benefits.length
      return nextIndex
    })
    scheduleNext()
  }

  return (
    <div className={containerClass}>
      <div className={styles.benefitsBar}>
        {hasMultiple && (
          <button
            onClick={handlePrev}
            className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
            aria-label="Anterior"
          >
            ‹
          </button>
        )}

        <a
          href={displayBenefit.href}
          className={styles.benefitLink}
          aria-label={displayBenefit.alt}
        >
          <img
            src={displayBenefit.image}
            alt={displayBenefit.alt}
            className={styles.benefitImage}
          />
        </a>

        {hasMultiple && (
          <button
            onClick={handleNext}
            className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}
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
      description: 'Lista de beneficios a mostrar',
      type: 'array',
      items: {
        type: 'object',
        properties: {
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
            description: 'Tema de fondo (dark o light)',
            type: 'string',
            enum: ['dark', 'light'],
            default: 'dark'
          }
        }
      },
      default: [
        {
          id: 'pago-blanco',
          image: '/arquivos/pago_blanco_2.png',
          alt: 'Medios de pago - logos en blanco',
          href: '/institucional/medios-de-pago',
          theme: 'dark'
        }
      ]
    }
  }
}

export default BenefitsBar
