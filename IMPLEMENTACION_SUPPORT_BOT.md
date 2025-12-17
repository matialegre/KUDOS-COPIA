# Implementación Support Bot - Resumen Ejecutivo

## ✅ Estado: COMPLETADO

Todas las tareas de código han sido implementadas según `SupportBot_Plan.md`.

---

## 📦 Cambios realizados

### 1. PricingService (v0.1.1 → v0.1.2)

**Archivos modificados:**
- `PricingService/manifest.json` - Eliminada policy CallMeBot y settings relacionados
- `PricingService/node/clients/index.ts` - Eliminado CallMeBotClient
- `PricingService/node/middlewares/notifySupport.ts` - Convertido en stub deprecado (503)

**Resultado:** PricingService ahora solo maneja precios/cupones, sin WhatsApp.

---

### 2. Nueva app: SupportBot (v0.1.0)

**Archivos creados:**
```
SupportBot/
├── manifest.json
├── README.md
└── node/
    ├── index.ts
    ├── service.json
    ├── clients/
    │   ├── index.ts
    │   └── pythonSupport.ts (preparado para futuro)
    └── middlewares/
        └── botMessage.ts
```

**Endpoint principal:**
- `POST /_v/mundo/bot/message`

**Settings:**
- `enabled` (boolean, default: false)
- `pythonEndpoint` (string, default: "")

**Contrato API:**

Request:
```json
{
  "message": "texto del usuario",
  "customerName": "opcional",
  "customerEmail": "opcional",
  "source": "web-support",
  "context": { "page": "/..." }
}
```

Response:
```json
{
  "reply": "¡Gracias por escribir...",
  "ticketId": "BOT-1234567890",
  "forwarded": false
}
```

---

### 3. Componente Theme: SupportEntry

**Archivos creados:**
- `Theme/react/components/SupportEntry/index.jsx`
- `Theme/react/components/SupportEntry/index.css`

**Modos configurables (Site Editor):**
- `whatsapp` - Solo link a WhatsApp (DEFAULT)
- `bot` - Solo interfaz de bot
- `bot_and_whatsapp` - Ambos

**Características:**
- Modal flotante con formulario
- Campos: nombre, email, mensaje
- Manejo de errores
- Respuesta automática del bot
- Diseño responsive

---

## 🚀 Próximos pasos (MANUAL)

### Paso 1: Publicar PricingService v0.1.2

```bash
cd PricingService/
vtex use <workspace-dev>
vtex link  # probar
vtex publish
vtex use master
vtex install mundooutdoorar.pricing-service@0.1.2
```

### Paso 2: Publicar SupportBot v0.1.0

```bash
cd SupportBot/
vtex use <workspace-dev>
vtex link  # probar
vtex publish
```

**NO instalar en master todavía** hasta que el frontend esté integrado.

### Paso 3: Integrar SupportEntry en Theme

1. Bump version en `Theme/manifest.json` (ej. 1.0.66 → 1.0.67)
2. Agregar `SupportEntry` a algún layout (ej. footer, home)
3. Publicar Theme:
   ```bash
   cd Theme/
   vtex use <workspace-dev>
   vtex link
   vtex publish
   ```

### Paso 4: Probar en workspace dev

1. Instalar support-bot en workspace dev:
   ```bash
   vtex use <workspace-dev>
   vtex install mundooutdoorar.support-bot@0.1.0
   ```

2. Configurar App Settings de `support-bot`:
   - `enabled = true`

3. En Site Editor del workspace dev:
   - Configurar `SupportEntry` con `mode = "bot"` o `"bot_and_whatsapp"`

4. Probar el flujo completo en `https://<workspace-dev>--mundooutdoorar.myvtex.com`

### Paso 5: Deploy a master (cuando esté aprobado)

1. Instalar support-bot en master (con `enabled = false`):
   ```bash
   vtex use master
   vtex install mundooutdoorar.support-bot@0.1.0
   ```

2. Instalar Theme actualizado:
   ```bash
   vtex install mundooutdoorar.theme@1.0.67
   ```

3. En Site Editor de master:
   - Dejar `SupportEntry` con `mode = "whatsapp"` (comportamiento actual)

4. Cuando se decida activar el bot:
   - App Settings de support-bot: `enabled = true`
   - Site Editor: cambiar `mode` a `"bot"` o `"bot_and_whatsapp"`

---

## 🔮 Integración futura con Python

Cuando el servicio Python esté disponible:

1. **Actualizar `SupportBot/manifest.json`:**
   - Agregar policy de outbound al host Python

2. **Actualizar `SupportBot/node/clients/index.ts`:**
   ```ts
   import { PythonSupportClient } from './pythonSupport'
   
   export class Clients extends IOClients {
     public get pythonSupport() {
       return this.getOrSet('pythonSupport', PythonSupportClient)
     }
   }
   ```

3. **Actualizar `SupportBot/node/clients/pythonSupport.ts`:**
   - Reemplazar `https://PYTHON_SERVICE_URL` con la URL real

4. **Descomentar código en `botMessage.ts`:**
   - Líneas 50-62 (llamada a pythonSupport)

5. **Configurar en App Settings:**
   - `pythonEndpoint = "https://tu-servicio-python.com/assist"`

6. **Publicar nueva versión:**
   ```bash
   # Bump version a 0.2.0
   vtex publish
   vtex use master
   vtex install mundooutdoorar.support-bot@0.2.0
   ```

---

## 📋 Checklist final

- [x] PricingService limpio de CallMeBot
- [x] App support-bot creada con endpoint funcional
- [x] Componente SupportEntry con modos configurables
- [x] Cliente Python preparado (stub)
- [x] Documentación actualizada
- [ ] Publicar PricingService v0.1.2 (MANUAL)
- [ ] Publicar SupportBot v0.1.0 (MANUAL)
- [ ] Integrar SupportEntry en Theme (MANUAL)
- [ ] Probar en workspace dev (MANUAL)
- [ ] Deploy a master cuando esté aprobado (MANUAL)

---

## 🎯 Endpoints y configuración

### Endpoint del bot
- URL: `/_v/mundo/bot/message`
- Método: POST
- Público: Sí

### App Settings (support-bot)
- `enabled`: false (default) - Cambiar a true para activar
- `pythonEndpoint`: "" (default) - Configurar cuando haya servicio Python

### Site Editor (SupportEntry)
- `mode`: "whatsapp" (default) - Cambiar a "bot" para activar
- `whatsappUrl`: "https://wa.me/5492914147915"
- `buttonLabel`: "¿Necesitás ayuda?"

---

**Fecha de implementación:** 11 de diciembre de 2025
**Implementado por:** Cascade AI
