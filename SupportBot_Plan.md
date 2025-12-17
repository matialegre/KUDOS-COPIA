# Plan técnico: Nuevo backend de soporte / bot

**Estado: IMPLEMENTADO** ✅

Este documento describe los pasos técnicos para implementar el nuevo sistema de soporte/bot **separado de PricingService**, con foco en:

- Nueva app VTEX IO `support-bot`. ✅
- Integración con el frontend (Theme) usando un componente con modo "whatsapp" / "bot". ✅
- Preparación para conectarse a un servicio externo en **Python** (en la Mac del agente). ✅
- Mecanismos claros para **activar / desactivar** el bot sin afectar producción. ✅

---

## 0. Objetivos

1. **No usar más CallMeBot** ni enviar WhatsApp desde `PricingService`.
2. Crear una app nueva `mundooutdoorar.support-bot` que exponga un endpoint REST:
   - `POST /_v/mundo/bot/message`.
3. Desde el Theme, poder elegir (por Site Editor) entre:
   - **Solo WhatsApp** (comportamiento actual).
   - **Bot** (nuevo sistema).
   - **Bot + WhatsApp** (modo transición).
4. Dejar preparado el código para que en el futuro el `support-bot` llame a un **servicio Python** externo donde el agente gestiona los tickets.

---

## 1. Limpieza de PricingService (WhatsApp / CallMeBot)

> (Podemos hacer esto cuando estemos seguros de no querer más CallMeBot. Mientras tanto, basta con no usar el endpoint.)

Archivos involucrados:
- `PricingService/manifest.json`
- `PricingService/node/clients/callmebot.ts`
- `PricingService/node/clients/index.ts`
- `PricingService/node/middlewares/notifySupport.ts`
- `PricingService/node/service.json`
- `PricingService/node/index.ts`

### 1.1. Quitar cliente CallMeBot

- Borrar el archivo:
  - `node/clients/callmebot.ts`
- En `node/clients/index.ts`:
  - Eliminar import de `CallMeBotClient`.
  - Eliminar getter `callmebot`.

### 1.2. Quitar middleware `notifySupport`

- En `node/middlewares/notifySupport.ts`:
  - O bien borrar el archivo por completo,
  - o dejar un stub mínimo que responda 501/503 con mensaje "notifications disabled" (si queremos preservar la ruta por compatibilidad).

- En `node/index.ts`:
  - Quitar el import `notifySupport`.
  - Quitar `notifySupport` del objeto `routes`.

- En `node/service.json`:
  - Borrar la sección:
    ```jsonc
    "notifySupport": {
      "path": "/_v/mundo/support/notify",
      "public": true
    }
    ```

### 1.3. Quitar settings y policies de CallMeBot

En `PricingService/manifest.json`:

- En `policies`, borrar el bloque:
  ```jsonc
  {
    "name": "outbound-access",
    "attrs": {
      "host": "api.callmebot.com",
      "path": "/*"
    }
  }
  ```

- En `settingsSchema.properties`, eliminar:
  ```jsonc
  "callMeBotPhone": { ... },
  "callMeBotApiKey": { ... }
  ```

### 1.4. Publicar nueva versión de PricingService

1. Bump de versión en `PricingService/manifest.json` (ej. `0.1.1` → `0.1.2`).
2. En carpeta `PricingService/`:
   ```bash
   vtex use <workspace-dev>
   vtex link           # opcional para probar
   vtex publish        # publica la nueva versión
   ```
3. En `master`:
   ```bash
   vtex use master
   vtex install mundooutdoorar.pricing-service@0.1.2
   ```

---

## 2. Nueva app VTEX IO: `support-bot`

> Esta app es independiente de PricingService. Solo maneja mensajes de soporte.

Estructura base sugerida:

```text
SupportBot/
  manifest.json
  node/
    index.ts
    service.json
    middlewares/
      botMessage.ts
    clients/
      pythonSupport.ts  (futuro)
  README.md
```

### 2.1. `manifest.json`

Valores iniciales:

```jsonc
{
  "vendor": "mundooutdoorar",
  "name": "support-bot",
  "version": "0.1.0",
  "title": "Support Bot",
  "description": "Manejo de mensajes de soporte y puente hacia backend externo (Python)",
  "builders": {
    "node": "7.x"
  },
  "policies": [
    {
      "name": "outbound-access",
      "attrs": {
        "host": "{{account}}.vtexcommercestable.com.br",
        "path": "/api/*"
      }
    }
    // Más adelante se agregará la policy al host del servicio Python
  ],
  "settingsSchema": {
    "title": "Support Bot Configuration",
    "type": "object",
    "properties": {
      "enabled": {
        "type": "boolean",
        "title": "Habilitar bot de soporte",
        "default": false
      },
      "pythonEndpoint": {
        "type": "string",
        "title": "URL del servicio Python (opcional)",
        "description": "Endpoint al que se reenviarán los mensajes (POST)",
        "default": ""
      }
    }
  },
  "$schema": "https://raw.githubusercontent.com/vtex/node-vtex-api/master/gen/manifest.schema"
}
```

### 2.2. `node/service.json`

```jsonc
{
  "memory": 256,
  "timeout": 10,
  "minReplicas": 1,
  "maxReplicas": 4,
  "routes": {
    "botMessage": {
      "path": "/_v/mundo/bot/message",
      "public": true
    }
  }
}
```

### 2.3. `node/index.ts`

- Configurar `Service` y `Clients` (si hiciera falta para Python luego).
- Registrar la ruta `botMessage`.

Esqueleto mínimo:

```ts
import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { botMessage } from './middlewares/botMessage'

const TIMEOUT_MS = 800

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service({
  clients,
  routes: {
    botMessage,
  },
})
```

### 2.4. `node/middlewares/botMessage.ts`

Responsabilidades del middleware:

1. Leer el body JSON.
2. Validar que haya un `message` (texto del usuario).
3. Consultar settings de la app (`enabled`, `pythonEndpoint`).
4. Si `enabled = false` → devolver error controlado o respuesta básica.
5. Generar un `ticketId` simple (ej. timestamp + random).
6. Devolver un `reply` automático básico.
7. (Futuro) llamar al cliente `pythonSupport` con todos los datos.

Contrato de request sugerido:

```jsonc
{
  "message": "texto del usuario",
  "customerName": "opcional",
  "customerEmail": "opcional",
  "source": "web-contact | whatsapp | ...",
  "context": {
    "page": "/producto/abc",
    "orderId": "opcional",
    "cartId": "opcional"
  }
}
```

Respuesta sugerida:

```jsonc
{
  "reply": "¡Gracias por escribir a Mundo Outdoor! Recibimos tu mensaje y te vamos a responder a la brevedad.",
  "ticketId": "BOT-2025-000001",
  "forwarded": false
}
```

Pseudocódigo del middleware:

```ts
import { json } from 'co-body'

export async function botMessage(ctx: Context, next: () => Promise<any>) {
  const settings = await ctx.clients.apps.getAppSettings(
    `${ctx.vtex.account}.support-bot`
  ) as { enabled?: boolean; pythonEndpoint?: string }

  const body = await json(ctx.req)
  const { message, customerName, customerEmail, source, context } = body || {}

  if (!message || !String(message).trim()) {
    ctx.status = 400
    ctx.body = { error: 'Missing message' }
    return
  }

  const ticketId = `BOT-${Date.now()}`

  // Respuesta automática básica
  const reply =
    '¡Gracias por escribir a Mundo Outdoor! Recibimos tu mensaje y un asesor te va a responder a la brevedad.'

  // TODO futuro: enviar a servicio Python si settings.pythonEndpoint está definido
  // try { await ctx.clients.pythonSupport.notify(...)} catch (e) { log error }

  ctx.status = 200
  ctx.set('Cache-Control', 'no-store')
  ctx.body = {
    reply,
    ticketId,
    forwarded: false,
  }

  await next()
}
```

### 2.5. Cliente futuro para Python (`node/clients/pythonSupport.ts`)

Cuando exista la API Python, se crea un cliente:

```ts
import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

export class PythonSupportClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://TU_HOST_PYTHON', context, {
      ...options,
      timeout: 3000,
    })
  }

  public notifySupport(payload: any) {
    return this.http.post('/assist', payload, {
      metric: 'python-support-notify',
    })
  }
}
```

Y se agrega en `node/clients/index.ts`:

```ts
import { IOClients } from '@vtex/api'
import { PythonSupportClient } from './pythonSupport'

export class Clients extends IOClients {
  public get pythonSupport() {
    return this.getOrSet('pythonSupport', PythonSupportClient)
  }
}
```

En el `manifest.json` de `support-bot`, habrá que agregar la `policy` de outbound correspondiente cuando tengamos el dominio de Python.

### 2.6. Publicar `support-bot`

Desde carpeta `SupportBot/`:

```bash
vtex use <workspace-dev>
vtex link          # probar
vtex publish       # publica mundooutdoorar.support-bot@0.1.0
```

En `master` (cuando esté probado):

```bash
vtex use master
vtex install mundooutdoorar.support-bot@0.1.0
```

En App Settings de `support-bot` en `master`, dejar inicialmente:

- `enabled = false`
- `pythonEndpoint = ""`

Así, aunque esté instalada, el bot está "apagado" hasta que se decida usarlo.

---

## 3. Integración con el frontend (Theme)

Objetivo: controlar desde el Site Editor si se usa solo WhatsApp, solo bot, o ambos.

### 3.1. Nuevo componente `SupportEntry` (React)

Archivo sugerido:
- `Theme/react/components/SupportEntry/index.jsx`
- `Theme/react/components/SupportEntry/index.css`

