import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JobList from './JobList';
import JobDetail from './JobDetail';
import JobForm from './JobForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Python Job Board</h1>
          <nav className="App-nav">
            <Link to="/">Jobs</Link>
            <Link to="/jobs/new">Post a Job</Link>
          </nav>
        </header>

        <main className="App-content">
          <Routes>
            <Route path="/" element={<JobList />} />
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/jobs/:id/edit" element={<JobForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;