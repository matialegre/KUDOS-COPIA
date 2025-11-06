# Cambios Realizados en PDP (Product Detail Page)

## Fecha: Noviembre 6, 2025

### Cambios Implementados ✅

#### 1. **Botones de Compra**
- **Archivo**: `Theme/store/blocks/ProductDetailPage/ColumnRight/column-right.jsonc`
  - Botón "Comprar ahora" → **"COMPRAR AHORA!"** (mayúsculas con exclamación)
  - Botón "Añadir al carrito" → **"AÑADIR AL CARRITO"** (mayúsculas)

- **Archivo**: `Theme/styles/css/ProductDetailPage/RightColumn/Childrens/vtex.add-to-cart-button.css` (NUEVO)
  - Botón "COMPRAR AHORA!" con fondo **negro** (#000000)
  - Botón "AÑADIR AL CARRITO" con borde negro y fondo transparente
  - Hover effects en ambos botones
  - Responsive para mobile

#### 2. **Layout de Imágenes**
- **Archivo**: `Theme/store/blocks/ProductDetailPage/ColumnLeft/column-left.jsonc`
  - Cambiado `thumbnailsOrientation` a **"horizontal"**
  - Thumbnails ahora aparecen **arriba** en lugar de a la izquierda

- **Archivo**: `Theme/styles/css/ProductDetailPage/LeftColumn/Childrens/vtex.flex-layout.css`
  - Container de thumbnails: `flex-direction: row`
  - Width: 100% (max 531px)
  - Gap entre thumbnails: 12px
  - Tamaño de cada thumbnail: 100x100px
  - Margin-top: 12px

#### 3. **Cuotas Sin Interés (Verde)**
- **Archivo**: `Theme/store/blocks/ProductDetailPage/ColumnRight/column-right.jsonc`
  - Añadido componente `product-installments` después del precio

- **Archivo**: `Theme/react/components/ProductInstallments/index.css`
  - Color de cuotas cambiado a **verde** (#008042)
  - Formato: "X cuotas sin interés de $XXXX"

#### 4. **Texto de Promociones Bancarias**
- **Archivo**: `Theme/store/blocks/ProductDetailPage/ColumnRight/column-right.jsonc`
  - Texto actualizado a: **"Ver promociones, cuotas y medios de pago"**

#### 5. **Selectores de Talle y Color**
- **Archivo**: `Theme/styles/css/ProductDetailPage/RightColumn/Childrens/vtex.store-components-sku.css` (NUEVO)
  - Items de talle reducidos a **42x42px** (desktop) y **38x38px** (mobile)
  - Items de color: **36x36px** (redondos)
  - Font-size reducido a 12px
  - Gap entre items: 8px
  - Bordes y estados hover/selected definidos

---

### Cambios NO Implementados (Requieren Desarrollo Custom) ⚠️

Los siguientes cambios requieren crear componentes React personalizados o modificar significativamente la estructura de VTEX:

#### 1. **Mensaje "Tu talle está agotado?"**
- Texto: "Tu talle esta agotado? Avisame cuando hay stock" (en azul)
- **Requiere**: Custom React component con lógica de notificación de stock
- **Recomendación**: Usar `vtex.availability-notify` app o crear custom component

#### 2. **Tienda Oficial con Link a Marca**
- Texto: "Tienda oficial: [marca] + link a web de la marca"
- **Requiere**: Custom component que extraiga info de marca y sus URLs
- **Recomendación**: Crear `BrandInfo` component que consulte metadatos de marca

#### 3. **Mensaje de Colores No Disponibles**
- Texto: "Colores: no colores disponibles"
- **Requiere**: Modificar lógica del SKU selector
- **Recomendación**: Custom override del `sku-selector` component

#### 4. **Iconos/Mensajes de Retiro y Envío**
- "Retiro por una sucursal - selecciona talle"
- "Envío a domicilio - selecciona talle"
- **Requiere**: Custom shipping info component
- **Recomendación**: Extender `shipping-simulator` o crear custom component

#### 5. **Cálculo de Código Postal**
- "Código postal - calcular envío"
- **Nota**: Ya existe `shipping-simulator` en el PDP
- **Verificar**: Si está visible y funcional en la UI

---

## Archivos Modificados

### Bloques JSONC
1. `Theme/store/blocks/ProductDetailPage/ColumnRight/column-right.jsonc`
2. `Theme/store/blocks/ProductDetailPage/ColumnLeft/column-left.jsonc`

### CSS Nuevos
1. `Theme/styles/css/ProductDetailPage/RightColumn/Childrens/vtex.add-to-cart-button.css`
2. `Theme/styles/css/ProductDetailPage/RightColumn/Childrens/vtex.store-components-sku.css`

### CSS Modificados
1. `Theme/react/components/ProductInstallments/index.css`
2. `Theme/styles/css/ProductDetailPage/LeftColumn/Childrens/vtex.flex-layout.css`

---

## Testing Checklist

- [ ] Verificar que botones muestran textos correctos en mayúsculas
- [ ] Verificar que "COMPRAR AHORA!" tiene fondo negro
- [ ] Verificar que thumbnails aparecen arriba (horizontal)
- [ ] Verificar que cuotas aparecen en verde
- [ ] Verificar tamaño de selectores de talle (más chicos)
- [ ] Verificar texto "Ver promociones, cuotas y medios de pago"
- [ ] Test en mobile para responsive
- [ ] Verificar `shipping-simulator` está visible

---

## Próximos Pasos Recomendados

1. **Crear componentes custom** para funcionalidades pendientes
2. **Revisar apps de VTEX** disponibles para notificaciones de stock
3. **Configurar brand metadata** para mostrar info oficial de marcas
4. **Testear en workspace** devmati antes de production
5. **Hard refresh** después de `vtex link` para ver cambios CSS

---

## Notas Técnicas

- Los cambios son compatibles con VTEX IO Store Framework
- CSS usa selectores globales de VTEX components
- Responsive design incluido para mobile (max-width: 640px)
- Font family: 'Gotham' (ya definida en proyecto)
- Colores: Negro #000000, Verde #008042, Azul marca #09344D
