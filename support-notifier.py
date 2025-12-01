import time
import requests
from datetime import datetime

API_BASE_URL = "https://mundooutdoorar.vtexcommercestable.com.br"  # backend estable de VTEX
PENDING_ENDPOINT = "/_v/mundo/support/pending?workspace=pandemoniumdev"
POLL_INTERVAL_SECONDS = 10

try:
    from win10toast import ToastNotifier
    toaster = ToastNotifier()
except ImportError:
    toaster = None


def show_notification(title: str, message: str):
    print(f"[{datetime.now().isoformat(timespec='seconds')}] {title}: {message}")
    if toaster is not None:
        try:
            toaster.show_toast(title, message, duration=10, threaded=True)
        except Exception:
            pass


def poll_loop():
    show_notification("Mundo Outdoor Soporte", "Notificador iniciado. Esperando mensajes...")

    while True:
        try:
            url = API_BASE_URL + PENDING_ENDPOINT
            response = requests.get(url, timeout=5)
            response.raise_for_status()

            messages = response.json() or []

            if messages:
                for msg in messages:
                    name = msg.get("name") or "Cliente"
                    text = msg.get("message") or "(sin mensaje)"
                    origin = msg.get("from") or "web"

                    preview = text
                    if len(preview) > 120:
                        preview = preview[:117] + "..."

                    notif_title = f"Nuevo mensaje ({origin})"
                    notif_body = f"{name}: {preview}"

                    show_notification(notif_title, notif_body)

        except Exception as e:
            print(f"Error consultando mensajes: {e}")

        time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    poll_loop()
