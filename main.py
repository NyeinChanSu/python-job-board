from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect("jobs.db")
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        company TEXT,
        description TEXT,
        location TEXT
    )""")
    conn.commit()
    conn.close()
@app.route("/")
def home():
    return "Welcome to the Python Job Board API! Use /jobs to see job listings."

@app.route("/jobs", methods=["GET"])
def get_jobs():
    conn = sqlite3.connect("jobs.db")
    c = conn.cursor()
    c.execute("SELECT * FROM jobs")
    rows = c.fetchall()
    conn.close()
    jobs = []
    for row in rows:
        jobs.append({
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "description": row[3],
            "location": row[4]
        })
    return jsonify(jobs)

@app.route("/post-job", methods=["POST"])
def post_job():
    data = request.json
    conn = sqlite3.connect("jobs.db")
    c = conn.cursor()
    c.execute("INSERT INTO jobs (title, company, description, location) VALUES (?, ?, ?, ?)",
              (data["title"], data["company"], data["description"], data["location"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Job posted successfully!"})

if __name__ == "__main__":
    init_db()
    app.run(debug=True)