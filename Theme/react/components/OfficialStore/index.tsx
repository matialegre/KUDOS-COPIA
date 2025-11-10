import React from 'react'
import { useProduct } from 'vtex.product-context'

const OfficialStore: React.FC = () => {
  const productContext = useProduct()
  const brand = productContext?.product?.brand

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (brand) {
      // Redirigir a la página de la marca
      window.location.href = `/${brand.toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  if (!brand) return null

  return (
    <div
      className="official-store"
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
          margin: 0,
        }}
      >
        Tienda oficial{' '}
        <a
          href={`/${brand.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={handleClick}
          style={{
            color: '#2680EB',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          {brand}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: '2px' }}
          >
            <path
              d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM11.7071 6.70711L7.70711 10.7071C7.31658 11.0976 6.68342 11.0976 6.29289 10.7071L4.29289 8.70711C3.90237 8.31658 3.90237 7.68342 4.29289 7.29289C4.68342 6.90237 5.31658 6.90237 5.70711 7.29289L7 8.58579L10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711Z"
              fill="#2680EB"
            />
          </svg>
        </a>
      </p>
    </div>
  )
}

export default OfficialStore
