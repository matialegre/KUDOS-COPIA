import React from 'react'

const SizeOutOfStock: React.FC = () => {
  return (
    <div
      className="size-out-of-stock"
      style={{
        marginTop: '16px',
        marginBottom: '16px',
      }}
    >
      <p
        style={{
          fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '20px',
          color: '#090A10',
          margin: '0 0 4px 0',
        }}
      >
        ¿Tu talle está agotado?
      </p>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          // TODO: Implementar lógica de notificación de stock
          alert('Funcionalidad de notificación de stock próximamente')
        }}
        style={{
          fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '20px',
          color: '#2680EB',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = 'underline'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none'
        }}
      >
        Avisame cuando haya stock
      </a>
    </div>
  )
}

export default SizeOutOfStock
