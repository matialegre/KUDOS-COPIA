# Support Bot

App VTEX IO para manejo de mensajes de soporte y puente hacia backend externo (Python).

## Endpoint principal

- `POST /_v/mundo/bot/message`

### Request

```json
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

### Response

```json
{
  "reply": "¡Gracias por escribir a Mundo Outdoor! Recibimos tu mensaje y un asesor te va a responder a la brevedad.",
  "ticketId": "BOT-2025-000001",
  "forwarded": false
}
```

## Configuración

En App Settings de `mundooutdoorar.support-bot`:

- `enabled` (boolean): Habilitar/deshabilitar el bot. Default: `false`.
- `pythonEndpoint` (string): URL del servicio Python externo (futuro). Default: `""`.

## Instalación

```bash
vtex use <workspace-dev>
vtex link
vtex publish
```

En master:

```bash
vtex use master
vtex install mundooutdoorar.support-bot@0.1.0
```

## Integración futura con Python

Cuando el servicio Python esté disponible:

1. Actualizar `manifest.json` con policy de outbound al host Python.
2. Configurar `pythonEndpoint` en App Settings.
3. Descomentar código en `botMessage.ts` para llamar a `pythonSupport.notifySupport()`.
