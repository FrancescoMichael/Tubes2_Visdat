from models.base import db

class Driver(db.Model):
    __tablename__ = 'drivers'

    driverId = db.Column(db.Integer, primary_key=True)
    driverRef = db.Column(db.String(255))
    number = db.Column(db.Integer)
    code = db.Column(db.String(3))
    forename = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    dob = db.Column(db.Date)
    nationality = db.Column(db.String(255))
    url = db.Column(db.String(255))

    def __repr__(self):
        return f'<Driver {self.forename} {self.surname}>'