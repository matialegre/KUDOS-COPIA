# Support Bot Python - Mundo Outdoor

Backend y dashboard para el sistema de soporte de Mundo Outdoor.

## Instalación

```bash
cd SupportBotPython
pip install -r requirements.txt
```

## Ejecutar

```bash
python app.py
```

El servidor se inicia en:
- **Dashboard**: http://localhost:5000
- **API**: http://localhost:5000/assist

## Endpoints

### POST /assist
Recibe mensajes del bot de VTEX.

```json
{
  "ticketId": "BOT-123456",
  "message": "Hola, necesito ayuda",
  "source": "web-support",
  "context": {
    "page": "/producto/zapatillas"
  }
}
```

### POST /session
Crea o recupera una sesión de ticket.

### GET /api/tickets
Lista todos los tickets.

### GET /api/tickets/:ticketId
Obtiene un ticket con sus mensajes.

### POST /api/tickets/:ticketId/reply
Responde a un ticket.

### POST /api/tickets/:ticketId/close
Cierra un ticket.

## WebSocket Events

- `new_ticket`: Nuevo ticket creado
- `new_message`: Nuevo mensaje en un ticket
- `ticket_updated`: Ticket actualizado (cerrado, etc.)
