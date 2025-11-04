# 📝 Guía de Site Editor - Componentes Editables

Todos estos componentes custom pueden editarse desde el **Site Editor de VTEX** sin tocar código.

## 📋 Índice
1. [Announcement Bar](#-announcement-bar) ⭐ NUEVO
2. [Video Hero Custom](#-video-hero-custom)
3. [Category Hero Custom](#-category-hero-custom)
4. [Brands Slider Custom](#-brands-slider-custom)
5. [Benefits Bar](#-benefits-bar)
6. [Main Header](#-main-header)
7. [Utility Bar Right](#-utility-bar-right)
8. [Brand Bar](#-brand-bar)

---

## 📢 Announcement Bar
**Bloque:** `announcement-bar#header` ⭐ **NUEVO**

### Campos editables:
- **Lista de Mensajes** (array):
  - ID único
  - Texto del mensaje
  - Icono (emoji opcional)
- **Color de Fondo**: Color hex del fondo (#000)
- **Color de Texto**: Color hex del texto (#fff)
- **Rotación Automática**: Activar/desactivar rotación
- **Intervalo de Rotación**: Tiempo en milisegundos (5000 = 5 segundos)

### Valores por defecto:
- Mensaje 1: "ENVÍO GRATIS EN COMPRAS MAYORES A $150.000" 🚚
- Mensaje 2: "3 Y 6 CUOTAS SIN INTERÉS / HASTA 50% OFF EN PRODUCTOS SELECCIONADOS" 💳
- Fondo negro, texto blanco
- Rotación automática cada 5 segundos

### Características:
✅ **Múltiples mensajes** rotativos  
✅ **Indicadores de puntos** para navegación manual  
✅ **100% responsive** (desktop, tablet, mobile)  
✅ **Colores personalizables**  
✅ **Iconos emoji** opcionales  

---

## 🎬 Video Hero Custom
**Bloque:** `video-hero-custom`

### Dimensiones exactas:
- **Total:** 1492px × 660px
- **Newsletter (izquierda):** 530px × 660px
- **Video (derecha):** 962px × 660px

### Campos editables:
- **URL del Video**: Link completo del video (962px de ancho)
- **Logo**: Imagen del logo (opcional)
- **Título**: Título principal del newsletter
- **Subtítulo**: Texto sobre el input de email
- **Placeholder del Input**: Texto placeholder del campo
- **Texto del Botón**: Texto del botón de suscripción

### Valores por defecto:
- Video: `video_para_parte_final_5_zassmm.mp4` (962×660px)
- Título: "Entérate de todas las novedades y ofertas"
- Subtítulo: "Ingresa tu e-mail"
- Botón: "SUSCRIBITE"

### Características:
✅ **Formulario funcional** de newsletter  
✅ **Validación de email** en tiempo real  
✅ **Estados de carga** y mensajes de feedback  
✅ **100% responsive** (desktop, tablet, mobile)  
✅ **Autoplay** del video al hacer scroll  

---

## 🏷️ Category Hero Custom
**Bloque:** `category-hero-custom`

### Campos editables:
- **Imagen Mujer** + Link (con image uploader)
- **Imagen Hombre** + Link (con image uploader)
- **Imagen Niños** + Link (con image uploader)

### Valores por defecto:
- Mujer: `/arquivos/imagen_bld.jpg` → `/mujer`
- Hombre: `/arquivos/hombre_chicha.jpg` → `/hombre`
- Niños: `/arquivos/nino_chicha.jpg` → `/ninos`

---

## 🏪 Brands Slider Custom
**Bloque:** `brands-slider-custom`

### Campos editables:
- **Título**: Título del slider
- **Texto del Link**: Texto "Ver todos"
- **URL del Link**: Donde redirige el link

### Valores por defecto:
- Título: "NUESTRAS MARCAS"
- Link: "Ver todos" → `/marcas`

---

## 🎁 Benefits Bar
**Bloque:** `benefits-bar` (si está registrado en interfaces.json)

### Campos editables:
- **Lista de Beneficios** (array):
  - ID único
  - Imagen (con image uploader)
  - Texto alternativo
  - Link
  - Tema (dark/light)

### Valores por defecto:
- 1 beneficio: Medios de pago con tema oscuro

---

## 🧭 Main Header
**Bloque:** `main-header`

### Campos editables:
- **Logo URL**: Logo del sitio (con image uploader)
- **Placeholder de Búsqueda**: Texto del buscador

### Valores por defecto:
- Logo: `https://mundooutdoorar.vteximg.com.br/arquivos/logo_izq_arriba.png`
- Placeholder: "Buscar"

---

## 🔗 Utility Bar Right
**Bloque:** `utility-bar-right`

### Campos editables:
- **Lista de Items** (array):
  - ID único
  - Texto del link
  - URL de destino
  - Icono (opcional, con image uploader)
  - Aria Label (accesibilidad)

### Valores por defecto:
- Ver sucursales → `/sucursales`
- Envíos → `/institucional/envios`
- Mi cuenta → `/account`

---

## 🏷️ Brand Bar
**Bloque:** `brand-bar`

### Campos editables:
- **Lista de Marcas** (array):
  - Nombre de la marca
  - Logo (con image uploader)
  - Link de la marca

### Valores por defecto:
- 11 marcas: DC, Roxy, Columbia, Quiksilver, Montagne, OBKA, Salomon, RVCA, Burton, Sorel, Ansilta

---

## 📱 Responsive
Todos los componentes son **100% responsive** con breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: <480px

---

## 🚀 Cómo usar el Site Editor

1. Hacé `vtex link` en tu workspace
2. Abrí el admin de VTEX
3. Andá a **Storefront > Site Editor**
4. Seleccioná la página que querés editar (ej: Home)
5. Hacé click en el bloque que querés editar
6. Modificá los campos en el panel derecho
7. Guardá los cambios

**¡Listo!** Los cambios se ven en tiempo real sin tocar código 🎉

---

## 📝 Cómo editar textos y links del header

### **Links superiores (Ver sucursales, Envíos, Mi cuenta)**
1. En el Site Editor, buscá el bloque `utility-bar-right#desktop`
2. Podés editar:
   - Texto de cada link
   - URL de destino
   - Icono (opcional)
   - Aria Label (accesibilidad)

### **Links inferiores (Entregas, Cambios, Sucursales, etc.)**
1. Buscá el bloque `rich-text#utilityLinks`
2. Editá el texto en formato Markdown:
   - `[Texto del link](/url-destino)`
   - Ejemplo: `[Entregas](/institucional/entregas) [Cambios](/cambios)`

### **Banner negro "ENVÍO GRATIS"**
1. Buscá el bloque `rich-text` con blockClass `announcement-message-with-truck`
2. Editá el texto directamente
3. Formato: `ENVÍO GRATIS EN COMPRAS MAYORES A $150.000`

---

## ⚠️ Notas importantes

- Las imágenes deben estar subidas en **VTEX File Manager** primero
- Los links pueden ser relativos (`/mujer`) o absolutos (`https://...`)
- El image uploader facilita la selección de imágenes ya subidas
- Los schemas usan **JSON Schema** estándar de VTEX
