import React, { useMemo } from 'react'
import { useProduct } from 'vtex.product-context'

import './index.css'

const InlinePrice: React.FC = () => {
  const productContext = useProduct()
  const offer = productContext?.selectedItem?.sellers?.[0]?.commertialOffer
  const priceRange = productContext?.product?.priceRange

  const { sellingPrice, listPrice, discountPercentage, currency } = useMemo(() => {
    const currencyCode = offer?.Currency ?? offer?.currency ?? 'ARS'

    const selling =
      offer?.Price ??
      offer?.price ??
      priceRange?.sellingPrice?.highPrice ??
      priceRange?.sellingPrice?.lowPrice ??
      null

    const list =
      offer?.ListPrice ??
      offer?.listPrice ??
      priceRange?.listPrice?.highPrice ??
      priceRange?.listPrice?.lowPrice ??
      null

    let discount: number | null = null

    if (selling && list && list > selling) {
      discount = Math.round((1 - selling / list) * 100)
    }

    return {
      sellingPrice: selling,
      listPrice: list,
      discountPercentage: discount,
      currency: currencyCode,
    }
  }, [offer, priceRange])

  if (!sellingPrice) {
    return null
  }

  const formatPrice = (value: number) => {
    try {
      const formatted = value.toLocaleString('es-AR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })

      return formatted.replace(/\u00a0|\u202f/g, ' ')
    } catch (error) {
      return `$${value.toFixed(0)}`
    }
  }

  return (
    <div
      className="inline-price"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <span
        className="inline-price__selling"
        style={{ fontSize: '33px', fontWeight: 600, lineHeight: '39px', color: '#090A10' }}
      >
        {formatPrice(sellingPrice)}
      </span>
      {listPrice && listPrice > sellingPrice ? (
        <span
          className="inline-price__list"
          style={{
            fontSize: '20px',
            fontWeight: 500,
            color: '#3D3F43',
            textDecoration: 'line-through',
            marginLeft: '12px',
          }}
        >
          {formatPrice(listPrice)}
        </span>
      ) : null}
      {discountPercentage !== null ? (
        <span
          className="inline-price__discount"
          style={{ fontSize: '20px', fontWeight: 600, color: '#EB5757', marginLeft: '8px' }}
        >
          -{discountPercentage}%
        </span>
      ) : null}
    </div>
  )
}

export default InlinePrice
