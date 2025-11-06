import React, { useState } from 'react'
import { useProduct } from 'vtex.product-context'
import styles from './index.css'

const StockNotification = ({ 
  buttonText = "Avisame cuando hay stock",
  buttonColor = "#2680EB",
  successMessage = "Te avisaremos cuando haya stock disponible"
}) => {
  const productContext = useProduct()
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const selectedItem = productContext?.selectedItem
  const isAvailable = selectedItem?.sellers?.[0]?.commertialOffer?.AvailableQuantity > 0

  // Si hay stock disponible, no mostrar nada
  if (isAvailable) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Aquí iría la lógica para enviar el email
    // Por ahora solo mostramos mensaje de éxito
    console.log('Email registrado:', email, 'para SKU:', selectedItem?.itemId)
    
    setSubmitted(true)
    setTimeout(() => {
      setShowForm(false)
      setSubmitted(false)
      setEmail('')
    }, 3000)
  }

  return (
    <div className={styles.stockNotificationContainer}>
      {!showForm ? (
        <button 
          className={styles.notifyButton}
          style={{ color: buttonColor }}
          onClick={() => setShowForm(true)}
        >
          <span className={styles.notifyText}>
            ¿Tu talle está agotado? {buttonText}
          </span>
        </button>
      ) : (
        <div className={styles.formContainer}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className={styles.notifyForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresá tu email"
                required
                className={styles.emailInput}
              />
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>
                  Enviar
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.successMessage}>
              {successMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

StockNotification.schema = {
  title: 'Notificación de Stock',
  description: 'Componente para avisar cuando hay stock disponible',
  type: 'object',
  properties: {
    buttonText: {
      title: 'Texto del botón',
      type: 'string',
      default: 'Avisame cuando hay stock'
    },
    buttonColor: {
      title: 'Color del texto',
      type: 'string',
      default: '#2680EB',
      widget: {
        'ui:widget': 'color'
      }
    },
    successMessage: {
      title: 'Mensaje de éxito',
      type: 'string',
      default: 'Te avisaremos cuando haya stock disponible'
    }
  }
}

export default StockNotification
