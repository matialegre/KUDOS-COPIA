# MainHeader - Panel de Control del Menú

Este componente muestra el header negro con el menú desplegable. Toda la configuración del menú se gestiona desde el archivo `menuData.json`.

## Cómo editar el menú

### 1. Abrir el archivo de configuración
Abrí `Theme/react/components/MainHeader/menuData.json` en tu editor.

### 2. Estructura del JSON

```json
{
  "departments": [
    {
      "id": "hombre",              // ID único (sin espacios, minúsculas)
      "label": "HOMBRE",           // Texto que aparece en el menú
      "href": "/hombre",           // URL de la categoría principal
      "banner": "/arquivos/banner-menu-desplegable.png",  // Imagen del dropdown
      "columns": [                 // Columnas del dropdown
        {
          "title": "Calzado",      // Título de la columna
          "items": [               // Items de la columna
            {
              "label": "Zapatillas",
              "href": "/hombre/calzado/zapatillas"
            },
            {
              "label": "Ver todo",
              "href": "/hombre/calzado",
              "highlight": true    // Link destacado en rojo
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. Agregar una nueva categoría principal

Copiá un departamento existente y modificá:
- `id`: identificador único
- `label`: nombre en mayúsculas
- `href`: URL de la categoría
- `banner`: ruta de la imagen (subila a `/arquivos/` en VTEX)
- `columns`: las columnas con subcategorías

### 4. Agregar una subcategoría

Dentro de `columns`, agregá un nuevo objeto en `items`:

```json
{
  "label": "Nueva Subcategoría",
  "href": "/categoria/subcategoria/nueva-subcategoria"
}
```

### 5. Agregar una columna

Dentro de `columns`, agregá un nuevo objeto:

```json
{
  "title": "Nueva Columna",
  "items": [
    { "label": "Item 1", "href": "/ruta/item-1" },
    { "label": "Item 2", "href": "/ruta/item-2" },
    { "label": "Ver todo", "href": "/ruta", "highlight": true }
  ]
}
```

### 6. Cambiar imágenes del dropdown

1. Subí la imagen a VTEX Admin → CMS → Layout → File Manager
2. Copiá la URL (ej: `/arquivos/mi-banner.png`)
3. Pegala en el campo `banner` del departamento

### 7. Patrón de URLs

Las URLs siguen este formato automático:
- Categoría: `/categoria`
- Subcategoría: `/categoria/subcategoria`
- Item: `/categoria/subcategoria/item`

Ejemplo:
- `/hombre`
- `/hombre/calzado`
- `/hombre/calzado/zapatillas`

### 8. Link "Ver todo" destacado

Para que un link aparezca en rojo (destacado), agregá `"highlight": true`:

```json
{
  "label": "Ver todo",
  "href": "/hombre/calzado",
  "highlight": true
}
```

## Después de editar

1. Guardá el archivo `menuData.json`
2. Ejecutá `vtex link` si no está corriendo
3. Refrescá el navegador con Ctrl+F5

## Notas importantes

- **No uses espacios** en los `id` de departamentos
- **Las URLs deben empezar con `/`**
- **Respetá las comillas dobles** en JSON
- **No olvides las comas** entre elementos (pero no después del último)
- Si el JSON tiene errores, el menú no se mostrará. Revisá la consola del navegador (F12) para ver el error.

## Ejemplo completo de un departamento

```json
{
  "id": "accesorios",
  "label": "ACCESORIOS",
  "href": "/accesorios",
  "banner": "/arquivos/banner-accesorios.png",
  "columns": [
    {
      "title": "Mochilas",
      "items": [
        { "label": "Urbanas", "href": "/accesorios/mochilas/urbanas" },
        { "label": "Trekking", "href": "/accesorios/mochilas/trekking" },
        { "label": "Ver todo", "href": "/accesorios/mochilas", "highlight": true }
      ]
    },
    {
      "title": "Gorros",
      "items": [
        { "label": "Invierno", "href": "/accesorios/gorros/invierno" },
        { "label": "Verano", "href": "/accesorios/gorros/verano" },
        { "label": "Ver todo", "href": "/accesorios/gorros", "highlight": true }
      ]
    }
  ]
}
```
