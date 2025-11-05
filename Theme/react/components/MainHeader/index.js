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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="/checkout/#/cart" className={styles.mobileIcon} aria-label="Carrito">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2L7 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 6L15 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 6H22V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
