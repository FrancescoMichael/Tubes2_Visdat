from flask import Blueprint
from app.services.journeys_service import get_driver_journeys, get_constructor_journeys

journeys_bp = Blueprint('journeys', __name__)

@journeys_bp.route('/journeys/drivers/<int:year>', methods=['GET'])
def drivers_journeys(year):
    return get_driver_journeys(year)

@journeys_bp.route('/journeys/constructors/<int:year>', methods=['GET'])
def constuctors_journeys(year):
    return get_constructor_journeys(year)