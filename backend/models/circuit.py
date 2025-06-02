from models.base import db

class Circuit(db.Model):
    __tablename__ = 'circuits'

    circuitId = db.Column(db.Integer, primary_key=True)
    circuitRef = db.Column(db.String(255))
    name = db.Column(db.String(255))
    location = db.Column(db.String(255))
    country = db.Column(db.String(255))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    alt = db.Column(db.Integer)
    url = db.Column(db.String(255))
    last_length_used = db.Column(db.String(255))
    turns = db.Column(db.String(255))
    image_url = db.Column(db.String(255))

    races = db.relationship('Race', backref='circuit', lazy=True)

    def __repr__(self):
        return f'<Circuit {self.name}>'