import React, { useState } from 'react';
import axios from 'axios';
import './UploadPage.css';

export const UploadPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setVideo(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('duration', '00:15');
        formData.append('free', 'true');
        formData.append('video', video);

        try {
            const response = await axios.post('http://localhost:8080/api/video/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage('Error uploading video');
        }
    };

    return (
        <div className="upload-container">
            <h1>Subir Video</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Titulo:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Descripcion:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="video">Video:</label>
                    <input
                        type="file"
                        id="video"
                        accept="video/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit">SUBIR</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadPage;
