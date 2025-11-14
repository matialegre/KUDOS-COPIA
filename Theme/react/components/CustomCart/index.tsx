import React, { useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

interface ShippingOption {
  type: 'pickup' | 'delivery'
  selected: boolean
}

const CustomCart: React.FC = () => {
  const { orderForm, setOrderForm } = useOrderForm()
  const [discountCode, setDiscountCode] = useState('')
  const [shippingOption, setShippingOption] = useState<'pickup' | 'delivery' | null>(null)

  const items = orderForm?.items || []
  const totalizers = orderForm?.totalizers || []
  const value = orderForm?.value || 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 100)
  }

  const handleApplyDiscount = () => {
    if (!discountCode) return
    // Lógica para aplicar código de descuento
    console.log('Aplicando código:', discountCode)
  }

  const handleCheckout = () => {
    window.location.href = '/checkout/#/payment'
  }

  const handleContinueShopping = () => {
    window.location.href = '/'
  }

  const subtotal = totalizers.find((t: any) => t.id === 'Items')?.value || value
  const discount = totalizers.find((t: any) => t.id === 'Discounts')?.value || 0
  const shipping = totalizers.find((t: any) => t.id === 'Shipping')?.value || 0

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '32px',
      }}
    >
      {/* Columna izquierda - Productos */}
      <div>
        <h1
          style={{
            fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '32px',
            color: '#090A10',
            marginBottom: '24px',
          }}
        >
          Producto
        </h1>

        {items.map((item: any) => {
          const listPrice = item.listPrice || item.sellingPrice
          const sellingPrice = item.sellingPrice
          const hasDiscount = listPrice > sellingPrice
          const discountPercent = hasDiscount
            ? Math.round(((listPrice - sellingPrice) / listPrice) * 100)
            : 0

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '20px 0',
                borderBottom: '1px solid #E5E5E5',
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                }}
              />

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '22px',
                    color: '#090A10',
                    marginBottom: '8px',
                  }}
                >
                  {item.name}
                </h3>

                {/* SKU info */}
                <div
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    color: '#6B6B6B',
                    marginBottom: '12px',
                  }}
                >
                  {item.additionalInfo?.dimension && `${item.additionalInfo.dimension}`}
                </div>

                {/* Precio */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ marginBottom: '4px', fontFamily: 'Gotham', fontSize: '14px', fontWeight: 500, color: '#090A10' }}>
                    Precio
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {hasDiscount && (
                      <>
                        <span
                          style={{
                            fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '18px',
                            color: '#6B6B6B',
                            textDecoration: 'line-through',
                          }}
                        >
                          {formatPrice(listPrice)}
                        </span>
                        <span
                          style={{
                            fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '18px',
                            color: '#EB5757',
                          }}
                        >
                          -{discountPercent}%
                        </span>
                      </>
                    )}
                    <span
                      style={{
                        fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '18px',
                        fontWeight: 600,
                        lineHeight: '24px',
                        color: '#090A10',
                      }}
                    >
                      {formatPrice(sellingPrice)}
                    </span>
                  </div>
                </div>

                {/* Cantidad */}
                <div>
                  <div style={{ marginBottom: '4px', fontFamily: 'Gotham', fontSize: '14px', fontWeight: 500, color: '#090A10' }}>
                    Cantidad
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#090A10',
                      }}
                    >
                      {item.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <button
                  onClick={() => {
                    // Lógica para eliminar item
                    console.log('Eliminar item:', item.id)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#EB5757',
                    fontSize: '20px',
                  }}
                >
                  🗑️
                </button>
                <div>
                  <div style={{ marginBottom: '4px', fontFamily: 'Gotham', fontSize: '14px', fontWeight: 500, color: '#090A10', textAlign: 'right' }}>
                    Total
                  </div>
                  <div
                    style={{
                      fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: '18px',
                      fontWeight: 600,
                      lineHeight: '24px',
                      color: '#090A10',
                    }}
                  >
                    {formatPrice(sellingPrice * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Columna derecha - Resumen */}
      <div>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '8px',
            padding: '24px',
            border: '1px solid #E5E5E5',
          }}
        >
          <h2
            style={{
              fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '28px',
              color: '#090A10',
              marginBottom: '20px',
            }}
          >
            Resumen de compra
          </h2>

          {/* Código de descuento */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '18px',
                color: '#090A10',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              ¿Tenés un código de promoción?
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Ingresá tu código"
                style={{
                  flex: 1,
                  height: '48px',
                  padding: '12px 16px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '16px',
                  color: '#090A10',
                }}
              />
              <button
                onClick={handleApplyDiscount}
                style={{
                  height: '48px',
                  padding: '0 24px',
                  background: '#090A10',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '18px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                Validar
              </button>
            </div>
          </div>

          {/* Opciones de envío */}
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '22px',
                color: '#090A10',
                marginBottom: '16px',
              }}
            >
              Calculá el costo de Retiro/Envío
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => setShippingOption('pickup')}
                style={{
                  border: `2px solid ${shippingOption === 'pickup' ? '#090A10' : '#E5E5E5'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  background: shippingOption === 'pickup' ? '#F5F5F5' : '#FFFFFF',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src="https://mundooutdoorar.vtexassets.com/arquivos/retirocompras.png"
                  alt="Retiro"
                  style={{ width: '48px', height: '48px', marginBottom: '8px' }}
                />
                <div
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '18px',
                    color: '#090A10',
                    marginBottom: '4px',
                  }}
                >
                  Retiro
                </div>
                <div
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '16px',
                    color: '#6B6B6B',
                  }}
                >
                  Seleccioná sucursal
                </div>
              </button>

              <button
                onClick={() => setShippingOption('delivery')}
                style={{
                  border: `2px solid ${shippingOption === 'delivery' ? '#090A10' : '#E5E5E5'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  background: shippingOption === 'delivery' ? '#F5F5F5' : '#FFFFFF',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src="https://mundooutdoorar.vtexassets.com/arquivos/camioncompras.png"
                  alt="Envío"
                  style={{ width: '48px', height: '48px', marginBottom: '8px' }}
                />
                <div
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '18px',
                    color: '#090A10',
                    marginBottom: '4px',
                  }}
                >
                  Envío
                </div>
                <div
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '16px',
                    color: '#6B6B6B',
                  }}
                >
                  Insertar dirección
                </div>
              </button>
            </div>
          </div>

          {/* Totales */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '18px',
                  color: '#6B6B6B',
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '18px',
                  color: '#090A10',
                }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>

            {discount < 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    color: '#6B6B6B',
                  }}
                >
                  Descuento
                </span>
                <span
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '18px',
                    color: '#EB5757',
                  }}
                >
                  {formatPrice(discount)}
                </span>
              </div>
            )}

            {shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    color: '#6B6B6B',
                  }}
                >
                  Envío
                </span>
                <span
                  style={{
                    fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '18px',
                    color: '#090A10',
                  }}
                >
                  {formatPrice(shipping)}
                </span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #E5E5E5',
                marginTop: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: '24px',
                  color: '#090A10',
                }}
              >
                TOTAL
              </span>
              <span
                style={{
                  fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: '28px',
                  color: '#090A10',
                }}
              >
                {formatPrice(value)}
              </span>
            </div>
          </div>

          {/* Nota de impuestos */}
          <div
            style={{
              fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '16px',
              color: '#6B6B6B',
              marginBottom: '20px',
            }}
          >
            Total impuestos nacionales (IVA): {formatPrice(value * 0.21)}
            <br />
            Total sin impuestos locales (IVA): {formatPrice(value * 0.79)}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                height: '56px',
                background: '#090A10',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '20px',
                color: '#FFFFFF',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2C2D30'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#090A10'
              }}
            >
              Comprar ahora
            </button>

            <button
              onClick={handleContinueShopping}
              style={{
                width: '100%',
                height: '56px',
                background: '#FFFFFF',
                border: '1px solid #090A10',
                borderRadius: '4px',
                fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '20px',
                color: '#090A10',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F5F5F5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF'
              }}
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomCart
