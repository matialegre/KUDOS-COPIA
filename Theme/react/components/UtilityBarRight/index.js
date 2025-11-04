import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.css'

const UtilityBarRight = ({ items }) => {
  if (!items || !items.length) {
    return null
  }

  return (
    <nav className={styles.utilityBarRight} aria-label="Utility navigation">
      {items.map((item) => (
        <a
          key={item.id || item.href}
          href={item.href}
          className={styles.utilityItem}
          aria-label={item.ariaLabel || item.label || undefined}
        >
          {item.icon && (
            <img
              src={item.icon}
              alt=""
              className={styles.utilityIcon}
              aria-hidden="true"
            />
          )}
          {item.label ? (
            <span className={styles.utilityLabel}>{item.label}</span>
          ) : null}
        </a>
      ))}
    </nav>
  )
}

UtilityBarRight.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      href: PropTypes.string.isRequired,
      icon: PropTypes.string,
      ariaLabel: PropTypes.string,
    })
  ),
}

UtilityBarRight.defaultProps = {
  items: [],
}

UtilityBarRight.schema = {
  title: 'Utility Bar Right',
  description: 'Barra de utilidades superior derecha (Ver sucursales, Envíos, Mi cuenta)',
  type: 'object',
  properties: {
    items: {
      title: 'Items',
      description: 'Lista de links de utilidad',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            title: 'ID',
            type: 'string'
          },
          label: {
            title: 'Texto',
            description: 'Texto del link',
            type: 'string'
          },
          href: {
            title: 'URL',
            description: 'Link de destino',
            type: 'string'
          },
          icon: {
            title: 'Icono',
            description: 'URL del icono (opcional)',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader'
            }
          },
          ariaLabel: {
            title: 'Aria Label',
            description: 'Etiqueta de accesibilidad',
            type: 'string'
          }
        },
        required: ['href']
      },
      default: [
        {
          id: 'stores',
          label: 'Ver sucursales',
          href: '/sucursales',
          icon: 'https://mundooutdoorar.vteximg.com.br/arquivos/icono_ubicacion.png',
          ariaLabel: 'Ver sucursales'
        },
        {
          id: 'shipping',
          label: 'Envíos',
          href: '/institucional/envios',
          icon: 'https://mundooutdoorar.vteximg.com.br/arquivos/icono_camion.png',
          ariaLabel: 'Información de envíos'
        },
        {
          id: 'account',
          label: 'Mi cuenta',
          href: '/account',
          icon: 'https://mundooutdoorar.vteximg.com.br/arquivos/icono_usuario.png',
          ariaLabel: 'Mi cuenta'
        }
      ]
    }
  }
}

export default UtilityBarRight
