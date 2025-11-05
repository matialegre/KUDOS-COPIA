import React, { useState, useEffect } from 'react'
import styles from './index.css'

const BenefitSliderMobile = ({ benefits }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 2) % benefits.length)
        setIsAnimating(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [benefits.length])

  const visibleBenefits = [
    benefits[currentIndex],
    benefits[(currentIndex + 1) % benefits.length]
  ]

  return (
    <div className={styles.sliderContainer}>
      <div className={`${styles.sliderTrack} ${isAnimating ? styles.slideOut : ''}`}>
        {visibleBenefits.map((benefit, index) => (
          <a 
            key={`${currentIndex}-${index}`}
            href={benefit.link || '/institucional/medios-de-pago'}
            className={styles.slideItem}
          >
            <img 
              src={benefit.image}
              alt={benefit.alt || `Beneficio ${index + 1}`}
              className={styles.slideImage}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

BenefitSliderMobile.schema = {
  title: 'Benefit Slider Mobile',
  description: 'Slider de beneficios para mobile - muestra 2 imágenes a la vez',
  type: 'object',
  properties: {
    benefits: {
      title: 'Beneficios',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          image: {
            title: 'Imagen',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          },
          alt: {
            title: 'Texto alternativo',
            type: 'string'
          },
          link: {
            title: 'Link',
            type: 'string'
          }
        }
      }
    }
  }
}

export default BenefitSliderMobile
