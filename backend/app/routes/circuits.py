from flask import Blueprint
from app.services.circuits_service import get_circuits_with_results, get_circuits_by_year, get_circuits_details

circuits_bp = Blueprint('circuits', __name__)

@circuits_bp.route('/circuits/<int:year>', methods=['GET'])
def detail_circuits_years(year): 
    return get_circuits_by_year(year)

@circuits_bp.route('/circuits/results/<int:year>/<int:circuit_id>', methods=['GET'])
def detail_circuits_year_id(year, circuit_id):
    return get_circuits_with_results(year, circuit_id)