from models.base import db

class Constructor(db.Model):
    __tablename__ = 'constructors'

    constructorId = db.Column(db.Integer, primary_key=True)
    constructorRef = db.Column(db.String(255))
    name = db.Column(db.String(255))
    nationality = db.Column(db.String(255))
    url = db.Column(db.String(255))
    color = db.Column(db.String(10))

    def __repr__(self):
        return f'<Constructor {self.name}>'