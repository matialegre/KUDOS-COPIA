import React from 'react'
import './pagos-promociones.global.css'

interface LogoCardProps {
  imageUrl: string
  text1: string
  text2: string
  alt: string
}

const LogoCard: React.FC<LogoCardProps> = ({ imageUrl, text1, text2, alt }) => {
  return (
    <div className="logo-card">
      <img src={imageUrl} alt={alt} className="logo-image" />
      <p className="logo-text-bold">{text1}</p>
      <p className="logo-text-green">{text2}</p>
    </div>
  )
}

interface PagosPromocionesProps {
  imageUrl?: string
  alt?: string
}

const PagosPromociones: React.FC<PagosPromocionesProps> = ({ imageUrl, alt }) => {
  const effectiveImageUrl =
    imageUrl ||
    'https://mundooutdoorar.vtexassets.com/arquivos/promosbancarias-69(3).png'

  const effectiveAlt =
    alt || 'Promociones bancarias, cuotas y medios de pago'

  return (
    <div className="pagos-promociones-container">
      <img
        src={effectiveImageUrl}
        alt={effectiveAlt}
        className="pagos-promociones-full-image"
      />
    </div>
  )
}

;(PagosPromociones as any).schema = {
  title: 'Popup de promociones bancarias',
  description:
    'Imagen principal del popup de promociones bancarias / medios de pago en la PDP',
  type: 'object',
  properties: {
    imageUrl: {
      title: 'URL de la imagen',
      type: 'string',
      default:
        'https://mundooutdoorar.vtexassets.com/arquivos/promosbancarias-69(3).png',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    alt: {
      title: 'Texto alternativo (alt)',
      type: 'string',
      default: 'Promociones bancarias, cuotas y medios de pago',
    },
  },
}

export default PagosPromociones
