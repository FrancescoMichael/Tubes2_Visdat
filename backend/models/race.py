from models.base import db

class Race(db.Model):
    __tablename__ = 'races'

    raceId = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer)
    round = db.Column(db.Integer)
    circuitId = db.Column(db.Integer)
    name = db.Column(db.String(255))
    date = db.Column(db.Date)
    time = db.Column(db.Time)
    url = db.Column(db.String(255))
    fp1_date = db.Column(db.Date)
    fp1_time = db.Column(db.Time)
    fp2_date = db.Column(db.Date)
    fp2_time = db.Column(db.Time)
    fp3_date = db.Column(db.Date)
    fp3_time = db.Column(db.Time)
    quali_date = db.Column(db.Date)
    quali_time = db.Column(db.Time)
    sprint_date = db.Column(db.Date)
    sprint_time = db.Column(db.Time)

    def __repr__(self):
        return f'<Race {self.year} {self.name}>'
