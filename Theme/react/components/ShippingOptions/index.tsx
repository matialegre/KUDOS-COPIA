import React, { useState } from 'react'

const ShippingOptions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'pickup' | 'delivery' | null>(null)
  const [postalCode, setPostalCode] = useState('')

  const handleCalculateShipping = () => {
    if (!postalCode) {
      alert('Por favor ingresá un código postal')
      return
    }
    // TODO: Implementar lógica de cálculo de envío
    console.log('Calculando envío para código postal:', postalCode)
  }

  return (
    <div
      className="shipping-options"
      style={{
        marginTop: '24px',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {/* Retiro por sucursal */}
        <button
          onClick={() => setSelectedOption('pickup')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',
            border: selectedOption === 'pickup' ? '2px solid #2680EB' : '1px solid #E5E5E5',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (selectedOption !== 'pickup') {
              e.currentTarget.style.borderColor = '#CCCCCC'
            }
          }}
          onMouseLeave={(e) => {
            if (selectedOption !== 'pickup') {
              e.currentTarget.style.borderColor = '#E5E5E5'
            }
          }}
        >
          <img
            src="https://mundooutdoorar.vtexassets.com/arquivos/retirocompras.png"
            alt="Retiro por sucursal"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'contain',
              marginBottom: '12px',
            }}
          />
          <p
            style={{
              fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '24px',
              color: '#090A10',
              margin: '0 0 4px 0',
            }}
          >
            Retiro
          </p>
          <p
            style={{
              fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '18px',
              color: '#6B6B6B',
              margin: '0 0 8px 0',
            }}
          >
            (Por una sucursal)
          </p>
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
            Seleccioná talle
          </p>
        </button>

        {/* Envío a domicilio */}
        <button
          onClick={() => setSelectedOption('delivery')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',
            border: selectedOption === 'delivery' ? '2px solid #2680EB' : '1px solid #E5E5E5',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (selectedOption !== 'delivery') {
              e.currentTarget.style.borderColor = '#CCCCCC'
            }
          }}
          onMouseLeave={(e) => {
            if (selectedOption !== 'delivery') {
              e.currentTarget.style.borderColor = '#E5E5E5'
            }
          }}
        >
          <img
            src="https://mundooutdoorar.vtexassets.com/arquivos/camioncompras.png"
            alt="Envío a domicilio"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'contain',
              marginBottom: '12px',
            }}
          />
          <p
            style={{
              fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '24px',
              color: '#090A10',
              margin: '0 0 4px 0',
            }}
          >
            Envío
          </p>
          <p
            style={{
              fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '18px',
              color: '#6B6B6B',
              margin: '0 0 8px 0',
            }}
          >
            (A domicilio)
          </p>
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
            Seleccioná talle
          </p>
        </button>
      </div>

      {/* Código postal y calcular envío */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <label
          htmlFor="postal-code"
          style={{
            fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '18px',
            color: '#6B6B6B',
            marginBottom: '8px',
            alignSelf: 'flex-start',
          }}
        >
          Código postal
        </label>
        <input
          id="postal-code"
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder=""
          style={{
            width: '100%',
            maxWidth: '465px',
            height: '48px',
            padding: '12px 16px',
            border: '1px solid #E5E5E5',
            borderRadius: '4px',
            fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '16px',
            color: '#090A10',
            marginBottom: '12px',
          }}
        />
        <button
          onClick={handleCalculateShipping}
          style={{
            width: '100%',
            maxWidth: '465px',
            height: '48px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #090A10',
            borderRadius: '4px',
            fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '20px',
            color: '#090A10',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F5F5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF'
          }}
        >
          Calcular envío
        </button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            alert('Funcionalidad de búsqueda de código postal próximamente')
          }}
          style={{
            fontFamily: 'Gotham, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '18px',
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
          No sé mi código postal
        </a>
      </div>
    </div>
  )
}

export default ShippingOptions
