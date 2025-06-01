from models.base import db

class Status(db.Model):
    __tablename__ = 'statuses'

    statusId = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(255))

    def __repr__(self):
        return f'<Status {self.status}>'
