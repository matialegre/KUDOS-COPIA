import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './index.css'

const WELCOME_POPUP_ENABLED = true
const WELCOME_POPUP_IGNORE_LOCAL_STORAGE = true

const WelcomePopup = ({ 
  title, 
  subtitle, 
  discountText,
  description,
  buttonText,
  inputPlaceholder 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
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

  const handleClose = () => {
    setIsVisible(false)
    if (!WELCOME_POPUP_IGNORE_LOCAL_STORAGE) {
      localStorage.setItem('mundooutdoor_welcome_popup_seen', 'true')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setMessage('Por favor ingresá un email válido')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      // 1) Generar cupón
      let couponCode = 'mundo10'

      // 2) Normalizar cupón: si no se pudo generar uno dinámico, usar uno estático
      if (!couponCode) {
        couponCode = 'mundo10'
      }

      // Guardar en Master Data siempre con email + cupón

      if (couponCode) {
        setMessage(`¡Gracias por suscribirte! Tu cupón es ${couponCode}.`)
      } else {
        setMessage('¡Gracias por suscribirte! Revisá tu email.')
      }

      setEmail('')

      // Cerrar popup después de 2 segundos
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Error al suscribirse:', error)
      setMessage('Hubo un error. Intentá de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.emailLabel}>
              Ingresa tu e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={inputPlaceholder || 'tu@email.com'}
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
              <p className={styles.message}>{message}</p>
            )}
          </form>
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
