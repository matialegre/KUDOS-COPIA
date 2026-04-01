# Ticket de Soporte VTEX — Error de Base de Datos (tempdb) en cuenta mundooutdoorar

## Datos de la cuenta
- **Cuenta:** mundooutdoorar
- **Severidad:** CRÍTICA — Operación del e-commerce completamente bloqueada
- **Fecha de inicio del problema:** 25 de marzo de 2026 (aproximadamente)
- **Fecha del reporte:** 26 de marzo de 2026, 10:34 AM (GMT-3)

---

## Descripción del problema

No es posible **crear ni editar ningún producto** en la cuenta mundooutdoorar. Todas las operaciones de escritura sobre el catálogo fallan con errores 422 y 500.

Al inspeccionar el **Response body** de los requests fallidos, encontramos el siguiente mensaje de error devuelto por el servidor:

```
"Transaction aborted when accessing versioned row in table 'dbo.Produto'
in database 'mundooutdoorar'. Requested versioned row was not found.
Your tempdb is probably out of space. Please refer to BOL on how to
configure tempdb for versioning."
```

Este error indica un problema de infraestructura en la base de datos SQL Server de la cuenta: el **tempdb** está lleno o tiene registros de versionado corruptos/faltantes, lo que impide cualquier operación de escritura sobre la tabla `dbo.Produto`.

---

## Evidencia técnica

### Error al CREAR un producto nuevo (POST — 422)

- **Endpoint:** `POST https://catalog-facelift.admin.vtex.com/api/proxy/catalog/pvt/admin/form/product?an=mundooutdoorar`
- **Status:** 422 (Unprocessable Content)
- **Response body:** mensaje de error de tempdb citado arriba
- **Hora:** 26/03/2026, 10:34 AM (GMT-3)

### Error al EDITAR un producto existente (PUT — 500)

- **Endpoint:** `PUT https://catalog-facelift.admin.vtex.com/api/proxy/catalog/pvt/admin/form/product/91818?an=mundooutdoorar`
- **Status:** 500 (Internal Server Error)
- **Producto afectado:** "Pantalón de niños Briskan" (ID 91818)
- **Hora:** 26/03/2026, 10:19 AM (GMT-3)

### Error adicional de postMessage en consola

```
Failed to execute 'postMessage' on 'DOMWindow': The target origin provided
('https://catalog-facelift.admin.vtex.com') does not match the recipient
window's origin ('https://mundooutdoorar.myvtex.com').
```

---

## Pruebas realizadas

1. **Modo incógnito:** se probó en ventana de incógnito con el mismo resultado.
2. **Múltiples navegadores:** el error se reproduce en todos los navegadores.
3. **Acceso desde admin.vtex.com:** se accedió directamente desde `https://admin.vtex.com` como recomendó el equipo de soporte. El error persiste.
4. **Limpieza de caché/storage:** se borró Local Storage y Session Storage del origen catalog-facelift. Sin cambios.
5. **Todos los campos obligatorios completos:** se verificó categoría hoja, marca activa, slug único y especificaciones obligatorias. El error no es de validación de datos.
6. **Duplicar producto existente:** también falla con el mismo error 422.
7. **Editar producto existente sin cambios:** falla con error 500.

---

## Pasos para reproducir

1. Ir a Admin → Catálogo → Productos y SKUs
2. Hacer click en "Agregar producto" (o editar cualquier producto existente)
3. Completar todos los campos obligatorios
4. Hacer click en "Guardar"
5. **Resultado:** error "No se pudo guardar este producto"
6. En DevTools → Network → filtrar por `form/product` → la respuesta contiene el mensaje de error de tempdb

---

## Diagnóstico

La causa raíz es un problema de infraestructura en la base de datos SQL Server:

- La tabla afectada es `dbo.Produto` en la base de datos `mundooutdoorar`
- El `tempdb` de SQL Server no tiene espacio suficiente o tiene registros de row versioning faltantes/corruptos
- Esto bloquea TODAS las transacciones de escritura sobre productos
- El problema NO es de la UI del catalog-facelift ni de validación de campos

---

## Contexto adicional

- El día 25/03/2026 se desinstaló una aplicación de terceros (Kudos) de la cuenta. No podemos confirmar si la desinstalación disparó una operación masiva que llenó el tempdb, pero la coincidencia temporal es notable.
- El catálogo viejo (`/admin/Site/ProdutoForm.aspx`) devuelve 404, por lo que no hay forma alternativa de gestionar productos desde la UI.

---

## Impacto

**CRÍTICO** — La operación del e-commerce está completamente bloqueada:
- No se pueden crear productos nuevos
- No se pueden editar productos existentes
- No se pueden duplicar productos
- No hay acceso al catálogo viejo como alternativa

---

## Acción solicitada

Solicitamos que el equipo de infraestructura de VTEX:

1. Revise el estado del **tempdb** en el servidor SQL Server que aloja la base de datos `mundooutdoorar`
2. Libere espacio o reconfigure el tempdb según sea necesario
3. Verifique la integridad de los registros de row versioning en la tabla `dbo.Produto`
4. Confirme cuando la operación de catálogo esté restaurada

Quedamos a disposición para cualquier información adicional o prueba que se necesite.
