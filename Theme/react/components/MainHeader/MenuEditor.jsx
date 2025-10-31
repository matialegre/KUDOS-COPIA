import React, { useState, useEffect } from 'react'
import menuData from './menuData.json'
import styles from './MenuEditor.css'

const MenuEditor = () => {
  const [data, setData] = useState(menuData)
  const [activeTab, setActiveTab] = useState('hombre')
  const [showCopyButton, setShowCopyButton] = useState(false)

  const handleDepartmentChange = (deptId, field, value) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dept =>
        dept.id === deptId ? { ...dept, [field]: value } : dept
      )
    }))
  }

  const handleColumnChange = (deptId, colIdx, field, value) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dept =>
        dept.id === deptId
          ? {
              ...dept,
              columns: dept.columns.map((col, idx) =>
                idx === colIdx ? { ...col, [field]: value } : col
              )
            }
          : dept
      )
    }))
  }

  const handleItemChange = (deptId, colIdx, itemIdx, field, value) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dept =>
        dept.id === deptId
          ? {
              ...dept,
              columns: dept.columns.map((col, cIdx) =>
                cIdx === colIdx
                  ? {
                      ...col,
                      items: col.items.map((item, iIdx) =>
                        iIdx === itemIdx ? { ...item, [field]: value } : item
                      )
                    }
                  : col
              )
            }
          : dept
      )
    }))
  }

  const addColumn = (deptId) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dept =>
        dept.id === deptId
          ? {
              ...dept,
              columns: [
                ...dept.columns,
                {
                  title: 'Nueva Columna',
                  items: [
                    { label: 'Nuevo Item', href: `/${deptId}/nueva-columna/nuevo-item` }
                  ]
                }
              ]
            }
          : dept
      )
    }))
  }

  const addItem = (deptId, colIdx) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dept =>
        dept.id === deptId
          ? {
              ...dept,
              columns: dept.columns.map((col, cIdx) =>
                cIdx === colIdx
                  ? {
                      ...col,
                      items: [
                        ...col.items,
                        { label: 'Nuevo Item', href: `/${deptId}/columna/nuevo-item` }
                      ]
                    }
                  : col
              )
            }
          : dept
      )
    }))
  }

  const deleteColumn = (deptId, colIdx) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dept =>
        dept.id === deptId
          ? {
              ...dept,
              columns: dept.columns.filter((_, idx) => idx !== colIdx)
            }
          : dept
      )
    }))
  }

  const deleteItem = (deptId, colIdx, itemIdx) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dept =>
        dept.id === deptId
          ? {
              ...dept,
              columns: dept.columns.map((col, cIdx) =>
                cIdx === colIdx
                  ? {
                      ...col,
                      items: col.items.filter((_, iIdx) => iIdx !== itemIdx)
                    }
                  : col
              )
            }
          : dept
      )
    }))
  }

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      setShowCopyButton(true)
      setTimeout(() => setShowCopyButton(false), 2000)
    })
  }

  const activeDept = data.departments.find(d => d.id === activeTab)

  return (
    <div className={styles.editorContainer}>
      <div className={styles.header}>
        <h1>Editor de Menú - MainHeader</h1>
        <button onClick={copyToClipboard} className={styles.copyButton}>
          {showCopyButton ? '✓ Copiado!' : '📋 Copiar JSON'}
        </button>
      </div>

      <div className={styles.tabs}>
        {data.departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => setActiveTab(dept.id)}
            className={activeTab === dept.id ? styles.tabActive : styles.tab}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {activeDept && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Configuración General</h2>
            <div className={styles.field}>
              <label>Etiqueta del menú:</label>
              <input
                type="text"
                value={activeDept.label}
                onChange={(e) => handleDepartmentChange(activeDept.id, 'label', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>URL principal:</label>
              <input
                type="text"
                value={activeDept.href}
                onChange={(e) => handleDepartmentChange(activeDept.id, 'href', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Banner (URL de imagen):</label>
              <input
                type="text"
                value={activeDept.banner}
                onChange={(e) => handleDepartmentChange(activeDept.id, 'banner', e.target.value)}
                placeholder="/arquivos/banner-menu-desplegable.png"
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Columnas del Dropdown</h2>
              <button onClick={() => addColumn(activeDept.id)} className={styles.addButton}>
                + Agregar Columna
              </button>
            </div>

            {activeDept.columns.map((column, colIdx) => (
              <div key={colIdx} className={styles.column}>
                <div className={styles.columnHeader}>
                  <input
                    type="text"
                    value={column.title}
                    onChange={(e) => handleColumnChange(activeDept.id, colIdx, 'title', e.target.value)}
                    className={styles.columnTitle}
                  />
                  <button
                    onClick={() => deleteColumn(activeDept.id, colIdx)}
                    className={styles.deleteButton}
                  >
                    🗑️ Eliminar Columna
                  </button>
                </div>

                <div className={styles.items}>
                  {column.items.map((item, itemIdx) => (
                    <div key={itemIdx} className={styles.item}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          handleItemChange(activeDept.id, colIdx, itemIdx, 'label', e.target.value)
                        }
                        placeholder="Etiqueta"
                        className={styles.itemLabel}
                      />
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) =>
                          handleItemChange(activeDept.id, colIdx, itemIdx, 'href', e.target.value)
                        }
                        placeholder="/categoria/subcategoria"
                        className={styles.itemHref}
                      />
                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={item.highlight || false}
                          onChange={(e) =>
                            handleItemChange(activeDept.id, colIdx, itemIdx, 'highlight', e.target.checked)
                          }
                        />
                        Destacado
                      </label>
                      <button
                        onClick={() => deleteItem(activeDept.id, colIdx, itemIdx)}
                        className={styles.deleteItemButton}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addItem(activeDept.id, colIdx)}
                    className={styles.addItemButton}
                  >
                    + Agregar Item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.instructions}>
            <h3>📝 Instrucciones</h3>
            <ol>
              <li>Editá los campos directamente en el panel</li>
              <li>Hacé clic en "Copiar JSON" cuando termines</li>
              <li>Abrí <code>Theme/react/components/MainHeader/menuData.json</code></li>
              <li>Reemplazá todo el contenido con el JSON copiado</li>
              <li>Guardá el archivo y refrescá con Ctrl+F5</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuEditor
