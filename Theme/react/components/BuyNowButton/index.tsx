import React from 'react'
import { useProduct } from 'vtex.product-context'

const BuyNowButton: React.FC = () => {
  const productContext = useProduct()
  const selectedItem = productContext?.selectedItem
  const selectedQuantity = productContext?.selectedQuantity || 1

  const handleBuyNow = () => {
    if (!selectedItem) return

    const skuId = selectedItem.itemId
    window.location.href = `/checkout/cart/add?sku=${skuId}&qty=${selectedQuantity}&seller=1&redirect=true&sc=1`
  }

  return (
    <button
      className="buy-now-button"
      onClick={handleBuyNow}
      style={{
        width: '100%',
        maxWidth: '465px',
        height: '48px',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '4px',
        fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0.1px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        marginTop: '20px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1A1A1A'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#000000'
      }}
    >
      COMPRAR AHORA!
    </button>
  )
}

export default BuyNowButton
