import React from 'react'
import styles from './index.css'

const AnnouncementBar = ({ 
  messages = [],
  backgroundColor = '#000',
  textColor = '#fff'
}) => {

  const defaultMessages = [
    {
      id: 'free-shipping',
      text: 'ENVÍO GRATIS EN COMPRAS MAYORES A $120.000',
      iconImage: 'https://mundooutdoorar.vteximg.com.br/arquivos/icono_camion_blanco.png'
    },
    {
      id: 'cuotas',
      text: '3 Y 6 CUOTAS SIN INTERÉS',
      iconImage: 'https://mundooutdoorar.vteximg.com.br/arquivos/tarjeta.blanca.arriba.png'
    }
  ]

  const displayMessages = messages && messages.length > 0 ? messages : defaultMessages

  // Crear el contenido del marquee repitiendo los mensajes para efecto continuo
  const marqueeContent = displayMessages.map((msg, index) => (
    <span key={`msg-${index}`} className={styles.marqueeItem}>
      {msg.iconImage && <img src={msg.iconImage} alt="" className={styles.announcementIconImage} />}
      {msg.icon && !msg.iconImage && <span className={styles.announcementIcon}>{msg.icon}</span>}
      <span className={styles.announcementText}>{msg.text}</span>
    </span>
  ))

  return (
    <div 
      className={styles.announcementBar}
      style={{ 
        backgroundColor,
        color: textColor 
      }}
    >
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {marqueeContent}
          {marqueeContent}
          {marqueeContent}
          {marqueeContent}
        </div>
      </div>
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
