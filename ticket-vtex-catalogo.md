# Ticket de Soporte VTEX — Error en Catalog Facelift

## Cuenta
mundooutdoorar

## Fecha de inicio del problema
25 de marzo de 2026 (aproximadamente)

## Descripción del problema

No es posible crear productos nuevos ni editar productos existentes desde el nuevo catálogo (catalog-facelift). El formulario de producto muestra el mensaje **"No se pudo guardar este producto. Comprueba la información ingresada y vuelve a intentarlo"**, incluso cuando todos los campos obligatorios están correctamente completados.

El catálogo viejo (`/admin/Site/ProdutoForm.aspx`) devuelve error **404**, por lo que **no tenemos ninguna forma alternativa de gestionar productos**.

---

## Errores observados en consola del navegador

### 1. Al CREAR un producto nuevo (POST) — Error 422

```
POST https://catalog-facelift.admin.vtex.com/api/proxy/catalog/pvt/admin/form/product?an=mundooutdoorar
Status: 422 (Unprocessable Content)
```

Se completaron TODOS los campos obligatorios:
- Nombre: "prueba mati 26/3"
- Marca: ALPINE SKATE (ID 2000063)
- Categoría: ACTIVIDAD (ID 317)
- Política comercial: 1 - Principal
- URL del producto: prueba-mati-26-3
- Título SEO: prueba-mati
- Metadescripción: completada
- Categoría global: Alimentación, bebida y tabaco
- Producto activo: Sí

### 2. Al EDITAR un producto existente (PUT) — Error 500

```
PUT https://catalog-facelift.admin.vtex.com/api/proxy/catalog/pvt/admin/form/product/91818?an=mundooutdoorar
Status: 500 (Internal Server Error)
```

El producto "Pantalón de niños Briskan" (ID 91818) existía previamente y funcionaba correctamente. Ahora al intentar guardar cualquier cambio devuelve error 500.

### 3. Errores adicionales de postMessage

```
Failed to execute 'postMessage' on 'DOMWindow': The target origin provided
('https://catalog-facelift.admin.vtex.com') does not match the recipient
window's origin ('https://mundooutdoorar.myvtex.com').
```

Este error aparece repetidamente en la consola al cargar el formulario de producto.

### 4. Catálogo viejo no disponible

```
https://mundooutdoorar.myvtex.com/admin/Site/ProdutoForm.aspx → 404 Not Found
```

---

## Pasos para reproducir

1. Ir a **Admin → Catálogo → Productos y SKUs**
2. Hacer click en **"Agregar producto"** (o editar uno existente, ej: producto ID 91818)
3. Completar todos los campos obligatorios
4. Hacer click en **"Guardar"**
5. **Resultado:** error "No se pudo guardar este producto. Comprueba la información ingresada y vuelve a intentarlo."

---

## Contexto adicional

- El día anterior (25/03/2026) se desinstaló una aplicación de terceros (Kudos) de la cuenta. No podemos confirmar si está relacionado, pero el problema comenzó aproximadamente en esa fecha.
- El problema afecta tanto la creación de productos nuevos como la edición de productos existentes que antes funcionaban correctamente.
- Se probó en distintos navegadores y en modo incógnito con el mismo resultado.
- Se probaron múltiples combinaciones de campos completos — siempre da el mismo error.

---

## Impacto

**ALTO** — No podemos gestionar el catálogo de productos. No se pueden crear productos nuevos ni modificar los existentes. Esto bloquea completamente la operación del e-commerce.

---

## Solicitud

Revisión urgente del servicio **catalog-facelift** para la cuenta **mundooutdoorar**. Necesitamos poder crear y editar productos con urgencia.
