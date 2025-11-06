import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import styles from './index.css'
import menuData from './menuData.json'

const MainHeader = ({ logo, searchPlaceholder }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const closeTimeoutRef = useRef(null)

  const handleOpenDropdown = (id) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    setActiveDropdown(id)
  }

  const handleCloseDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }

    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <a href="/" className={styles.logoLink}>
          <img
            src={logo || 'https://mundooutdoorar.vteximg.com.br/arquivos/logo_izq_arriba.png'}
            alt="Mundo Outdoor"
            className={styles.logo}
          />
        </a>

        {/* Desktop Menu */}
        <nav className={styles.desktopMenu}>
          {menuData.departments.map((dept) => (
            <div
              key={dept.id}
              className={styles.menuItemWrapper}
              onMouseEnter={() => handleOpenDropdown(dept.id)}
              onMouseLeave={handleCloseDropdown}
            >
              <a
                href={dept.href}
                className={styles.menuItem}
              >
                {dept.label}
              </a>
              {activeDropdown === dept.id && (
                <div
                  className={styles.dropdown}
                  onMouseEnter={() => handleOpenDropdown(dept.id)}
                  onMouseLeave={handleCloseDropdown}
                >
                  <div className={styles.dropdownContent}>
                    <div className={styles.dropdownColumns}>
                      {dept.columns.map((column, idx) => (
                        <div key={idx} className={styles.dropdownColumn}>
                          <h4 className={styles.columnTitle}>{column.title}</h4>
                          <ul className={styles.columnList}>
                            {column.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <a
                                  href={item.href}
                                  className={item.highlight ? styles.highlightLink : styles.columnLink}
                                >
                                  {item.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {dept.banner && (
                      <div className={styles.dropdownBanner}>
                        <img src={dept.banner} alt={dept.label} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder={searchPlaceholder || 'Buscar'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>

        {/* Mobile Icons */}
        <div className={styles.mobileIcons}>
          <a href="/account" className={styles.mobileIcon} aria-label="Mi cuenta">
            <img
              src="https://mundooutdoorar.vtexassets.com/arquivos/usuarioblanco.png"
              alt="Icono Mi cuenta"
              className={styles.mobileIconImage}
            />
          </a>
          <a href="/checkout/#/cart" className={`${styles.mobileIcon} ${styles.cartIcon}`} aria-label="Carrito">
            <img
              src="https://mundooutdoorar.vtexassets.com/arquivos/carritoblanco.png"
              alt="Icono Carrito"
              className={styles.mobileIconImage}
            />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className={styles.mobileMenu}>
          {menuData.departments.map((dept) => (
            <a
              key={dept.id}
              href={dept.href}
              className={styles.mobileMenuItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              {dept.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

MainHeader.propTypes = {
  logo: PropTypes.string,
  searchPlaceholder: PropTypes.string,
}

MainHeader.defaultProps = {
  logo: 'https://mundooutdoorar.vteximg.com.br/arquivos/logo_izq_arriba.png',
  searchPlaceholder: 'Buscar',
}

MainHeader.schema = {
  title: 'Main Header',
  description: 'Header principal con menú y búsqueda',
  type: 'object',
  properties: {
    logo: {
      title: 'Logo URL',
      description: 'URL del logo del sitio',
      type: 'string',
      default: 'https://mundooutdoorar.vteximg.com.br/arquivos/logo_izq_arriba.png',
      widget: {
        'ui:widget': 'image-uploader'
      }
    },
    searchPlaceholder: {
      title: 'Placeholder de Búsqueda',
      description: 'Texto placeholder del buscador',
      type: 'string',
      default: 'Buscar'
    }
  }
}

export default MainHeader
