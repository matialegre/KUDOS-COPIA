import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import './index.css'

const NetPrice = () => {
  const productContext = useProduct()
  const selectedItem = productContext?.selectedItem
  const priceRange = productContext?.product?.priceRange
  const sellingPrice = priceRange?.sellingPrice?.highPrice
  const listPrice = priceRange?.listPrice?.highPrice ?? priceRange?.listPrice?.lowPrice

  const [netPrice, setNetPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const priceForNet = listPrice ?? sellingPrice

  useEffect(() => {
    if (!priceForNet) {
      setNetPrice(null)
      return
    }

    setLoading(true)
    const controller = new AbortController()

    fetch(`/_v/mundo/pricing/net?price=${priceForNet}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch net price')
        }
        return response.json()
      })
      .then((data) => {
        setNetPrice(data.priceWithoutIVA)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching net price:', error)
        setNetPrice(null)
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [priceForNet, selectedItem?.itemId])

  if (loading) {
    return (
      <div className="net-price-container">
        <span className="net-price-label">Cargando...</span>
      </div>
    )
  }

  if (!netPrice) {
    return null
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="net-price-container">
      <span className="net-price-label">Precio sin impuestos nacionales:</span>{' '}
      <span className="net-price-value">{formatPrice(netPrice)}</span>
    </div>
  )
}

export default NetPrice