Responsabilidades:

- Mostrar:
  - ícono / link de WhatsApp (modo clásico), **o**
  - botón/formulario que abre el flujo del bot.
- Según un `modo` seleccionado en el schema:

  - `"whatsapp"` → solo link a WhatsApp.
  - `"bot"` → solo interfaz de bot.
  - `"bot_and_whatsapp"` → ambos.

### 3.2. Schema del componente (Site Editor)

En `SupportEntry.schema`:

```js
SupportEntry.schema = {
  title: 'Entrada de soporte (bot / WhatsApp)',
  description: 'Controla si se muestra el bot, WhatsApp o ambos.',
  type: 'object',
  properties: {
    mode: {
      title: 'Modo de atención',
      type: 'string',
      enum: ['whatsapp', 'bot', 'bot_and_whatsapp'],
      enumNames: ['Solo WhatsApp', 'Solo bot', 'Bot y WhatsApp'],
      default: 'whatsapp',
    },
    whatsappUrl: {
      title: 'URL de WhatsApp',
      type: 'string',
      default: 'https://wa.me/5492914147915',
    },
    buttonLabel: {
      title: 'Texto del botón del bot',
      type: 'string',
      default: '¿Necesitás ayuda?',
    },
  },
}
```

### 3.3. Lógica del componente

Pseudocódigo:

```jsx
const SupportEntry = ({ mode = 'whatsapp', whatsappUrl, buttonLabel }) => {
  const showWhatsApp = mode === 'whatsapp' || mode === 'bot_and_whatsapp'
  const showBot = mode === 'bot' || mode === 'bot_and_whatsapp'

  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/_v/mundo/bot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, source: 'web-support' }),
      })
      const data = await res.json()
      setReply(data.reply || '')
    } catch (e) {
      setReply('Tuvimos un problema, por favor intentá de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.supportEntryContainer}>
      {showWhatsApp && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      )}

      {showBot && (
        <div>
          <button onClick={/* abrir formulario o modal */}>
            {buttonLabel}
          </button>

          {/* Ejemplo simple de formulario inline */}
          <textarea value={message} onChange={e => setMessage(e.target.value)} />
          <button onClick={handleSend} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          {reply && <p>{reply}</p>}
        </div>
      )}
    </div>
  )
}
```

### 3.4. Control de activación en producción

- En `master`, mientras el bot no esté listo:
  - `mode` del `SupportEntry` = `whatsapp`.
  - `support-bot.enabled` = `false`.
- En workspaces de dev:
  - `mode` = `bot` o `bot_and_whatsapp`.
  - `support-bot.enabled` = `true`.

Así, el código del bot puede estar mergeado y deployado, pero la tienda visible para clientes se comporta igual que hoy hasta que se decida activarlo.

---

## 4. Integración futura con Python

Cuando se defina y esté online el servicio Python del agente:

1. Actualizar `support-bot/manifest.json`:
   - Agregar `policy` de outbound al host del servicio Python.
   - Configurar `pythonEndpoint` en App Settings.

2. Implementar `PythonSupportClient` (ver 2.5) y usarlo en `botMessage`:

   ```ts
   if (settings.pythonEndpoint) {
     try {
       await ctx.clients.pythonSupport.notifySupport({
         message,
         customerName,
         customerEmail,
         source,
         context,
         ticketId,
       })
       forwarded = true
     } catch (e) {
       forwarded = false
       // loguear error pero no romper la respuesta al usuario
     }
   }
   ```

3. Ajustar la respuesta del middleware para reflejar `forwarded`.

4. El servicio Python se encargará de:
   - Guardar los tickets.
   - Mostrar interfaz al agente.
   - Gestionar estados (pendiente/en curso/cerrado).

---

## 5. Resumen de pasos prácticos

1. **(Opcional) Limpiar CallMeBot de PricingService** y publicar nueva versión.
2. Crear carpeta `SupportBot/` con:
   - `manifest.json` (support-bot).
   - `node/service.json`.
   - `node/index.ts`.
   - `node/middlewares/botMessage.ts`.
3. `vtex link` y `vtex publish` de `mundooutdoorar.support-bot@0.1.0` en workspace dev.
4. Instalar `support-bot` en `master` cuando esté probado, con `enabled = false`.
5. En Theme, crear componente `SupportEntry` con modo `whatsapp` / `bot` / `bot_and_whatsapp` y esquema correspondiente.
6. Conectar `SupportEntry` al endpoint `/_v/mundo/bot/message`.
7. En workspaces de dev:
   - `mode = bot` o `bot_and_whatsapp`.
   - `support-bot.enabled = true`.
8. Cuando esté listo para producción:
   - En `master`, cambiar `mode` en Site Editor y `support-bot.enabled = true`.
9. Más adelante, agregar cliente Python y configurar `pythonEndpoint` para integrar el backend del agente.
