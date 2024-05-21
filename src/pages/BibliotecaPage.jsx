import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './BibliotecaPage.css';

export const BibliotecaPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/video/video');
        setVideos(response.data.video);
      } catch (error) {
        setError('Error fetching videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="biblioteca-container">
      <h1>BIBLIOTECA</h1>
      <div className="video-grid">
      {videos.map((video) => (
          <Link to={`/ReproducirPage/${video._id}`} key={video._id} className="video-card">
            <h2>{video.name}</h2>
            <p>{video.description}</p>
            <video width="320" height="240" controls>
              <source src={`http://localhost:8080/${video.videoPath}`} type="video/mp4" />
            </video>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BibliotecaPage;
