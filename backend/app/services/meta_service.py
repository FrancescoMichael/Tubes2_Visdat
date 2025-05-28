from flask import jsonify
from models import db, Race

def get_available_years():
    try:
        years = db.session.query(Race.year).distinct().order_by(Race.year.desc()).all()
        return jsonify({'years': [y[0] for y in years]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_health():
    return jsonify({'status': 'healthy'})