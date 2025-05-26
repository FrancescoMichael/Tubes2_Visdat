from flask import Blueprint
from app.services.stats_service import get_stats_poles, get_stats_wins

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats/poles/<int:year>', methods=['GET'])
def stats_poles(year):
    return get_stats_poles(year)

@stats_bp.route('/stats/wins/<int:year>', methods=['GET'])
def stats_wins(year):
    return get_stats_wins(year)