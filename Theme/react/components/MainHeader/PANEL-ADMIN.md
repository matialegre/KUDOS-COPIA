# 🎛️ Panel de Administración del Menú

## Acceso al Panel

Una vez que hagas `vtex link`, accedé al panel desde tu navegador:

```
https://TUWORKSPACE--mundooutdoorar.myvtex.com/admin/menu-editor
```

Reemplazá `TUWORKSPACE` por tu workspace actual (ej: `devmati`).

## Cómo usar el Panel

### 1. Seleccionar categoría
Hacé clic en las pestañas superiores (HOMBRE, MUJER, NIÑOS, MARCAS, CAMPING) para editar cada sección.

### 2. Editar configuración general
- **Etiqueta del menú**: El texto que aparece en el header negro
- **URL principal**: La ruta cuando se hace clic en la categoría
- **Banner**: URL de la imagen que aparece en el dropdown (ej: `/arquivos/banner-menu-desplegable.png`)

### 3. Gestionar columnas
- **Agregar Columna**: Botón verde para crear una nueva columna en el dropdown
- **Eliminar Columna**: Botón rojo en cada columna para borrarla
- **Título de columna**: Editá el nombre directamente en el campo

### 4. Gestionar items
Cada columna tiene una lista de items (subcategorías):
- **Etiqueta**: Texto que se muestra (ej: "Zapatillas")
- **URL**: Ruta del link (ej: `/hombre/calzado/zapatillas`)
- **Destacado**: Checkbox para marcar el link en rojo (típicamente "Ver todo")
- **✕**: Botón para eliminar el item
- **+ Agregar Item**: Botón verde para agregar un nuevo item a la columna

### 5. Guardar cambios

**IMPORTANTE**: El panel NO guarda automáticamente. Seguí estos pasos:

1. Hacé todos los cambios que necesites en el panel
2. Hacé clic en **"📋 Copiar JSON"** (arriba a la derecha)
3. Abrí el archivo `Theme/react/components/MainHeader/menuData.json` en tu editor
4. Seleccioná todo el contenido (Ctrl+A) y borralo
5. Pegá el JSON copiado (Ctrl+V)
6. Guardá el archivo (Ctrl+S)
7. Refrescá el navegador con **Ctrl+F5**

## Ejemplo de flujo completo

1. Entrás al panel: `https://devmati--mundooutdoorar.myvtex.com/admin/menu-editor`
2. Seleccionás la pestaña **HOMBRE**
3. Hacés clic en **"+ Agregar Columna"**
4. Cambiás el título de la columna a "Nuevos Productos"
5. Hacés clic en **"+ Agregar Item"**
6. Editás el item:
   - Etiqueta: "Lanzamientos"
   - URL: `/hombre/lanzamientos`
   - Destacado: ✓
7. Hacés clic en **"📋 Copiar JSON"**
8. Abrís `menuData.json` y reemplazás el contenido
9. Guardás y refrescás con Ctrl+F5

## Tips

- **URLs consistentes**: Seguí el patrón `/categoria/subcategoria/item`
- **Banners**: Subí las imágenes a VTEX Admin → CMS → File Manager primero
- **Ver todo**: Siempre marcá el último item de cada columna como "Destacado"
- **Backup**: Antes de hacer cambios grandes, copiá el JSON actual como respaldo

## Solución de problemas

### El panel no carga
- Verificá que hiciste `vtex link` correctamente
- Revisá la consola del navegador (F12) para ver errores

### Los cambios no se ven
- Asegúrate de haber copiado el JSON y guardado `menuData.json`
- Refrescá con Ctrl+F5 (no solo F5)
- Verificá que el JSON no tenga errores de sintaxis

### El menú desapareció
- Revisá que el archivo `menuData.json` tenga contenido válido
- Restaurá desde el backup si lo hiciste
- Revisá la consola del navegador para ver el error específico
