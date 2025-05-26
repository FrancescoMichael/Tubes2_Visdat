from flask import Blueprint, jsonify
from app.services.meta_service import get_available_years, get_health

meta_bp = Blueprint('meta', __name__)

@meta_bp.route('/years', methods=['GET'])
def available_years():
    return get_available_years()

@meta_bp.route('/health', methods=['GET'])
def health():
    return get_health()