import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './index.css'

// URL de ngrok - ACTUALIZAR cuando reinicies ngrok
const PYTHON_ENDPOINT = 'https://b66afbbc99b4.ngrok.app'

const SupportEntry = ({
  welcomeMessage =
    'Hola, soy el asistente de Mundo Outdoor. Contame en qué te puedo ayudar y te respondemos a la brevedad.',
  whatsappUrl = 'https://wa.me/5492914147915',
}) => {

  const [isOpen, setIsOpen] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState([])
  const [lastMessageId, setLastMessageId] = useState(0)

  const messagesRef = useRef(null)
  const inputRef = useRef(null)
  const pollingRef = useRef(null)

  const canSend = useMemo(() => !!draft.trim() && !loading, [draft, loading])

  useEffect(() => {
    if (!isOpen) return
    if (!messagesRef.current) return
    try {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    } catch (e) {}
  }, [isOpen, messages, loading])

  // Polling para recibir respuestas del agente desde Python
  useEffect(() => {
    if (!isOpen || !ticketId) return

    const pollMessages = async () => {
      try {
        console.log(`[CHAT DEBUG] Polling messages for ${ticketId} after id ${lastMessageId}`)
        const res = await fetch(`${PYTHON_ENDPOINT}/api/tickets/${ticketId}/messages?after=${lastMessageId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        const data = await res.json()
        
        if (data?.messages?.length > 0) {
          console.log(`[CHAT DEBUG] Got ${data.messages.length} new messages`)
          data.messages.forEach(msg => {
            if (msg.sender === 'agent') {
              pushMessage('bot', msg.message)
            }
            if (msg.id > lastMessageId) {
              setLastMessageId(msg.id)
            }
          })
        }
      } catch (e) {
        console.log('[CHAT DEBUG] Polling error:', e.message)
      }
    }

    pollingRef.current = setInterval(pollMessages, 3000)
    pollMessages() // Poll immediately
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [isOpen, ticketId, lastMessageId])

  const pushMessage = (from, text) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, from, text }])
  }

  const startSession = async () => {
    const localTicketId = ticketId || `BOT-${Date.now()}`
    setTicketId(localTicketId)
    console.log(`[CHAT DEBUG] Starting session: ${localTicketId}`)

    try {
      const res = await fetch(`${PYTHON_ENDPOINT}/session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          ticketId: localTicketId,
          source: 'web-support',
          context: {
            page: window.location.pathname,
          },
        }),
      })

      const data = await res.json().catch(() => ({}))
      console.log(`[CHAT DEBUG] Session response:`, data)
      if (data?.ticketId) setTicketId(data.ticketId)
    } catch (e) {
      console.log(`[CHAT DEBUG] Session error (using local):`, e.message)
    }
  }

  const handleOpen = async () => {
    setIsOpen(true)
    setError('')

    if (!messages.length) {
      pushMessage('bot', welcomeMessage)
    }

    setTimeout(() => {
      try {
        inputRef.current?.focus()
      } catch (e) {}
    }, 50)

    await startSession()
  }

  const handleSend = async () => {
    const text = draft.trim()
    if (!text) return

    setLoading(true)
    setError('')

    const activeTicketId = ticketId || `BOT-${Date.now()}`
    if (!ticketId) setTicketId(activeTicketId)

    pushMessage('user', text)
    setDraft('')

    console.log(`[CHAT DEBUG] Sending message to Python: ${text.substring(0, 50)}...`)

    try {
      // Enviar directamente a Python (via ngrok)
      const res = await fetch(`${PYTHON_ENDPOINT}/assist`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          ticketId: activeTicketId,
          message: text,
          source: 'web-support',
          context: {
            page: window.location.pathname,
          },
        }),
      })

      const data = await res.json().catch(() => ({}))
      console.log(`[CHAT DEBUG] Python response:`, data)
      
      if (!res.ok) {
        throw new Error(data?.error || 'Error al enviar')
      }

      if (data?.ticketId) setTicketId(data.ticketId)
      if (data?.reply) {
        pushMessage('bot', data.reply)
      }
    } catch (e) {
      console.log(`[CHAT DEBUG] Error sending:`, e.message)
      setError('Error de conexión. Intentá de nuevo.')
      pushMessage('bot', '¡Gracias por escribirnos! Tu consulta fue recibida. Un asesor te responderá a la brevedad.')
    } finally {
      setLoading(false)
      try {
        inputRef.current?.focus()
      } catch (e) {}
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setDraft('')
    setError('')
  }

  const handleInputKeyDown = (e) => {
    if (e.key !== 'Enter') return
    if (e.shiftKey) return
    e.preventDefault()
    if (canSend) {
      handleSend()
    }
  }

  return (
    <div className={styles.supportEntryContainer}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappLink}
        aria-label="Abrir WhatsApp"
      >
        <svg
          className={styles.whatsappIcon}
          viewBox="0 0 448 512"
          role="img"
          aria-label="WhatsApp"
        >
          <path
            fill="currentColor"
            d="M380.9 97.1C339 55.1 283.2 32 224.9 32c-117.5 0-213 95.5-213 213 0 37.5 9.8 74 28.4 106.1L0 480l131.7-39.3c30.9 16.8 65.7 25.6 101.2 25.6h.1c117.5 0 213-95.5 213-213 0-58.3-23.1-114.1-65.1-156.2zm-156 335.6h-.1c-31.8 0-63-8.6-90.4-24.9l-6.5-3.9-78.1 23.3 24.8-76.1-4.2-6.8c-17.5-28-26.8-60.3-26.8-93.4 0-97.7 79.5-177.2 177.2-177.2 47.4 0 91.9 18.5 125.4 52s52 78 52 125.4c0 97.7-79.5 177.2-177.3 177.2zm101.7-138.3c-5.6-2.8-33.3-16.4-38.5-18.3-5.2-1.9-9-2.8-12.8 2.8-3.7 5.6-14.7 18.3-18 22.1-3.3 3.7-6.6 4.2-12.2 1.4-33.2-16.6-55-29.7-76.9-67.4-5.8-10 5.8-9.3 16.6-31 1.9-3.7.9-7-0.9-9.7-1.9-2.8-12.8-30.8-17.5-42.1-4.6-11.1-9.3-9.6-12.8-9.8-3.3-.2-7-.2-10.8-.2-3.7 0-9.7 1.4-14.7 7-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.7 57.4c2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.1 31.5 11.6 13.2 4.2 25.2 3.6 34.7 2.2 10.6-1.6 33.3-13.6 38-26.8 4.7-13.2 4.7-24.5 3.3-26.8-1.4-2.3-5.2-3.7-10.8-6.5z"
          />
        </svg>
      </a>

      <div className={styles.botRoot} data-ticket-id={ticketId || undefined}>
          {!isOpen && (
            <button className={styles.launcher} onClick={handleOpen} aria-label="Soporte">
              <span className={styles.launcherLine1}>¿NECESITÁS AYUDA?</span>
              <span className={styles.launcherLine2}>Soporte</span>
            </button>
          )}

          {isOpen && (
            <div className={styles.panel}>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <div className={styles.avatar}>MO</div>
                  <div className={styles.headerText}>
                    <div className={styles.headerTitle}>Soporte Mundo Outdoor</div>
                    <div className={styles.headerSubtitle}>Respondemos a la brevedad</div>
                  </div>
                </div>

                <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar">
                  ×
                </button>
              </div>

              <div className={styles.chatBody}>
                <div className={styles.messages} ref={messagesRef}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`${styles.messageRow} ${
                        m.from === 'user' ? styles.fromUser : styles.fromBot
                      }`}
                    >
                      <div className={styles.messageBubble}>{m.text}</div>
                    </div>
                  ))}

                  {loading && (
                    <div className={`${styles.messageRow} ${styles.fromBot}`}>
                      <div className={styles.typing}>
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.footer}>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.inputRow}>
                  <textarea
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Escribí tu mensaje…"
                    className={styles.textarea}
                    rows={1}
                    disabled={loading}
                  />
                  <button
                    className={styles.sendButton}
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label="Enviar"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M2 21l21-9L2 3v7l15 2-15 2v7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

SupportEntry.propTypes = {
  welcomeMessage: PropTypes.string,
  whatsappUrl: PropTypes.string,
}

SupportEntry.schema = {
  title: 'Bot de Soporte',
  description: 'Configura el bot de soporte.',
  type: 'object',
  properties: {
    welcomeMessage: {
      title: 'Mensaje de bienvenida',
      type: 'string',
      default:
        'Hola, soy el asistente de Mundo Outdoor. Contame en qué te puedo ayudar y te respondemos a la brevedad.',
    },
    whatsappUrl: {
      title: 'URL de WhatsApp',
      type: 'string',
      default: 'https://wa.me/5492914147915',
    },
  },
}

export default SupportEntry
