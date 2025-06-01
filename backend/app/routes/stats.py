from flask import Blueprint
from app.services.stats_service import get_driver_stats_pole, get_driver_stats_win,get_team_stats_poles,get_team_stats_wins, get_season_summary

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats/summary/<int:year>', methods=['GET'])
def stats_summary(year):
    return get_season_summary(year)

@stats_bp.route('/stats/poles/drivers/<int:year>', methods=['GET'])
def stats_poles_driver(year):
    return get_driver_stats_pole(year)

@stats_bp.route('/stats/wins/drivers/<int:year>', methods=['GET'])
def stats_wins_driver(year):
    return get_driver_stats_win(year)

@stats_bp.route('/stats/poles/constructors/<int:year>', methods=['GET'])
def stats_poles_team(year):
    return get_team_stats_poles(year)

@stats_bp.route('/stats/wins/constructors/<int:year>', methods=['GET'])
def stats_wins_team(year):
    return get_team_stats_wins(year)
