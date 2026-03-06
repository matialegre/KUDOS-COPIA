import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mundo-outdoor-support-secret-2024'
CORS(app, origins=["*"])

DB_PATH = 'support_tickets.db'

def debug_log(action, data=None):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n{'='*60}")
    print(f"[DEBUG {timestamp}] {action}")
    if data:
        print(f"DATA: {json.dumps(data, indent=2, default=str)}")
    print(f"{'='*60}\n")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'open', answered INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source TEXT, page TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL,
        sender TEXT NOT NULL, message TEXT NOT NULL, seen INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS quick_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, message TEXT NOT NULL, active INTEGER DEFAULT 1)''')
    c.execute('''CREATE TABLE IF NOT EXISTS auto_response (
        id INTEGER PRIMARY KEY, enabled INTEGER DEFAULT 0,
        message TEXT DEFAULT '¡Gracias por escribirnos! Un asesor te responderá pronto.')''')
    c.execute('''CREATE TABLE IF NOT EXISTS business_hours (
        id INTEGER PRIMARY KEY,
        enabled INTEGER DEFAULT 0,
        start_hour INTEGER DEFAULT 9,
        end_hour INTEGER DEFAULT 17,
        days TEXT DEFAULT 'L,M,X,J,V',
        message TEXT DEFAULT 'Nuestro horario de atención es Lunes a Viernes de 9 a 17hs. Por favor dejanos tu número de WhatsApp y te contactaremos a la brevedad.')''')
    c.execute('SELECT COUNT(*) FROM auto_response')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO auto_response (id, enabled, message) VALUES (1, 1, "¡Gracias por escribirnos! Un asesor te responderá pronto.")')
    c.execute('SELECT COUNT(*) FROM business_hours')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO business_hours (id, enabled, start_hour, end_hour, days, message) VALUES (1, 0, 9, 17, "L,M,X,J,V", "Nuestro horario de atención es Lunes a Viernes de 9 a 17hs. Por favor dejanos tu número de WhatsApp y te contactaremos a la brevedad.")')
    c.execute('SELECT COUNT(*) FROM quick_replies')
    if c.fetchone()[0] == 0:
        for t, m in [("Saludo", "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?"),
                     ("Horarios", "Nuestro horario de atención es de Lunes a Viernes de 9 a 18hs."),
                     ("Envíos", "Realizamos envíos a todo el país."),
                     ("Cambios", "Tenés 30 días para realizar cambios."),
                     ("Despedida", "¡Gracias por tu consulta!")]:
            c.execute('INSERT INTO quick_replies (title, message) VALUES (?, ?)', (t, m))
    try: c.execute('ALTER TABLE tickets ADD COLUMN answered INTEGER DEFAULT 0')
    except: pass
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

DASHBOARD_HTML = '''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soporte Mundo Outdoor</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #111; min-height: 100vh; }
        .header { background: #000; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; gap: 15px; }
        .header h1 { font-size: 22px; color: #fff; display: flex; align-items: center; gap: 10px; }
        .header h1::before { content: "🏔️"; }
        .header-left { display: flex; align-items: center; gap: 14px; }
        .new-msg-banner { display: none; align-items: center; gap: 8px; color: #000; background: #fff; padding: 8px 12px; border-radius: 8px; font-weight: 800; letter-spacing: 0.5px; }
        .new-msg-banner.on { display: inline-flex; animation: pulse 0.9s infinite; }
        .new-msg-dot { width: 10px; height: 10px; background: #000; border-radius: 50%; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .header-actions { display: flex; gap: 10px; }
        .header-btn { background: #333; border: none; color: #fff; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; }
        .header-btn:hover { background: #555; }
        .header-btn.danger { background: #c00; }
        .header-btn.danger:hover { background: #a00; }
        .container { display: flex; height: calc(100vh - 70px); }
        .sidebar { width: 340px; background: #f5f5f5; border-right: 1px solid #ddd; overflow-y: auto; }
        .sidebar-header { padding: 15px 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
        .sidebar-header h2 { font-size: 14px; color: #666; font-weight: 600; }
        .filter-tabs { display: flex; gap: 5px; }
        .filter-tab { background: none; border: 1px solid #ccc; color: #666; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .filter-tab.active { background: #000; color: #fff; border-color: #000; }
        .ticket-list { padding: 10px; }
        .ticket-item { background: #fff; border-radius: 8px; padding: 15px; margin-bottom: 10px; cursor: pointer; border: 1px solid #e0e0e0; border-left: 4px solid #ccc; }
        .ticket-item:hover { background: #fafafa; }
        .ticket-item.active { border-left-color: #000; background: #f0f0f0; }
        .ticket-item.unanswered { border-left-color: #f90; }
        .ticket-item.answered { border-left-color: #090; }
        .ticket-id { font-weight: 600; color: #000; font-size: 13px; margin-bottom: 4px; }
        .ticket-preview { color: #666; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ticket-meta { display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: #999; }
        .ticket-badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
        .badge-unanswered { background: #f90; color: #fff; }
        .badge-answered { background: #090; color: #fff; }
        .chat-area { flex: 1; display: flex; flex-direction: column; background: #fff; }
        .chat-header { padding: 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
        .chat-header h3 { color: #000; font-size: 16px; }
        .chat-actions { display: flex; gap: 10px; }
        .chat-btn { background: #000; border: none; color: #fff; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 12px; }
        .chat-btn:hover { background: #333; }
        .chat-btn.delete { background: #c00; }
        .messages { flex: 1; overflow-y: auto; padding: 20px; background: #fafafa; }
        .message { max-width: 70%; margin-bottom: 15px; }
        .message.user { margin-left: auto; }
        .message.agent { margin-right: auto; }
        .message-bubble { padding: 12px 16px; border-radius: 12px; font-size: 14px; line-height: 1.4; }
        .message.user .message-bubble { background: #000; color: #fff; border-bottom-right-radius: 4px; }
        .message.agent .message-bubble { background: #e8e8e8; color: #000; border-bottom-left-radius: 4px; }
        .message-time { font-size: 10px; color: #999; margin-top: 4px; }
        .message.user .message-time { text-align: right; }
        .reply-area { padding: 20px; border-top: 1px solid #ddd; background: #fff; }
        .quick-replies { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px; }
        .quick-reply-btn { background: #fff; border: 1px solid #000; color: #000; padding: 6px 12px; border-radius: 20px; cursor: pointer; font-size: 12px; }
        .quick-reply-btn:hover { background: #000; color: #fff; }
        .reply-input-row { display: flex; gap: 10px; }
        .reply-input { flex: 1; background: #f5f5f5; border: 1px solid #ddd; color: #000; padding: 15px; border-radius: 8px; font-size: 14px; resize: none; }
        .reply-input:focus { outline: none; border-color: #000; }
        .send-btn { background: #000; border: none; color: #fff; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
        .send-btn:hover { background: #333; }
        .send-btn:disabled { background: #ccc; cursor: not-allowed; }
        .settings-panel { width: 320px; background: #f5f5f5; border-left: 1px solid #ddd; padding: 20px; overflow-y: auto; display: none; }
        .settings-panel.open { display: block; }
        .settings-panel h3 { color: #000; margin-bottom: 20px; font-size: 16px; }
        .setting-group { margin-bottom: 20px; }
        .setting-group label { display: block; color: #666; font-size: 11px; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; }
        .setting-group input, .setting-group textarea { width: 100%; background: #fff; border: 1px solid #ddd; color: #000; padding: 10px; border-radius: 5px; font-size: 13px; }
        .setting-group textarea { min-height: 80px; resize: vertical; }
        .toggle-row { display: flex; align-items: center; gap: 10px; }
        .toggle { width: 44px; height: 24px; background: #ccc; border-radius: 12px; position: relative; cursor: pointer; }
        .toggle.active { background: #000; }
        .toggle::after { content: ''; position: absolute; width: 20px; height: 20px; background: #fff; border-radius: 50%; top: 2px; left: 2px; transition: 0.2s; }
        .toggle.active::after { left: 22px; }
        .quick-reply-item { background: #fff; padding: 10px; border-radius: 5px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #ddd; }
        .quick-reply-item span { font-size: 12px; }
        .quick-reply-item button { background: #c00; border: none; color: #fff; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 10px; }
        .add-quick-reply { display: flex; gap: 6px; margin-top: 10px; }
        .add-quick-reply input { flex: 1; padding: 8px; font-size: 12px; }
        .add-quick-reply button { background: #000; border: none; color: #fff; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #999; }
        .empty-state p { font-size: 14px; }
        .debug-panel { position: fixed; bottom: 0; left: 0; right: 0; background: #111; color: #0f0; font-family: monospace; font-size: 11px; max-height: 120px; overflow-y: auto; padding: 10px; display: none; }
        .debug-panel.open { display: block; }
        
        .welcome-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 99999; display: flex; align-items: center; justify-content: center; }
        .welcome-box { background: #fff; padding: 50px 40px; border-radius: 10px; max-width: 500px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .welcome-box h2 { font-size: 28px; margin-bottom: 20px; color: #000; }
        .welcome-box p { font-size: 16px; color: #666; margin-bottom: 30px; line-height: 1.6; }
        .welcome-box button { background: #000; color: #fff; border: none; padding: 15px 40px; font-size: 16px; font-weight: 600; border-radius: 6px; cursor: pointer; }
        .welcome-box button:hover { background: #333; }

        .toast { position: fixed; right: 18px; bottom: 18px; z-index: 99998; display: none; }
        .toast.on { display: block; }
        .toast-inner { background: #000; color: #fff; padding: 14px 16px; border-radius: 10px; box-shadow: 0 16px 40px rgba(0,0,0,0.35); min-width: 280px; display: flex; align-items: flex-start; gap: 10px; border: 1px solid rgba(255,255,255,0.14); }
        .toast-title { font-weight: 800; margin-bottom: 2px; }
        .toast-text { font-size: 13px; opacity: 0.9; }
        .toast-close { margin-left: auto; background: transparent; border: none; color: #fff; font-size: 18px; cursor: pointer; line-height: 1; }
        
        /* POPUP NOTIFICACION OBLIGATORIO */
        .alert-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,0,0,0.15); z-index: 999999; display: none; align-items: center; justify-content: center; animation: alertPulse 0.5s infinite; }
        .alert-overlay.on { display: flex; }
        @keyframes alertPulse { 0%, 100% { background: rgba(255,0,0,0.15); } 50% { background: rgba(255,0,0,0.25); } }
        .alert-box { background: #fff; padding: 40px 50px; border-radius: 16px; text-align: center; box-shadow: 0 30px 80px rgba(0,0,0,0.5); border: 4px solid #f00; max-width: 500px; animation: shake 0.5s ease-in-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
        .alert-icon { font-size: 60px; margin-bottom: 15px; animation: bounce 0.6s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .alert-box h2 { font-size: 28px; color: #c00; margin-bottom: 15px; text-transform: uppercase; }
        .alert-box p { font-size: 18px; color: #333; margin-bottom: 25px; line-height: 1.5; }
        .alert-box .ticket-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 16px; font-weight: 600; }
        .alert-box button { background: #c00; color: #fff; border: none; padding: 18px 50px; font-size: 18px; font-weight: 700; border-radius: 8px; cursor: pointer; text-transform: uppercase; }
        .alert-box button:hover { background: #a00; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <h1>Soporte Mundo Outdoor</h1>
            <div class="new-msg-banner" id="newMsgBanner">
                <span class="new-msg-dot"></span>
                <span id="newMsgBannerText">MENSAJE (0) NUEVO!</span>
            </div>
        </div>
        <div class="header-actions">
            <button class="header-btn" onclick="toggleSettings()">⚙️ Config</button>
            <button class="header-btn" onclick="toggleDebug()">🐛 Debug</button>
            <button class="header-btn danger" onclick="deleteAllConversations()">🗑️ Borrar Todo</button>
        </div>
    </div>
    <div class="container">
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>CLIENTES <span id="ticketCount">(0)</span></h2>
                <div class="filter-tabs">
                    <button class="filter-tab active" data-filter="all">Todos</button>
                    <button class="filter-tab" data-filter="unanswered">Pendientes</button>
                    <button class="filter-tab" data-filter="answered">Respondidos</button>
                </div>
            </div>
            <div class="ticket-list" id="ticketList"></div>
        </div>
        <div class="chat-area">
            <div id="emptyState" class="empty-state">
                <p>Seleccioná un cliente para ver la conversación</p>
            </div>
            <div id="chatContent" style="display: none; flex-direction: column; height: 100%;">
                <div class="chat-header">
                    <h3 id="chatTitle">Cliente</h3>
                    <div class="chat-actions">
                        <button class="chat-btn" onclick="markAsAnswered()">✓ Respondido</button>
                        <button class="chat-btn delete" onclick="deleteCurrentConversation()">🗑️ Borrar</button>
                    </div>
                </div>
                <div class="messages" id="messageList"></div>
                <div class="reply-area">
                    <div class="quick-replies" id="quickReplies"></div>
                    <div class="reply-input-row">
                        <textarea class="reply-input" id="replyInput" placeholder="Escribí tu respuesta..." rows="2"></textarea>
                        <button class="send-btn" id="sendBtn" onclick="sendReply()">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="settings-panel" id="settingsPanel">
            <h3>⚙️ Configuración</h3>
            <div class="setting-group">
                <label>Respuesta Automática</label>
                <div class="toggle-row">
                    <div class="toggle" id="autoResponseToggle" onclick="toggleAutoResponse()"></div>
                    <span id="autoResponseStatus">Desactivada</span>
                </div>
            </div>
            <div class="setting-group">
                <label>Mensaje Automático</label>
                <textarea id="autoResponseMessage"></textarea>
                <button class="header-btn" style="margin-top: 10px; width: 100%; background: #000;" onclick="saveAutoResponse()">Guardar</button>
            </div>
            <div class="setting-group">
                <label>Horario Laboral</label>
                <div class="toggle-row">
                    <div class="toggle" id="businessHoursToggle" onclick="toggleBusinessHours()"></div>
                    <span id="businessHoursStatus">Desactivado</span>
                </div>
            </div>
            <div class="setting-group">
                <label>Horario (24hs)</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="number" id="startHour" min="0" max="23" placeholder="9" style="width: 60px;">
                    <span>a</span>
                    <input type="number" id="endHour" min="0" max="23" placeholder="17" style="width: 60px;">
                    <span>hs</span>
                </div>
            </div>
            <div class="setting-group">
                <label>Días Laborales</label>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; text-transform: none;">
                        <input type="checkbox" class="day-checkbox" value="L" checked> Lun
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; text-transform: none;">
                        <input type="checkbox" class="day-checkbox" value="M" checked> Mar
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; text-transform: none;">
                        <input type="checkbox" class="day-checkbox" value="X" checked> Mié
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; text-transform: none;">
                        <input type="checkbox" class="day-checkbox" value="J" checked> Jue
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; text-transform: none;">
                        <input type="checkbox" class="day-checkbox" value="V" checked> Vie
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; text-transform: none;">
                        <input type="checkbox" class="day-checkbox" value="S"> Sáb
                    </label>
                    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; text-transform: none;">
                        <input type="checkbox" class="day-checkbox" value="D"> Dom
                    </label>
                </div>
            </div>
            <div class="setting-group">
                <label>Mensaje Fuera de Horario</label>
                <textarea id="businessHoursMessage" placeholder="Ej: Nuestro horario es Lunes a Viernes de 9 a 17hs. Dejanos tu WhatsApp y te contactamos."></textarea>
                <button class="header-btn" style="margin-top: 10px; width: 100%; background: #000;" onclick="saveBusinessHours()">Guardar</button>
            </div>
            <div class="setting-group">
                <label>Respuestas Rápidas</label>
                <div id="quickReplyList"></div>
                <div class="add-quick-reply">
                    <input type="text" id="newQuickReplyTitle" placeholder="Título">
                    <input type="text" id="newQuickReplyMsg" placeholder="Mensaje">
                    <button onclick="addQuickReply()">+</button>
                </div>
            </div>
        </div>
    </div>
    
    <div class="welcome-overlay" id="welcomeOverlay">
        <div class="welcome-box">
            <h2>🏔️ Bienvenido al Dashboard de Soporte</h2>
            <p><strong>Importante:</strong> Este es el panel de atención al cliente de Mundo Outdoor.<br><br>
            Aquí verás todas las consultas de los clientes en tiempo real. Respondé con amabilidad y profesionalismo.<br><br>
            <strong>Recordá:</strong> Los mensajes que envíes llegarán directamente al chat del cliente en la web.</p>
            <button onclick="closeWelcome()">Entendido, comenzar</button>
        </div>
    </div>
    
    <div class="debug-panel" id="debugPanel"></div>
    <div class="toast" id="toast">
        <div class="toast-inner">
            <div>
                <div class="toast-title" id="toastTitle">Mensaje nuevo</div>
                <div class="toast-text" id="toastText">Te llegó un mensaje nuevo de un cliente.</div>
            </div>
            <button class="toast-close" onclick="hideToast()">×</button>
        </div>
    </div>
    
    <!-- POPUP ALERTA OBLIGATORIO -->
    <div class="alert-overlay" id="alertOverlay">
        <div class="alert-box">
            <div class="alert-icon">🔔</div>
            <h2>¡NUEVO MENSAJE!</h2>
            <p>Tenés un cliente esperando respuesta.<br>¡Atendelo ahora!</p>
            <div class="ticket-info" id="alertTicketInfo">Cliente nuevo</div>
            <button onclick="dismissAlert()">ENTENDIDO - VER MENSAJE</button>
        </div>
    </div>
    
    <!-- Audio notificacion -->
    <audio id="notifSound" preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+ZjHdtaXB8jJqgnpOEd3BxeIiWnp6XjH90cHN7iZaenZaLfnRxc3uJlp2dlot+dHFze4mWnZ2Wi350cXN7iZadnZaLfnRxc3uJlp2dlot+dHFze4mWnZ2Wi350cXN7iZadnZaLfnRxc3uJlp2dlot+dHFze4mWnZ2Wi350cXN7iZadnZaLfnRxc3uJlp2dlot+dHFze4mWnZ2Wi350cXN7iZadnZaLfnRxc3uJlp2dlot+dHFze4mWnZ2Wi350cXN7iZadnZaLfnRxc3uJlp2dlot+dA==" type="audio/wav">
    </audio>
    <script>
        function closeWelcome() {
            document.getElementById('welcomeOverlay').style.display = 'none';
            localStorage.setItem('dashboard_welcome_seen', 'true');
        }
        
        window.addEventListener('load', () => {
            const seen = localStorage.getItem('dashboard_welcome_seen');
            if (seen) {
                document.getElementById('welcomeOverlay').style.display = 'none';
            }
        });
    </script>
    <script>
        let currentTicketId = null, currentFilter = 'all', tickets = [], quickReplies = [], autoResponse = { enabled: false, message: '' };
        let lastUnseenCount = 0;
        let toastTimer = null;
        let alertShown = false;
        let titleInterval = null;
        let originalTitle = 'Soporte Mundo Outdoor';
        let pendingAlertTicket = null;
        
        function debugLog(msg) { document.getElementById('debugPanel').innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}<br>` + document.getElementById('debugPanel').innerHTML; }
        
        // Sonido de notificacion
        function playNotifSound() {
            try {
                const audio = document.getElementById('notifSound');
                audio.currentTime = 0;
                audio.play().catch(() => {});
            } catch(e) {}
        }
        
        // Titulo parpadeante
        function startTitleBlink(count) {
            if (titleInterval) clearInterval(titleInterval);
            let toggle = false;
            titleInterval = setInterval(() => {
                document.title = toggle ? `🔴 (${count}) MENSAJE NUEVO!` : `⚪ (${count}) ¡ATENDER AHORA!`;
                toggle = !toggle;
            }, 800);
        }
        
        function stopTitleBlink() {
            if (titleInterval) clearInterval(titleInterval);
            titleInterval = null;
            document.title = originalTitle;
        }
        
        // Popup obligatorio
        function showAlert(ticketInfo) {
            if (alertShown) return;
            alertShown = true;
            pendingAlertTicket = ticketInfo;
            document.getElementById('alertTicketInfo').textContent = ticketInfo || 'Cliente nuevo';
            document.getElementById('alertOverlay').classList.add('on');
            playNotifSound();
        }
        
        function dismissAlert() {
            alertShown = false;
            document.getElementById('alertOverlay').classList.remove('on');
            stopTitleBlink();
            // Si hay ticket pendiente, seleccionarlo
            if (pendingAlertTicket && tickets.length > 0) {
                const pending = tickets.find(t => !t.answered);
                if (pending) selectTicket(pending.ticket_id);
            }
            pendingAlertTicket = null;
        }
        
        function formatClientId(ticketId) { return ticketId.replace('BOT-', 'Cliente #'); }
        
        async function loadTickets() {
            const res = await fetch('/api/tickets');
            tickets = await res.json();
            renderTickets();
        }
        
        function renderTickets() {
            let filtered = currentFilter === 'unanswered' ? tickets.filter(t => !t.answered) : currentFilter === 'answered' ? tickets.filter(t => t.answered) : tickets;
            document.getElementById('ticketCount').textContent = `(${filtered.length})`;
            document.getElementById('ticketList').innerHTML = filtered.map(t => `
                <div class="ticket-item ${t.ticket_id === currentTicketId ? 'active' : ''} ${t.answered ? 'answered' : 'unanswered'}" onclick="selectTicket('${t.ticket_id}')">
                    <div class="ticket-id">${formatClientId(t.ticket_id)}</div>
                    <div class="ticket-preview">${t.last_message || 'Sin mensajes'}</div>
                    <div class="ticket-meta">
                        <span class="ticket-badge ${t.answered ? 'badge-answered' : 'badge-unanswered'}">${t.answered ? '✓ Respondido' : '⏳ Pendiente'}</span>
                        <span>${formatDate(t.updated_at)}</span>
                    </div>
                </div>
            `).join('');
        }
        
        async function selectTicket(ticketId) {
            currentTicketId = ticketId;
            document.getElementById('emptyState').style.display = 'none';
            document.getElementById('chatContent').style.display = 'flex';
            document.getElementById('chatTitle').textContent = formatClientId(ticketId);
            renderTickets();
            await loadMessages();
            await pollNotifications();
        }
        
        async function loadMessages() {
            if (!currentTicketId) return;
            const res = await fetch(`/api/tickets/${currentTicketId}`);
            const data = await res.json();
            const list = document.getElementById('messageList');
            list.innerHTML = data.messages.map(m => `
                <div class="message ${m.sender}">
                    <div class="message-bubble">${m.message}</div>
                    <div class="message-time">${formatDate(m.created_at)}</div>
                </div>
            `).join('');
            list.scrollTop = list.scrollHeight;
        }

        function showToast(title, text) {
            const toast = document.getElementById('toast');
            document.getElementById('toastTitle').textContent = title;
            document.getElementById('toastText').textContent = text;
            toast.classList.add('on');
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(() => hideToast(), 4500);
        }

        function hideToast() {
            const toast = document.getElementById('toast');
            toast.classList.remove('on');
        }

        function setHeaderNewMsg(unseen) {
            const banner = document.getElementById('newMsgBanner');
            const text = document.getElementById('newMsgBannerText');
            if (unseen > 0) {
                text.textContent = `MENSAJE (${unseen}) NUEVO!`;
                banner.classList.add('on');
            } else {
                banner.classList.remove('on');
            }
        }

        async function pollNotifications() {
            try {
                const res = await fetch('/api/notifications');
                const data = await res.json();
                const unseen = parseInt(data.unseen || 0);
                setHeaderNewMsg(unseen);
                
                // Si hay mensajes nuevos que antes no habia
                if (unseen > lastUnseenCount) {
                    const diff = unseen - lastUnseenCount;
                    
                    // 1. Toast
                    showToast('🔔 MENSAJE NUEVO', diff === 1 ? '¡Te llegó 1 mensaje nuevo!' : `¡Te llegaron ${diff} mensajes nuevos!`);
                    
                    // 2. Sonido
                    playNotifSound();
                    
                    // 3. Titulo parpadeante
                    startTitleBlink(unseen);
                    
                    // 4. Popup obligatorio (solo si no esta ya mostrado)
                    const pendingTicket = tickets.find(t => !t.answered);
                    const ticketInfo = pendingTicket ? formatClientId(pendingTicket.ticket_id) : `${unseen} mensaje(s) sin leer`;
                    showAlert(ticketInfo);
                }
                
                // Si ya no hay mensajes sin leer, parar el titulo parpadeante
                if (unseen === 0 && lastUnseenCount > 0) {
                    stopTitleBlink();
                }
                
                lastUnseenCount = unseen;
            } catch (e) {
                // Si falla, no rompemos UI
            }
        }
        
        async function sendReply() {
            const input = document.getElementById('replyInput');
            const message = input.value.trim();
            if (!message || !currentTicketId) return;
            debugLog(`Enviando: "${message.substring(0, 30)}..."`);
            await fetch(`/api/tickets/${currentTicketId}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
            input.value = '';
            await loadMessages();
            await loadTickets();
        }
        
        async function markAsAnswered() { if (currentTicketId) { await fetch(`/api/tickets/${currentTicketId}/answered`, { method: 'POST' }); await loadTickets(); } }
        async function deleteCurrentConversation() { if (currentTicketId && confirm('¿Borrar esta conversación?')) { await fetch(`/api/tickets/${currentTicketId}`, { method: 'DELETE' }); currentTicketId = null; document.getElementById('emptyState').style.display = 'flex'; document.getElementById('chatContent').style.display = 'none'; await loadTickets(); } }
        async function deleteAllConversations() { if (confirm('¿Borrar TODAS las conversaciones?')) { await fetch('/api/tickets/all', { method: 'DELETE' }); currentTicketId = null; document.getElementById('emptyState').style.display = 'flex'; document.getElementById('chatContent').style.display = 'none'; await loadTickets(); } }
        
        async function loadQuickReplies() { quickReplies = await (await fetch('/api/quick-replies')).json(); renderQuickReplies(); }
        function renderQuickReplies() {
            document.getElementById('quickReplies').innerHTML = quickReplies.map(q => `<button class="quick-reply-btn" onclick="useQuickReply('${q.message.replace(/'/g, "\\'")}')">${q.title}</button>`).join('');
            document.getElementById('quickReplyList').innerHTML = quickReplies.map(q => `<div class="quick-reply-item"><span>${q.title}</span><button onclick="deleteQuickReply(${q.id})">×</button></div>`).join('');
        }
        function useQuickReply(msg) { document.getElementById('replyInput').value = msg; }
        async function addQuickReply() { const t = document.getElementById('newQuickReplyTitle').value.trim(), m = document.getElementById('newQuickReplyMsg').value.trim(); if (t && m) { await fetch('/api/quick-replies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: t, message: m }) }); document.getElementById('newQuickReplyTitle').value = ''; document.getElementById('newQuickReplyMsg').value = ''; await loadQuickReplies(); } }
        async function deleteQuickReply(id) { await fetch(`/api/quick-replies/${id}`, { method: 'DELETE' }); await loadQuickReplies(); }
        
        async function loadAutoResponse() { autoResponse = await (await fetch('/api/auto-response')).json(); document.getElementById('autoResponseToggle').classList.toggle('active', autoResponse.enabled); document.getElementById('autoResponseStatus').textContent = autoResponse.enabled ? 'Activada' : 'Desactivada'; document.getElementById('autoResponseMessage').value = autoResponse.message; }
        async function toggleAutoResponse() { autoResponse.enabled = !autoResponse.enabled; await saveAutoResponse(); }
        async function saveAutoResponse() { await fetch('/api/auto-response', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: autoResponse.enabled, message: document.getElementById('autoResponseMessage').value }) }); await loadAutoResponse(); }
        
        let businessHours = { enabled: false, start_hour: 9, end_hour: 17, days: 'L,M,X,J,V', message: '' };
        async function loadBusinessHours() {
            businessHours = await (await fetch('/api/business-hours')).json();
            document.getElementById('businessHoursToggle').classList.toggle('active', businessHours.enabled);
            document.getElementById('businessHoursStatus').textContent = businessHours.enabled ? 'Activado' : 'Desactivado';
            document.getElementById('startHour').value = businessHours.start_hour;
            document.getElementById('endHour').value = businessHours.end_hour;
            document.getElementById('businessHoursMessage').value = businessHours.message;
            const selectedDays = businessHours.days.split(',');
            document.querySelectorAll('.day-checkbox').forEach(cb => {
                cb.checked = selectedDays.includes(cb.value);
            });
        }
        async function toggleBusinessHours() { businessHours.enabled = !businessHours.enabled; await saveBusinessHours(); }
        async function saveBusinessHours() {
            const selectedDays = Array.from(document.querySelectorAll('.day-checkbox:checked')).map(cb => cb.value).join(',');
            await fetch('/api/business-hours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enabled: businessHours.enabled,
                    start_hour: parseInt(document.getElementById('startHour').value) || 9,
                    end_hour: parseInt(document.getElementById('endHour').value) || 17,
                    days: selectedDays,
                    message: document.getElementById('businessHoursMessage').value
                })
            });
            await loadBusinessHours();
        }
        
        function toggleSettings() { document.getElementById('settingsPanel').classList.toggle('open'); }
        function toggleDebug() { document.getElementById('debugPanel').classList.toggle('open'); }
        function formatDate(d) { if (!d) return ''; const dt = new Date(d), now = new Date(); return dt.toDateString() === now.toDateString() ? dt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : dt.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }); }
        
        document.querySelectorAll('.filter-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); currentFilter = tab.dataset.filter; renderTickets(); }));
        document.getElementById('replyInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } });
        setInterval(async () => { await loadTickets(); if (currentTicketId) await loadMessages(); }, 5000);
        setInterval(async () => { await pollNotifications(); }, 1500);
        loadTickets(); loadQuickReplies(); loadAutoResponse(); loadBusinessHours(); pollNotifications();
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    return render_template_string(DASHBOARD_HTML)

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT t.*, (SELECT message FROM messages WHERE ticket_id = t.ticket_id ORDER BY created_at DESC LIMIT 1) as last_message FROM tickets t ORDER BY t.updated_at DESC')
    tickets = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(tickets)

@app.route('/api/tickets/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM tickets WHERE ticket_id = ?', (ticket_id,))
    ticket = c.fetchone()
    if not ticket: return jsonify({'error': 'Not found'}), 404
    c.execute('SELECT * FROM messages WHERE ticket_id = ? ORDER BY created_at ASC', (ticket_id,))
    messages = [dict(row) for row in c.fetchall()]
    # Marcar como vistos los mensajes del cliente cuando el agente abre la conversación
    c.execute("UPDATE messages SET seen = 1 WHERE ticket_id = ? AND sender = 'user'", (ticket_id,))
    conn.commit()
    conn.close()
    return jsonify({'ticket': dict(ticket), 'messages': messages})


@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    """Cantidad de mensajes nuevos (no vistos) del cliente en todas las conversaciones."""
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) as cnt FROM messages WHERE sender = 'user' AND seen = 0")
    cnt = c.fetchone()[0]
    conn.close()
    return jsonify({'unseen': int(cnt)})

@app.route('/api/tickets/<ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM messages WHERE ticket_id = ?', (ticket_id,))
    c.execute('DELETE FROM tickets WHERE ticket_id = ?', (ticket_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/tickets/all', methods=['DELETE'])
def delete_all_tickets():
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM messages')
    c.execute('DELETE FROM tickets')
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/tickets/<ticket_id>/reply', methods=['POST'])
def reply_to_ticket(ticket_id):
    data = request.json
    message = data.get('message', '').strip()
    if not message: return jsonify({'error': 'Message required'}), 400
    conn = get_db()
    c = conn.cursor()
    c.execute('INSERT INTO messages (ticket_id, sender, message) VALUES (?, ?, ?)', (ticket_id, 'agent', message))
    c.execute('UPDATE tickets SET updated_at = CURRENT_TIMESTAMP, answered = 1 WHERE ticket_id = ?', (ticket_id,))
    conn.commit()
    conn.close()
    debug_log(f"AGENT REPLY to {ticket_id}: {message[:50]}...")
    return jsonify({'success': True})

@app.route('/api/tickets/<ticket_id>/answered', methods=['POST'])
def mark_answered(ticket_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE tickets SET answered = 1 WHERE ticket_id = ?', (ticket_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/tickets/<ticket_id>/messages', methods=['GET', 'OPTIONS'])
def get_ticket_messages(ticket_id):
    if request.method == 'OPTIONS': return '', 200
    last_id = request.args.get('after', 0, type=int)
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM messages WHERE ticket_id = ? AND id > ? ORDER BY created_at ASC', (ticket_id, last_id))
    messages = [dict(row) for row in c.fetchall()]
    conn.close()
    if messages: debug_log(f"POLLING {ticket_id}: {len(messages)} new")
    return jsonify({'messages': messages})

@app.route('/api/quick-replies', methods=['GET'])
def get_quick_replies():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM quick_replies WHERE active = 1')
    replies = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(replies)

@app.route('/api/quick-replies', methods=['POST'])
def add_quick_reply():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute('INSERT INTO quick_replies (title, message) VALUES (?, ?)', (data['title'], data['message']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/quick-replies/<int:reply_id>', methods=['DELETE'])
def delete_quick_reply(reply_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM quick_replies WHERE id = ?', (reply_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/auto-response', methods=['GET'])
def get_auto_response():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM auto_response WHERE id = 1')
    row = c.fetchone()
    conn.close()
    return jsonify({'enabled': bool(row['enabled']), 'message': row['message']})

@app.route('/api/auto-response', methods=['POST'])
def set_auto_response():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE auto_response SET enabled = ?, message = ? WHERE id = 1', (1 if data['enabled'] else 0, data['message']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

def is_business_hours():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM business_hours WHERE id = 1')
    config = c.fetchone()
    conn.close()
    if not config or not config['enabled']:
        return True
    now = datetime.now()
    current_hour = now.hour
    weekday_map = {0: 'L', 1: 'M', 2: 'X', 3: 'J', 4: 'V', 5: 'S', 6: 'D'}
    current_day = weekday_map[now.weekday()]
    allowed_days = config['days'].split(',')
    if current_day not in allowed_days:
        return False
    if current_hour < config['start_hour'] or current_hour >= config['end_hour']:
        return False
    return True

@app.route('/assist', methods=['POST', 'OPTIONS'])
def assist():
    if request.method == 'OPTIONS': return '', 200
    data = request.json or {}
    debug_log("INCOMING MESSAGE", data)
    ticket_id = data.get('ticketId', f"CLI-{int(datetime.now().timestamp() * 1000)}")
    message = data.get('message', '')
    source = data.get('source', 'web')
    page = data.get('context', {}).get('page', '')
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM tickets WHERE ticket_id = ?', (ticket_id,))
    existing_ticket = c.fetchone()
    is_new_ticket = not existing_ticket
    if is_new_ticket:
        c.execute('INSERT INTO tickets (ticket_id, source, page, status, answered) VALUES (?, ?, ?, ?, ?)', (ticket_id, source, page, 'open', 0))
    else:
        c.execute('UPDATE tickets SET updated_at = CURRENT_TIMESTAMP, status = ? WHERE ticket_id = ?', ('open', ticket_id))
    if message:
        c.execute('INSERT INTO messages (ticket_id, sender, message) VALUES (?, ?, ?)', (ticket_id, 'user', message))
    reply = None
    if not is_business_hours():
        c.execute('SELECT * FROM business_hours WHERE id = 1')
        bh = c.fetchone()
        if bh and bh['enabled']:
            reply = bh['message']
    elif is_new_ticket:
        c.execute('SELECT * FROM auto_response WHERE id = 1')
        auto = c.fetchone()
        if auto and auto['enabled']:
            reply = auto['message']
    conn.commit()
    conn.close()
    return jsonify({'ticketId': ticket_id, 'reply': reply, 'success': True})

@app.route('/api/business-hours', methods=['GET'])
def get_business_hours():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM business_hours WHERE id = 1')
    row = c.fetchone()
    conn.close()
    return jsonify({'enabled': bool(row['enabled']), 'start_hour': row['start_hour'], 'end_hour': row['end_hour'], 'days': row['days'], 'message': row['message']})

@app.route('/api/business-hours', methods=['POST'])
def set_business_hours():
    data = request.json
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE business_hours SET enabled = ?, start_hour = ?, end_hour = ?, days = ?, message = ? WHERE id = 1', 
              (1 if data['enabled'] else 0, data['start_hour'], data['end_hour'], data['days'], data['message']))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/session', methods=['POST', 'OPTIONS'])
def create_session():
    if request.method == 'OPTIONS': return '', 200
    data = request.json or {}
    ticket_id = data.get('ticketId', f"CLI-{int(datetime.now().timestamp() * 1000)}")
    return jsonify({'ticketId': ticket_id, 'enabled': True, 'success': True})

if __name__ == '__main__':
    init_db()
    print("\n" + "="*50)
    print("🏔️  SOPORTE MUNDO OUTDOOR")
    print("="*50)
    print("📋 Dashboard: http://localhost:5050")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=5050, debug=True, threaded=True)
