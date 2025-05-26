from models.base import db

class Result(db.Model):
    __tablename__ = 'results'

    resultId = db.Column(db.Integer, primary_key=True)
    raceId = db.Column(db.Integer, db.ForeignKey('races.raceId'))
    driverId = db.Column(db.Integer, db.ForeignKey('drivers.driverId'))
    constructorId = db.Column(db.Integer, db.ForeignKey('constructors.constructorId'))
    number = db.Column(db.Integer)
    grid = db.Column(db.Integer)
    position = db.Column(db.Integer)
    positionText = db.Column(db.String(255))
    positionOrder = db.Column(db.Integer)
    points = db.Column(db.Float)
    laps = db.Column(db.Integer)
    time = db.Column(db.String(255))
    milliseconds = db.Column(db.Integer)
    fastestLap = db.Column(db.Integer)
    rank = db.Column(db.Integer)
    fastestLapTime = db.Column(db.String(255))
    fastestLapSpeed = db.Column(db.String(255))
    statusId = db.Column(db.Integer)

    race = db.relationship('Race', backref='results')
    driver = db.relationship('Driver', backref='results')
    constructor = db.relationship('Constructor', backref='results')

    def __repr__(self):
        return f'<Result Driver {self.driverId} in Race {self.raceId}>'
