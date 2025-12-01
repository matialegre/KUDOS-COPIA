import React from 'react'
import { useProduct } from 'vtex.product-context'

const ProductReferenceInfo = () => {
  const productContext = useProduct()

  const reference = productContext?.product?.productReference || ''
  const brandFromProduct = productContext?.product?.brand || ''

  const categories = productContext?.product?.categories || []

  let displayGender = ''
  let displayType = ''

  if (categories.length > 0) {
    const genderMap = {
      HOMBRE: 'Hombre',
      MUJER: 'Mujer',
      NIÑOS: 'Niños',
      NIÑO: 'Niños',
      NIÑA: 'Niños',
      UNISEX: 'Unisex',
    }

    categories.forEach((path) => {
      const segments = path.split('/').filter(Boolean)
      if (segments.length === 0) return
      const first = segments[0].toUpperCase()

      if (genderMap[first]) {
        if (!displayGender) {
          displayGender = genderMap[first]
        }

        const candidateType = segments[segments.length - 1]

        if (segments.length > 1 && candidateType.toUpperCase() !== first) {
          displayType = candidateType
        }
      }
    })
  }

  if (!reference) {
    return null
  }

  const normalizedType = displayType ? displayType.toUpperCase() : '*'
  const normalizedGender = displayGender || '*'
  const normalizedBrand = brandFromProduct ? brandFromProduct.toUpperCase() : '*'

  const text = `Referencia: ${reference} - ${normalizedType} - ${normalizedGender} - ${normalizedBrand}`

  return (
    <div
      style={{
        margin: '16px auto 0',
        fontFamily: 'GothamBook',
        fontSize: '13px',
        lineHeight: '18px',
        letterSpacing: '0.1px',
        color: '#3D3F43',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  )
}

export default ProductReferenceInfo
