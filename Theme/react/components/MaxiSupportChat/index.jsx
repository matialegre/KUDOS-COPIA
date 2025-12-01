import React, { useState } from 'react'
import styles from './index.css'

const MaxiSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [lastUserMessage, setLastUserMessage] = useState(null)
  const [showHint, setShowHint] = useState(true)

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
    setFeedback('')
    setShowHint(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      setFeedback('Escribí un mensaje para Maxi.')
      return
    }

    setIsSending(true)
    setFeedback('')

    try {
      const body = {
        message: trimmedMessage,
        from:
          typeof window !== 'undefined' && window.location
            ? window.location.pathname
            : undefined,
      }

      const response = await fetch('/_v/mundo/support/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setLastUserMessage(trimmedMessage)
        setFeedback('Mensaje enviado. Maxi ya recibió tu consulta.')
        setMessage('')
      } else {
        setFeedback('Hubo un error al enviar el mensaje. Probá de nuevo.')
      }
    } catch (error) {
      console.error('Error enviando mensaje de soporte:', error)
      setFeedback('Hubo un error al enviar el mensaje. Probá de nuevo.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={styles.root}>
      {showHint && !isOpen && (
        <div className={styles.hint}>
          <span className={styles.hintText}>
            ¡Chateá ahora mismo con Maxi!
          </span>
          <button
            type="button"
            className={styles.hintClose}
            onClick={() => setShowHint(false)}
            aria-label="Cerrar aviso de chat"
          >
            ×
          </button>
        </div>
      )}

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.avatar}>M</div>
            <div className={styles.headerText}>
              <span className={styles.headerTitle}>Maxi</span>
              <span className={styles.headerSubtitle}>
                En línea · Mundo Outdoor
              </span>
            </div>
          </div>

          <div className={styles.chatBody}>
            <div className={styles.messages}>
              <div className={`${styles.messageRow} ${styles.fromMaxi}`}>
                <div className={styles.messageBubble}>
                  ¡Hola! Soy Maxi de Mundo Outdoor. Contame en qué te puedo
                  ayudar.
                </div>
              </div>

              {lastUserMessage && (
                <div className={`${styles.messageRow} ${styles.fromUser}`}>
                  <div className={styles.messageBubble}>{lastUserMessage}</div>
                </div>
              )}
            </div>

            <form className={styles.footer} onSubmit={handleSubmit}>
              <textarea
                className={styles.textarea}
                placeholder="Escribí tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                disabled={isSending}
              />

              <div className={styles.footerRow}>
                {feedback && <p className={styles.feedback}>{feedback}</p>}
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={isSending}
                >
                  {isSending ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.bubble}
        onClick={toggleOpen}
        aria-label="Chatear con Maxi"
      >
        <div className={styles.bubbleAvatar}>M</div>
        <div className={styles.bubbleText}>
          <span className={styles.bubbleTitle}>¿Hablás con Maxi?</span>
          <span className={styles.bubbleSubtitle}>Escribime por acá</span>
        </div>
      </button>
    </div>
  )
}

export default MaxiSupportChat
