import os
from flask import Flask,send_from_directory
from flask_cors import CORS

from config import Config
from models import db

from app.routes.standings import standings_bp
from app.routes.meta import meta_bp
from app.routes.journeys import journeys_bp
from app.routes.stats import stats_bp
from app.routes.circuits import circuits_bp

def create_app(config_class=Config):
    REACT_BUILD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/dist'))
    app = Flask(__name__, static_folder=REACT_BUILD_DIR, static_url_path='/')
    app.config.from_object(config_class)

    # Tell Flask where to find the React build
    @app.route('/')
    def serve_react_app():
        return send_from_directory(REACT_BUILD_DIR, 'index.html')
    
    @app.route('/<path:path>')
    def serve_static(path):
        full_path = os.path.join(REACT_BUILD_DIR, path)
        if os.path.exists(full_path):
            return send_from_directory(REACT_BUILD_DIR, path)
        else:
            # This handles React Router fallback
            return send_from_directory(REACT_BUILD_DIR, 'index.html')

    db.init_app(app)
    CORS(app)

    blueprints = [circuits_bp, standings_bp, meta_bp, journeys_bp, stats_bp]
    for blueprint in blueprints:
        app.register_blueprint(blueprint, url_prefix='/api')

    return app
