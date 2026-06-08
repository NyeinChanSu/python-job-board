import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formState, setFormState] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    fetch(`/jobs/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Job not found');
        }
        return response.json();
      })
      .then(data => {
        setFormState({
          title: data.title,
          company: data.company,
          location: data.location,
          description: data.description,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load job data.');
        setLoading(false);
      });
  }, [id, isEdit]);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setError(null);

    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/jobs/${id}` : '/jobs';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Save failed');
        }
        return response.json();
      })
      .then(data => {
        navigate(`/jobs/${data.id}`);
      })
      .catch(() => {
        setError('Unable to save the job. Please check the fields and try again.');
      });
  };

  if (loading) {
    return <p>Loading job form...</p>;
  }

  return (
    <section className="job-form">
      <h2>{isEdit ? 'Edit Job' : 'Post a New Job'}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Job title</label>
        <input
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          value={formState.company}
          onChange={handleChange}
          required
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          value={formState.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          required
        />

        <div className="job-actions">
          <button type="submit" className="button-primary">
            {isEdit ? 'Save Changes' : 'Create Job'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default JobForm;
