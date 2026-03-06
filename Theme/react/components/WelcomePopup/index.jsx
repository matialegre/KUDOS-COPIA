import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './index.css'

const WELCOME_POPUP_ENABLED = true
const WELCOME_POPUP_IGNORE_LOCAL_STORAGE = false
const WELCOME_POPUP_FORCE_STAY = false
const THEME_VERSION = '1.0.170'

const WelcomePopup = ({ 
  title, 
  subtitle, 
  discountText,
  description,
  buttonText,
  inputPlaceholder 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [debugInfo, setDebugInfo] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    console.log(`🎨 Mundo Outdoor Theme v${THEME_VERSION}`)
    
    if (!WELCOME_POPUP_ENABLED) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    if (!WELCOME_POPUP_IGNORE_LOCAL_STORAGE) {
      try {
        const hasSeen = window.localStorage.getItem('mundooutdoor_welcome_popup_seen') === 'true'
        if (hasSeen) {
          return
        }
      } catch (e) {
      }
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = (force = false) => {
    if (WELCOME_POPUP_FORCE_STAY && !force) {
      return
    }
    setIsVisible(false)
    if (!WELCOME_POPUP_IGNORE_LOCAL_STORAGE) {
      localStorage.setItem('mundooutdoor_welcome_popup_seen', 'true')
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    
    if (!email || !email.includes('@')) {
      return
    }

    setIsSubmitting(true)
    
    // Enviar a 6 entidades: NS + 5 de prueba
    const entities = ['NS', 'TQ', 'TW', 'TE', 'TR', 'TT']
    
    for (const entity of entities) {
      try {
        const payload = entity === 'NS' 
          ? { email, isNewsletterOptIn: true, source: 'popup_mundo10' }
          : { email }
        
        const response = await fetch(`/api/dataentities/${entity}/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        console.log(`${entity}: ${response.status}`)
      } catch (err) {
        console.error(`Error ${entity}:`, err)
      }
    }

    setShowSuccess(true)
    setIsSubmitting(false)
  }

  if (!WELCOME_POPUP_ENABLED || !isVisible) return null

  return (
    <div className={styles.popupOverlay} onClick={handleClose}>
      <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.closeButton} 
          onClick={handleClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className={styles.popupContent}>
          <h1 className={styles.title}>
            {title || '¡LLEGÓ MUNDO PARA ACOMPAÑARTE!'}
          </h1>

          <div className={styles.discountContainer}>
            <span className={styles.discount}>
              {discountText || '-10% OFF'}
            </span>
          </div>

          <p className={styles.subtitle}>
            {subtitle || 'Suscribite y obtené un 10% de descuento en tu primera compra'}
          </p>

          <p className={styles.description}>
            {description || 'PORQUE CADA AVENTURA EMPIEZA MEJOR CON VOS'}
          </p>

          {showSuccess ? (
            <div className={styles.successMessage}>
              <p>¡Gracias por suscribirte!</p>
              <p>Tu cupón es: <strong>mundo10</strong></p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleFormSubmit} className={styles.form}>
              <label className={styles.emailLabel}>
                Ingresa tu e-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder={inputPlaceholder || 'tu@email.com'}
                className={styles.emailInput}
                required
              />
              
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                {buttonText || 'SUSCRIBITE'}
              </button>
            </form>
          )}

          
        </div>
      </div>
    </div>
  )
}

WelcomePopup.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  discountText: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  inputPlaceholder: PropTypes.string
}

WelcomePopup.schema = {
  title: 'Popup de Bienvenida',
  description: 'Popup con descuento para nuevos visitantes',
  type: 'object',
  properties: {
    title: {
      title: 'Título Principal',
      type: 'string',
      default: '¡LLEGÓ MUNDO PARA ACOMPAÑARTE!'
    },
    subtitle: {
      title: 'Subtítulo',
      type: 'string',
      default: 'Suscribite y obtené un 10% de descuento en tu primera compra'
    },
    discountText: {
      title: 'Texto del Descuento',
      type: 'string',
      default: '-10% OFF'
    },
    description: {
      title: 'Descripción',
      type: 'string',
      default: 'PORQUE CADA AVENTURA EMPIEZA MEJOR CON VOS'
    },
    buttonText: {
      title: 'Texto del Botón',
      type: 'string',
      default: 'SUSCRIBITE'
    },
    inputPlaceholder: {
      title: 'Placeholder del Email',
      type: 'string',
      default: 'tu@email.com'
    }
  }
}

export default WelcomePopup
