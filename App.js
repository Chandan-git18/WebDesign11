import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [technology, setTechnology] = useState("");
  const [message, setMessage] = useState("");

  // Fetch projects
  const fetchProjects = () => {
    fetch("http://localhost:3000/projects")
      .then(res => res.json())
      .then(data => setProjects(data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !title || !technology) {
      setMessage("⚠ Please fill all fields");
      return;
    }

    fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, title, technology })
    })
      .then(res => res.json())
      .then(() => {
        setMessage("✅ Project added successfully");
        setName("");
        setTitle("");
        setTechnology("");
        fetchProjects(); // refresh list
      })
      .catch(() => setMessage("❌ Error adding project"));
  };

  return (
    <div className="container">
      <h1>EngiVerse – Engineering Project Hub</h1>

      {/* FORM */}
      <form className="form" onSubmit={handleSubmit}>
        <h2>Add New Project</h2>

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Technology Used"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
        />

        <button type="submit">Add Project</button>

        <p className="msg">{message}</p>
      </form>

      {/* DASHBOARD */}
      <h2 className="dash-title">Project Dashboard</h2>

      {projects.map((p) => (
        <div className="card" key={p.id}>
          <h3>{p.title}</h3>
          <p><b>Student:</b> {p.name}</p>
          <p><b>Technology:</b> {p.technology}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
