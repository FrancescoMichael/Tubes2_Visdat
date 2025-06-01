from flask import Flask
from flask_cors import CORS

from config import Config
from models import db

from app.routes.standings import standings_bp
from app.routes.meta import meta_bp
from app.routes.journeys import journeys_bp
from app.routes.stats import stats_bp
from app.routes.circuits import circuits_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(app)

    blueprints = [circuits_bp, standings_bp, meta_bp, journeys_bp, stats_bp]
    for blueprint in blueprints:
        app.register_blueprint(blueprint, url_prefix='/api')

    return app
