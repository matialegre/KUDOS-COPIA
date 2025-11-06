# SKU Selector Layout Cheatsheet

> Recordatorio rápido para ajustar la posición de los selectores y el botón "Comprar" en desktop y mobile.

## 1. Archivo principal
- **Ruta:** `Theme/styles/css/ProductBox/vtex.flex-layout.css`
- Usa comentarios para ubicar cada sección con `Ctrl+F`:
  - `/* DESKTOP SKU SELECTOR POSITION */`
  - `/* MOBILE CUSTOM LAYOUT */`

### Desktop (sin media queries)
- `flexRow--sku-selector-talles-container`: controla la fila de talles. `bottom: 0;` deja el bloque pegado al borde inferior del contenedor.
- `flexRowContent--sku-selector-color-container`: solo necesita `margin-top: 14px;` para mantener el espaciado vertical.
- **Visibilidad:** En desktop se muestra al hacer hover. El comportamiento está en `Theme/styles/css/ProductBox/vtex.product-summary.css` (ver sección "Hover" más abajo).

### Mobile (`@media (max-width: 640px)`)
- `flexRow--sku-selector-talles-container`: establece `bottom: 40px; visibility/opacity: 1;` para que la fila de talles quede arriba del botón.
- `flexRow--sku-selector-color-container`: posición absoluta con `bottom: 7px;` y `padding: 0 12px;` para centrar las miniaturas encima del botón.
- `flexRowContent--sku-selector-*`: mismas posiciones que los contenedores padre (`bottom: 40px;` para talles y `bottom: 7px;` para colores) + `gap` para el espaciado entre items.
- Ajusta `margin-bottom` y `padding-bottom` dentro del mismo bloque si necesitás más aire entre variantes y botón.

## 2. Botón "Comprar" custom
- **Ruta:** `Theme/react/components/SelectSkuInProductBox/index.css`
- `buttonAddToCartCustom`:
  - Desktop: permanece con `position: absolute; bottom: 0; left: 0; width: 285px;` (pegado al borde inferior).
  - Mobile (`@media (max-width: 640px)`): cambia a `position: relative; margin: 12px auto 0; width: 170px;` para quedar justo debajo de las miniaturas.

## 3. Visibilidad en desktop
- **Ruta:** `Theme/styles/css/ProductBox/vtex.product-summary.css`
- El hover muestra selectors + botón:
  ```css
  .element:hover :global(.vtex-flex-layout-0-x-flexRow--sku-selector-talles-container){
      visibility: visible;
      opacity: 1;
  }
  .element:hover :global(.vtex-button-add-to-cart-custom){
      visibility: visible;
      opacity: 1;
  }
  ```
- Si querés que estén siempre visibles en desktop, reemplazá el `:hover` por reglas directas (`.element :global(...)`).

## 4. Flujo recomendado para futuros cambios
1. **Desktop primero:** edita fuera del `@media` en `vtex.flex-layout.css`. Ajustá sólo `bottom` y márgenes para que la posición original no se pierda.
2. **Mobile después:** actualiza valores dentro de `/* MOBILE CUSTOM LAYOUT */` asegurándote de no modificar lo de desktop.
3. **Botón mobile:** si necesitás más espacio, modifica `margin-top` dentro del `@media` en `SelectSkuInProductBox/index.css`.
4. **Prueba rápida:**
   - Desktop: hover sobre la card para confirmar que el selector aparece.
   - Mobile: usar el inspector en modo responsive (max-width <= 640px) para confirmar que las miniaturas quedan encima del botón.

> Nota: Si es necesario volver al estado "original" que andaba perfecto, comparar con el respaldo `mundo-outdoor-io ANDA BIEN PRIMERO` y copiar las mismas secciones.
