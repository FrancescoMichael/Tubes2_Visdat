from models.base import db

class ConstructorStanding(db.Model):
    __tablename__ = 'constructor_standings'

    constructorStandingsId = db.Column(db.Integer, primary_key=True)
    raceId = db.Column(db.Integer, db.ForeignKey('races.raceId'))
    constructorId = db.Column(db.Integer, db.ForeignKey('constructors.constructorId'))
    points = db.Column(db.Float)
    position = db.Column(db.Integer)
    positionText = db.Column(db.String(255))
    wins = db.Column(db.Integer)

    race = db.relationship('Race', backref='constructor_standings')
    constructor = db.relationship('Constructor', backref='standings')

    def __repr__(self):
        return f'<ConstructorStanding {self.constructorId} P{self.position}>'
