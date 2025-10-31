import React, { useState, useEffect } from 'react'
import styles from './index.css'

const BenefitsBar = () => {
  const benefits = [
    {
      id: 'modo',
      image: '/arquivos/benefit-modo.png',
      alt: 'MODO',
      href: '/institucional/medios-de-pago'
    },
    {
      id: 'mercadopago',
      image: '/arquivos/benefit-mercadopago.png',
      alt: 'Mercado Pago',
      href: '/institucional/medios-de-pago'
    },
    {
      id: 'cuotas',
      image: '/arquivos/benefit-cuotas.png',
      alt: '3 Cuotas sin interés',
      href: '/institucional/medios-de-pago'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [benefits.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + benefits.length) % benefits.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % benefits.length)
  }

  return (
    <div className={styles.benefitsBarContainer}>
      <div className={styles.benefitsBar}>
        <button
          onClick={handlePrev}
          className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
          aria-label="Anterior"
        >
          ‹
        </button>

        <a
          href={benefits[currentIndex].href}
          className={styles.benefitLink}
          aria-label={benefits[currentIndex].alt}
        >
          <img
            src={benefits[currentIndex].image}
            alt={benefits[currentIndex].alt}
            className={styles.benefitImage}
          />
        </a>

        <button
          onClick={handleNext}
          className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default BenefitsBar
