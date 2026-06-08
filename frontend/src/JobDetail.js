import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/jobs/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Job not found');
        }
        return response.json();
      })
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load job details.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('Delete this job?')) {
      return;
    }

    fetch(`/jobs/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Delete failed');
        }
        navigate('/');
      })
      .catch(() => {
        setError('Could not delete the job.');
      });
  };

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div className="job-detail">
      <h2>{job.title}</h2>
      <p className="job-company">{job.company}</p>
      <p className="job-location">{job.location}</p>
      <p>{job.description}</p>

      <div className="job-actions">
        <Link to={`/jobs/${job.id}/edit`} className="button-primary">
          Edit Job
        </Link>
        <button type="button" onClick={handleDelete} className="button-primary job-delete">
          Delete Job
        </button>
        <Link to="/" className="button-link">
          Back to Jobs
        </Link>
      </div>
    </div>
  );
}

export default JobDetail;
