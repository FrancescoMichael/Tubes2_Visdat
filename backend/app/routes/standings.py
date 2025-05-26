from flask import Blueprint, jsonify, request
from app.services.standings_service import get_standings, get_driver_standings, get_constructor_standings

standings_bp = Blueprint('standings', __name__)

@standings_bp.route('/standings/<int:year>', methods=['GET'])
def standings(year):
    return get_standings(year)

@standings_bp.route('/standings/drivers/<int:year>', methods=['GET'])
def drivers_standings(year):
    return get_driver_standings(year)

@standings_bp.route('/standings/constructors/<int:year>', methods=['GET'])
def constructors_standings(year):
    return get_constructor_standings(year)