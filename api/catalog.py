#!/usr/bin/env python3
"""
IC-Campus Catalog REST API
IC-TechDojo — Portail interne de formations DevOps, Cloud & Cybersécurité

Routes:
    GET /icgroup/api/v1.0/catalog          → liste toutes les formations (auth requise)
    GET /icgroup/api/v1.0/catalog/<id>     → détail d'une formation (auth requise)
    GET /health                            → healthcheck (sans auth)
"""

import json
import os

from flask import Flask, abort, jsonify, make_response
from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
auth = HTTPBasicAuth()

# ── Configuration ─────────────────────────────────────────────────────────────
CATALOG_PATH: str = os.getenv("CATALOG_PATH", "/data/catalog.json")
API_USER: str = os.getenv("API_USER", "icadmin")
API_PASSWORD: str = os.getenv("API_PASSWORD", "ic@2024")
SLACK_WEBHOOK: str | None = os.getenv("SLACK_WEBHOOK_URL")


# ── Authentication ─────────────────────────────────────────────────────────────
@auth.get_password
def get_password(username: str) -> str | None:
    """Retourne le mot de passe si l'utilisateur est reconnu, sinon None."""
    return API_PASSWORD if username == API_USER else None


@auth.error_handler
def unauthorized() -> tuple:
    return make_response(
        jsonify({"error": "Unauthorized", "message": "Credentials invalides ou manquants."}),
        401,
    )


# ── Helpers ────────────────────────────────────────────────────────────────────
def _load_catalog() -> dict:
    """Charge et retourne le catalogue depuis le fichier JSON monté en volume."""
    with open(CATALOG_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _notify_startup() -> None:
    """Envoie une notification de démarrage si SLACK_WEBHOOK_URL est défini."""
    if not SLACK_WEBHOOK:
        return
    try:
        import requests  # noqa: PLC0415 — import tardif intentionnel (dépendance optionnelle)
        requests.post(
            SLACK_WEBHOOK,
            json={"text": "✅ IC-Campus API démarrée avec succès."},
            timeout=5,
        )
    except Exception:  # noqa: BLE001 — inclut requests.RequestException et ImportError
        # La notification ne doit jamais bloquer le démarrage de l'API
        pass


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.route("/icgroup/api/v1.0/catalog", methods=["GET"])
@auth.login_required
def get_catalog():
    """Retourne la liste complète des formations disponibles."""
    data = _load_catalog()
    return jsonify(
        {
            "catalog": data["catalog"],
            "total": len(data["catalog"]),
            "version": data.get("version", "1.0"),
        }
    )


@app.route("/icgroup/api/v1.0/catalog/<int:training_id>", methods=["GET"])
@auth.login_required
def get_training(training_id: int):
    """Retourne le détail d'une formation par son identifiant."""
    data = _load_catalog()
    training = next((t for t in data["catalog"] if t["id"] == training_id), None)
    if training is None:
        abort(404)
    return jsonify(training)


@app.route("/health", methods=["GET"])
def health():
    """Endpoint de healthcheck — utilisé par Docker et les orchestrateurs."""
    return jsonify({"status": "ok", "service": "ic-campus-api", "version": "1.0"})


# ── Error handlers ─────────────────────────────────────────────────────────────
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"error": "Not found", "message": "Formation introuvable."}), 404)


@app.errorhandler(500)
def internal_error(error):
    return make_response(jsonify({"error": "Internal server error"}), 500)


# ── Startup ────────────────────────────────────────────────────────────────────
# Notification exécutée à l'import du module (démarrage gunicorn ou test).
# Sans SLACK_WEBHOOK_URL défini, _notify_startup() retourne immédiatement.
_notify_startup()
