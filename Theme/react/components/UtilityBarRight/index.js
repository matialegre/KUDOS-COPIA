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

export default UtilityBarRight
