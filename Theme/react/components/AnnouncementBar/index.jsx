import React, { useState, useEffect } from 'react'
import styles from './index.css'

const AnnouncementBar = ({ 
  messages = [],
  backgroundColor = '#000',
  textColor = '#fff',
  autoRotate = true,
  rotationInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const defaultMessages = [
    {
      id: 'free-shipping',
      text: 'ENVÍO GRATIS EN COMPRAS MAYORES A $150.000',
      icon: '🚚'
    }
  ]

  const displayMessages = messages && messages.length > 0 ? messages : defaultMessages
  const hasMultiple = displayMessages.length > 1

  useEffect(() => {
    if (!autoRotate || !hasMultiple) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayMessages.length)
    }, rotationInterval)

    return () => clearInterval(timer)
  }, [autoRotate, hasMultiple, displayMessages.length, rotationInterval])

  const currentMessage = displayMessages[currentIndex]

  return (
    <div 
      className={styles.announcementBar}
      style={{ 
        backgroundColor,
        color: textColor 
      }}
    >
      <div className={styles.announcementContent}>
        {currentMessage.icon && (
          <span className={styles.announcementIcon}>{currentMessage.icon}</span>
        )}
        <p className={styles.announcementText}>{currentMessage.text}</p>
      </div>
      
      {hasMultiple && (
        <div className={styles.announcementDots}>
          {displayMessages.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir al mensaje ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

AnnouncementBar.schema = {
  title: 'Announcement Bar',
  description: 'Barra de anuncios superior con mensajes rotativos',
  type: 'object',
  properties: {
    messages: {
      title: 'Mensajes',
      description: 'Lista de mensajes a mostrar',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            title: 'ID',
            type: 'string'
          },
          text: {
            title: 'Texto',
            description: 'Mensaje a mostrar',
            type: 'string'
          },
          icon: {
            title: 'Icono',
            description: 'Emoji o icono (opcional)',
            type: 'string'
          }
        }
      },
      default: [
        {
          id: 'free-shipping',
          text: 'ENVÍO GRATIS EN COMPRAS MAYORES A $150.000',
          icon: '🚚'
        }
      ]
    },
    backgroundColor: {
      title: 'Color de Fondo',
      description: 'Color de fondo de la barra',
      type: 'string',
      default: '#000'
    },
    textColor: {
      title: 'Color de Texto',
      description: 'Color del texto',
      type: 'string',
      default: '#fff'
    },
    autoRotate: {
      title: 'Rotación Automática',
      description: 'Rotar mensajes automáticamente',
      type: 'boolean',
      default: true
    },
    rotationInterval: {
      title: 'Intervalo de Rotación',
      description: 'Tiempo en milisegundos entre mensajes',
      type: 'number',
      default: 5000
    }
  }
}

export default AnnouncementBar
