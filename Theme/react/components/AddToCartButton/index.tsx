import React from 'react'
import { useProduct } from 'vtex.product-context'

const AddToCartButton: React.FC = () => {
  const productContext = useProduct()
  const selectedItem = productContext?.selectedItem

  const handleAddToCart = () => {
    if (!selectedItem) return

    const skuId = selectedItem.itemId
    window.location.href = `/checkout/cart/add?sku=${skuId}&qty=1&seller=1&sc=1`
  }

  return (
    <button
      className="add-to-cart-button-custom"
      onClick={handleAddToCart}
      style={{
        width: '100%',
        maxWidth: '465px',
        height: '48px',
        backgroundColor: '#E5E5E5',
        color: '#000000',
        border: 'none',
        borderRadius: '4px',
        fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0.1px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        marginTop: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#D0D0D0'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#E5E5E5'
      }}
    >
      AÑADIR AL CARRITO
    </button>
  )
}

export default AddToCartButton
