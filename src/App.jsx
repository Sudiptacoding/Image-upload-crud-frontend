import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null); // নতুন state for editing
  const [newFile, setNewFile] = useState(null); // new file for edit

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEditFileChange = (e) => {
    setNewFile(e.target.files[0]); // file for editing
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', file);
    await axios.post('http://localhost:5000/upload', formData);
    fetchImages();
  };

  const fetchImages = async () => {
    const res = await axios.get('http://localhost:5000/images');
    setImages(res.data);
  };

  const deleteImage = async (id) => {
    await axios.delete(`http://localhost:5000/images/${id}`);
    fetchImages();
  };

  const editImage = async (id) => {
    const formData = new FormData();
    if (newFile) {
      formData.append('image', newFile); // new image for edit
    }
    await axios.put(`http://localhost:5000/images/${id}`, formData);
    fetchImages();
    setEditId(null); // reset editId after updating
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadImage}>Upload</button>
      <div>
        {images.map(image => (
          <div key={image.id}>
            <img src={`http://localhost:5000/uploads/${image.image}`} alt="uploaded" style={{ width: '100px' }} />
            <button onClick={() => deleteImage(image.id)}>Delete</button>
            {editId === image.id ? (
              <div>
                <input type="file" onChange={handleEditFileChange} />
                <button onClick={() => editImage(image.id)}>Update</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setEditId(image.id)}>Edit</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
