import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/jobs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load jobs');
        }
        return response.json();
      })
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load job listings.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="job-list">
      <h2>Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No jobs yet. Create one using the button above.</p>
      ) : (
        <div className="job-grid">
          {jobs.map(job => (
            <article key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p className="job-company">{job.company}</p>
              <p className="job-location">{job.location}</p>
              <p>{job.description}</p>
              <Link to={`/jobs/${job.id}`} className="button-link">
                View details
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;