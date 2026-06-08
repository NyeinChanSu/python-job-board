from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

app = Flask(__name__)
CORS(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
db_file = os.environ.get("DATABASE_URL") or f"sqlite:///{os.path.join(basedir, 'jobs.db')}"
app.config["SQLALCHEMY_DATABASE_URI"] = db_file
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "description": self.description,
            "location": self.location,
        }


@app.route("/")
def home():
    return "Welcome to the Python Job Board API! Use /jobs to see job listings."

def row_to_job(row):
    return {
        "id": row[0],
        "title": row[1],
        "company": row[2],
        "description": row[3],
        "location": row[4]
    }


@app.route("/jobs", methods=["GET"])
def get_jobs():
    jobs = Job.query.all()
    return jsonify([j.to_dict() for j in jobs])


@app.route("/jobs", methods=["POST"])
def create_job():
    data = request.get_json() or {}
    required = ("title", "company", "description", "location")
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    job = Job(
        title=data["title"],
        company=data["company"],
        description=data["description"],
        location=data["location"],
    )
    db.session.add(job)
    db.session.commit()
    return jsonify(job.to_dict()), 201


@app.route("/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job.to_dict())


@app.route("/jobs/<int:job_id>", methods=["PUT"])
def update_job(job_id):
    data = request.get_json() or {}
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    for field in ("title", "company", "description", "location"):
        if field in data:
            setattr(job, field, data[field])

    db.session.commit()
    return jsonify(job.to_dict())


@app.route("/jobs/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted"}), 200

if __name__ == "__main__":
    # create tables if they don't exist (works without running migrations)
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", debug=True)