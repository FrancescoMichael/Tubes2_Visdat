from models.base import db

class DriverStanding(db.Model):
    __tablename__ = 'driver_standings'

    driverStandingsId = db.Column(db.Integer, primary_key=True)
    raceId = db.Column(db.Integer, db.ForeignKey('races.raceId'))
    driverId = db.Column(db.Integer, db.ForeignKey('drivers.driverId'))
    points = db.Column(db.Float)
    position = db.Column(db.Integer)
    positionText = db.Column(db.String(255))
    wins = db.Column(db.Integer)

    race = db.relationship('Race', backref='driver_standings')
    driver = db.relationship('Driver', backref='standings')

    def __repr__(self):
        return f'<DriverStanding {self.driverId} P{self.position}>'
