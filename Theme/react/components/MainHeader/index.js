import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import styles from './index.css'
import menuData from './menuData.json'

const MainHeader = ({ logo, searchPlaceholder }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [openMobileDept, setOpenMobileDept] = useState(null)
  const [openMobileSub, setOpenMobileSub] = useState(null)
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

  useEffect(() => {
    const fixVerTodosLinks = () => {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        return
      }

      const links = document.querySelectorAll(
        '.vtex-store-link-0-x-link--ver-todo-product-slider'
      )

      links.forEach((link) => {
        const originalHref = link.getAttribute('href')

        if (!originalHref) {
          return
        }

        try {
          const url = new URL(originalHref, window.location.origin)

          if (url.host !== window.location.host) {
            const normalizedHref = `${url.pathname}${url.search}${url.hash}`

            link.setAttribute('href', normalizedHref)
          }
        } catch (e) {
          // ignore invalid URLs
        }
      })
    }

    fixVerTodosLinks()

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => {
        fixVerTodosLinks()
      })

      observer.observe(document.body, { childList: true, subtree: true })

      return () => observer.disconnect()
    }

    return undefined
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()

    const trimmed = searchQuery.trim()
    if (!trimmed) return

    const encoded = encodeURIComponent(trimmed)
    // Usar el mismo patrón de búsqueda que la tienda productiva:
    // /termino?_q=termino&map=ft
    window.location.href = `/${encoded}?_q=${encoded}&map=ft`
  }

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((prevOpen) => {
      const nextOpen = !prevOpen
      if (!nextOpen) {
        setOpenMobileDept(null)
        setOpenMobileSub(null)
      }
      return nextOpen
    })
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
          <a href="/sucursales" className={styles.mobileIcon} aria-label="Sucursales">
            <img
              src="https://mundooutdoorar.vtexassets.com/arquivos/iconoblancobubi.png"
              alt="Icono sucursales"
              className={styles.mobileIconImage}
            />
          </a>
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
          onClick={handleToggleMobileMenu}
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
          <div className={styles.mobileMenuHeader}>
            <span className={styles.mobileMenuHeaderTitle}>Menú</span>
            <button
              type="button"
              className={styles.mobileMenuHeaderClose}
              onClick={() => {
                setMobileMenuOpen(false)
                setOpenMobileDept(null)
                setOpenMobileSub(null)
              }}
              aria-label="Cerrar menú"
            >
              ×
            </button>
          </div>

          <div className={styles.mobileMenuSections}>
            {menuData.departments.map((dept) => {
              const isOpen = openMobileDept === dept.id
              const columns = dept.columns || []
              const isBrandsDept = dept.id === 'marcas'
              const brandItems = isBrandsDept
                ? columns.flatMap((column) => column.items || [])
                : []

              return (
                <div key={dept.id} className={styles.mobileMenuSection}>
                  <button
                    type="button"
                    className={styles.mobileMenuSectionHeader}
                    onClick={() => setOpenMobileDept(isOpen ? null : dept.id)}
                  >
                    <span className={styles.mobileMenuSectionLabel}>{dept.label}</span>
                    <span className={styles.mobileMenuSectionIcon}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && columns.length > 0 && (
                    <div className={styles.mobileMenuSectionBody}>
                      {isBrandsDept
                        ? brandItems.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.href}
                              className={
                                item.highlight
                                  ? `${styles.mobileSubmenuItem} ${styles.mobileSubmenuItemHighlight}`
                                  : styles.mobileSubmenuItem
                              }
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setOpenMobileDept(null)
                                setOpenMobileSub(null)
                              }}
                            >
                              {item.label}
                            </a>
                          ))
                        : columns.map((column, columnIdx) => {
                            const subId = `${dept.id}-${columnIdx}`
                            const isSubOpen = openMobileSub === subId
                            const items = column.items || []

                            return (
                              <div key={subId} className={styles.mobileSubsection}>
                                <button
                                  type="button"
                                  className={styles.mobileSubsectionHeader}
                                  onClick={() =>
                                    setOpenMobileSub(isSubOpen ? null : subId)
                                  }
                                >
                                  <span className={styles.mobileSubsectionLabel}>
                                    {column.title}
                                  </span>
                                  <span className={styles.mobileSubsectionIconDark}>
                                    {isSubOpen ? '−' : '+'}
                                  </span>
                                </button>

                                {isSubOpen && items.length > 0 && (
                                  <div className={styles.mobileSubsectionItems}>
                                    {items.map((item, idx) => (
                                      <a
                                        key={idx}
                                        href={item.href}
                                        className={
                                          item.highlight
                                            ? `${styles.mobileSubmenuItem} ${styles.mobileSubmenuItemHighlight}`
                                            : styles.mobileSubmenuItem
                                        }
                                        onClick={() => {
                                          setMobileMenuOpen(false)
                                          setOpenMobileDept(null)
                                          setOpenMobileSub(null)
                                        }}
                                      >
                                        {item.label}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
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
