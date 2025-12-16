import React, { useState, useEffect, useRef } from 'react'
import styles from './index.css'

const DISPLAY_INTERVAL = 4000

const BenefitsBar = ({ benefits: customBenefits, backgroundColor }) => {
  const defaultBenefits = [
    {
      id: 'pago-blanco',
      image: '/arquivos/pago_blanco_2.png',
      alt: 'Medios de pago - logos en blanco',
      href: '/pagos-y-promociones',
      theme: 'dark'
    }
  ]

  const benefits = customBenefits && customBenefits.length > 0 ? customBenefits : defaultBenefits
  const hasMultiple = benefits.length > 1

  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const currentIndexRef = useRef(0)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const themeBenefit = benefits[currentIndex]
  const useCustomBg = backgroundColor && backgroundColor.trim() !== ''
  const containerClass = `${styles.benefitsBarContainer} ${
    useCustomBg ? '' : (themeBenefit?.theme === 'light' ? styles.benefitsBarContainerLight : styles.benefitsBarContainerDark)
  }`
  const containerStyle = useCustomBg ? { backgroundColor } : {}

  useEffect(() => {
    if (!hasMultiple) return

    currentIndexRef.current = 0
    setCurrentIndex(0)
    setNextIndex(1 % benefits.length)

    intervalRef.current = setInterval(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      const incoming = (currentIndexRef.current + 1) % benefits.length
      setNextIndex(incoming)
      setIsSliding(true)

      timeoutRef.current = setTimeout(() => {
        currentIndexRef.current = incoming
        setCurrentIndex(incoming)
        setNextIndex((incoming + 1) % benefits.length)
        setIsSliding(false)
        timeoutRef.current = null
      }, 500)
    }, DISPLAY_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [benefits.length, hasMultiple])

  const currentBenefit = benefits[currentIndex]
  const incomingBenefit = benefits[nextIndex]

  return (
    <div className={containerClass} style={containerStyle}>
      <div className={styles.benefitsBar}>
        <div className={styles.sliderWrapper}>
          <a
            href={currentBenefit.href}
            className={`${styles.benefitLink} ${styles.slide} ${styles.slideCurrent} ${
              isSliding ? styles.slideOutLeft : ''
            }`}
            aria-label={currentBenefit.alt}
          >
            <img
              src={currentBenefit.image}
              alt={currentBenefit.alt}
              className={styles.benefitImage}
            />
          </a>

          {hasMultiple && (
            <a
              href={incomingBenefit.href}
              className={`${styles.benefitLink} ${styles.slide} ${styles.slideNext} ${
                isSliding ? styles.slideInCenter : ''
              }`}
              aria-label={incomingBenefit.alt}
            >
              <img
                src={incomingBenefit.image}
                alt={incomingBenefit.alt}
                className={styles.benefitImage}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

BenefitsBar.schema = {
  title: 'Barra de Promociones',
  description: 'Barra de promociones rotativa - Agregá hasta 4 imágenes de promos',
  type: 'object',
  properties: {
    backgroundColor: {
      title: 'Color de Fondo',
      description: 'Color de fondo personalizado (ej: #000000 para negro, #FFFFFF para blanco). Dejá vacío para usar el tema.',
      type: 'string',
      default: '#000000'
    },
    benefits: {
      title: 'Promociones',
      description: 'Agregá hasta 4 promociones que rotarán automáticamente',
      type: 'array',
      maxItems: 4,
      items: {
        title: 'Promoción',
        type: 'object',
        properties: {
          id: {
            title: 'ID (opcional)',
            type: 'string'
          },
          image: {
            title: 'Imagen de la Promoción',
            description: 'Subí la imagen de la promoción',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          },
          alt: {
            title: 'Descripción',
            description: 'Descripción de la promoción (para accesibilidad)',
            type: 'string'
          },
          href: {
            title: 'Link',
            description: 'URL a donde lleva al hacer clic',
            type: 'string',
            default: '/pagos-y-promociones'
          },
          theme: {
            title: 'Tema (si no usás color personalizado)',
            description: 'Solo aplica si no ponés color de fondo',
            type: 'string',
            enum: ['dark', 'light'],
            enumNames: ['Oscuro (negro)', 'Claro (blanco)'],
            default: 'dark'
          }
        }
      },
      default: [
        {
          id: 'pago-blanco',
          image: '/arquivos/pago_blanco_2.png',
          alt: 'Medios de pago - logos en blanco',
          href: '/pagos-y-promociones',
          theme: 'dark'
        }
      ]
    }
  }
}

export default BenefitsBar
