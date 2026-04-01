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
  const [suggestions, setSuggestions] = useState([])
  const [categorySuggestions, setCategorySuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
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

  // Autocomplete de búsqueda simple usando la API de catálogo de VTEX
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const trimmed = (searchQuery || '').trim()

    // Si no hay nada escrito, limpiamos todo y cerramos el panel
    if (!trimmed) {
      setSuggestions([])
      setCategorySuggestions([])
      setShowSuggestions(false)
      setIsLoadingSuggestions(false)
      return
    }

    // Con menos de 2 letras no llamamos a la API, solo mostramos un mensaje guía
    if (trimmed.length < 2) {
      setSuggestions([])
      setCategorySuggestions([])
      setIsLoadingSuggestions(false)
      setShowSuggestions(true)
      return
    }

    let cancelled = false

    setIsLoadingSuggestions(true)
    setShowSuggestions(true)

    const timeoutId = setTimeout(async () => {
      try {
        const encoded = encodeURIComponent(trimmed)
        const response = await fetch(
          `/api/catalog_system/pub/products/search?ft=${encoded}&_from=0&_to=19`
        )

        if (!response.ok) {
          if (!cancelled) {
            setIsLoadingSuggestions(false)
            setSuggestions([])
          }

          return
        }

        const data = await response.json()

        if (cancelled) return

        let mapped = []
        const categoryMap = new Map()

        const addSuggestionTerm = (rawTerm) => {
          const term = (rawTerm || '').trim()
          if (!term) return

          const key = term.toLowerCase()
          const current = categoryMap.get(key) || {
            term,
            count: 0,
          }

          current.count += 1
          categoryMap.set(key, current)
        }

        if (Array.isArray(data)) {
          const queryLower = trimmed.toLowerCase()

          mapped = data
            .map((product) => {
              const firstSku = product.items && product.items[0]
              const firstImage =
                firstSku &&
                firstSku.images &&
                firstSku.images[0] &&
                firstSku.images[0].imageUrl

              const offer =
                firstSku &&
                firstSku.sellers &&
                firstSku.sellers[0] &&
                firstSku.sellers[0].commertialOffer

              const brand = product.brand || product.brandName || ''
              const brandLower = brand ? brand.toLowerCase() : ''

              // Tomar la última categoría del árbol para usarla como sugerencia
              let suggestionName = ''

              if (product.categoryTree && product.categoryTree.length) {
                const leaf = product.categoryTree[product.categoryTree.length - 1]

                suggestionName =
                  (leaf && (leaf.name || leaf.Label || leaf.labelValue)) || ''
              }

              if (!suggestionName && product.categories && product.categories.length) {
                const lastPath = product.categories[product.categories.length - 1]

                if (typeof lastPath === 'string') {
                  const parts = lastPath.split('/').filter(Boolean)

                  suggestionName = parts[parts.length - 1] || ''
                }
              }

              if (suggestionName) {
                addSuggestionTerm(suggestionName)
              }

              // También tomar palabras del nombre del producto que empiecen con el término buscado
              if (product.productName) {
                const words = product.productName.split(/\s+/)

                words.forEach((word) => {
                  const clean = word
                    .replace(/[^0-9A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '')
                    .trim()

                  if (!clean || clean.length < 3) return

                  const lower = clean.toLowerCase()

                  if (!lower.startsWith(queryLower)) return

                  if (brandLower && lower === brandLower) return

                  addSuggestionTerm(clean)
                })
              }

              return {
                id: product.productId || product.productId,
                name: product.productName || '',
                brand,
                link: product.linkText
                  ? `/${product.linkText}/p`
                  : product.link || '#',
                image: firstImage,
                price:
                  offer && typeof offer.Price === 'number'
                    ? offer.Price
                    : null,
              }
            })
            .filter((item) => item.link && item.name)
        }

        const categorySuggestionsArray = Array.from(categoryMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)

        setSuggestions(mapped)
        setCategorySuggestions(categorySuggestionsArray)
        setIsLoadingSuggestions(false)
        setShowSuggestions(true)
      } catch (e) {
        if (!cancelled) {
          setIsLoadingSuggestions(false)
          setSuggestions([])
          setCategorySuggestions([])
        }
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()

    const trimmed = searchQuery.trim()
    if (!trimmed) return

    const encoded = encodeURIComponent(trimmed)
    // Usar el mismo patrón de búsqueda que la tienda productiva:
    // /termino?_q=termino&map=ft
    setShowSuggestions(false)
    window.location.href = `/${encoded}?_q=${encoded}&map=ft`
  }

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((prevOpen) => {
      const nextOpen = !prevOpen
      if (!nextOpen) {
        setOpenMobileDept(null)
        setOpenMobileSub(null)
      }
      if (nextOpen) {
        setIsMobileSearchOpen(false)
        setSearchQuery('')
        setSuggestions([])
        setCategorySuggestions([])
        setShowSuggestions(false)
        setIsLoadingSuggestions(false)
      }
      return nextOpen
    })
  }

  const handleToggleMobileSearch = () => {
    setIsMobileSearchOpen((prevOpen) => {
      const nextOpen = !prevOpen

      if (!nextOpen) {
        setSearchQuery('')
        setSuggestions([])
        setCategorySuggestions([])
        setShowSuggestions(false)
        setIsLoadingSuggestions(false)
      }

      return nextOpen
    })
  }

  const formatPrice = (value) => {
    if (typeof value !== 'number') return null

    try {
      return value.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
      })
    } catch (e) {
      const rounded = Math.round(value)
      return `$ ${rounded.toLocaleString('es-AR')}`
    }
  }

  const trimmedQueryForUrl = (searchQuery || '').trim()
  const encodedQueryForUrl = trimmedQueryForUrl
    ? encodeURIComponent(trimmedQueryForUrl)
    : ''

  const headerClassNames = `${styles.mainHeader} ${
    isMobileSearchOpen ? styles.mainHeaderMobileSearchOpen : ''
  }`

  return (
    <header className={headerClassNames}>
      <div className={styles.headerContainer}>
        {/* Botón de búsqueda mobile (lupita) */}
        <button
          type="button"
          className={styles.mobileSearchButton}
          aria-label="Buscar"
          onClick={handleToggleMobileSearch}
        >
          <img
            src="https://mundooutdoorar.vtexassets.com/arquivos/LUPABLANCA.PNG"
            alt="Buscar"
            className={styles.mobileSearchIconImage}
          />
        </button>

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
          {menuData.departments.map((dept) => {
            const hasDropdown = Array.isArray(dept.columns) && dept.columns.length > 0

            return (
            <div
              key={dept.id}
              className={styles.menuItemWrapper}
              onMouseEnter={hasDropdown ? () => handleOpenDropdown(dept.id) : undefined}
              onMouseLeave={hasDropdown ? handleCloseDropdown : undefined}
            >
              <a
                href={dept.href}
                className={styles.menuItem}
              >
                {dept.label}
              </a>
              {hasDropdown && activeDropdown === dept.id && (
                <div
                  className={`${styles.dropdown} ${styles['dropdown_' + dept.id] || ''}`}
                  onMouseEnter={() => handleOpenDropdown(dept.id)}
                  onMouseLeave={handleCloseDropdown}
                >
                  <div className={`${styles.dropdownContent} ${styles['dropdownContent_' + dept.id] || ''}`}>
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
                      <div className={`${styles.dropdownBanner} ${styles['dropdownBanner_' + dept.id] || ''}`}>
                        <img src={dept.banner} alt={dept.label} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            )
          })}
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

      {isMobileSearchOpen && (
        <div className={styles.mobileSearchBar}>
          <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
            <input
              type="text"
              placeholder={searchPlaceholder || 'Buscar'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.mobileSearchInput}
            />
          </form>
        </div>
      )}

      {/* Sugerencias de búsqueda (desktop) */}
      {showSuggestions && (
          <div className={styles.searchSuggestions}>
            <div className={styles.searchSuggestionsColumns}>
              {/* Columna izquierda: Sugerencias */}
              <div className={styles.searchSuggestionsLeft}>
                <div className={styles.searchSuggestionsSectionHeader}>
                  <span className={styles.searchSuggestionsSectionTitle}>
                    Sugerencias
                  </span>
                </div>

                {isLoadingSuggestions && (
                  <div className={styles.searchSuggestionsTermsLoading}>
                    {[0, 1, 2].map((idx) => (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={idx}
                        className={styles.searchSuggestionsLoadingLine}
                        style={{ width: idx === 0 ? '80%' : '60%' }}
                      />
                    ))}
                  </div>
                )}

                {!isLoadingSuggestions && categorySuggestions.length > 0 && (
                  <ul className={styles.searchSuggestionsTermList}>
                    {categorySuggestions.map((item) => {
                      const term = item.term || ''
                      const key = term.toLowerCase()

                      if (!term) {
                        return null
                      }

                      const encodedTerm = encodeURIComponent(term)

                      return (
                        <li
                          key={key}
                          className={styles.searchSuggestionsTermItem}
                        >
                          <a
                            href={`/${encodedTerm}?_q=${encodedTerm}&map=ft`}
                            className={styles.searchSuggestionsTermLink}
                            onClick={() => setShowSuggestions(false)}
                          >
                            <span className={styles.searchSuggestionsTermLabel}>
                              {term}
                            </span>
                            {typeof item.count === 'number' && (
                              <span className={styles.searchSuggestionsTermCount}>
                                {item.count}
                              </span>
                            )}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {!isLoadingSuggestions &&
                  categorySuggestions.length === 0 &&
                  trimmedQueryForUrl && (
                    <div className={styles.searchSuggestionsEmpty}>
                      Sin sugerencias para “{trimmedQueryForUrl}”.
                    </div>
                  )}

                {!isLoadingSuggestions &&
                  trimmedQueryForUrl &&
                  encodedQueryForUrl && (
                    <a
                      href={`/${encodedQueryForUrl}?_q=${encodedQueryForUrl}&map=ft`}
                      className={styles.searchSuggestionsSeeAll}
                      onClick={() => setShowSuggestions(false)}
                    >
                      Ver todos los resultados para{' '}
                      <span className={styles.searchSuggestionsSeeAllQuery}>
                        “{trimmedQueryForUrl}”
                      </span>
                    </a>
                  )}
              </div>

              {/* Columna derecha: Productos */}
              <div className={styles.searchSuggestionsRight}>
                <div className={styles.searchSuggestionsSectionHeader}>
                  <span className={styles.searchSuggestionsSectionTitle}>
                    Productos
                  </span>
                </div>

                {isLoadingSuggestions && (
                  <div className={styles.searchSuggestionsLoading}>
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={idx}
                        className={styles.searchSuggestionsLoadingRow}
                      >
                        <div
                          className={styles.searchSuggestionsLoadingThumbnail}
                        />
                        <div className={styles.searchSuggestionsLoadingText}>
                          <div
                            className={styles.searchSuggestionsLoadingLine}
                          />
                          <div
                            className={styles.searchSuggestionsLoadingLine}
                            style={{ width: '60%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoadingSuggestions && suggestions.length > 0 && (
                  <ul className={styles.searchSuggestionsList}>
                    {suggestions.map((item) => (
                      <li
                        key={item.id || item.link}
                        className={styles.searchSuggestionItem}
                      >
                        <a
                          href={item.link}
                          className={styles.searchSuggestionLink}
                          onClick={() => setShowSuggestions(false)}
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className={styles.searchSuggestionImage}
                            />
                          )}
                          <div className={styles.searchSuggestionInfo}>
                            {item.brand && (
                              <span className={styles.searchSuggestionBrand}>
                                {item.brand}
                              </span>
                            )}
                            <span className={styles.searchSuggestionName}>
                              {item.name}
                            </span>
                            {item.price != null && (
                              <span className={styles.searchSuggestionPrice}>
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {!isLoadingSuggestions &&
                  suggestions.length === 0 &&
                  trimmedQueryForUrl && (
                    <div className={styles.searchSuggestionsEmpty}>
                      No encontramos resultados para “{trimmedQueryForUrl}”.
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

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
              const hasColumns = columns.length > 0
              const isBrandsDept = dept.id === 'marcas'
              const brandItems = isBrandsDept
                ? columns.flatMap((column) => column.items || [])
                : []

              return (
                <div key={dept.id} className={styles.mobileMenuSection}>
                  {hasColumns ? (
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
                  ) : (
                    <a
                      href={dept.href}
                      className={styles.mobileMenuSectionLink}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setOpenMobileDept(null)
                        setOpenMobileSub(null)
                      }}
                    >
                      <span className={styles.mobileMenuSectionLabel}>{dept.label}</span>
                    </a>
                  )}

                  {isOpen && hasColumns && (
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
