import React, { useState } from 'react';
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [picUrl, setPicUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUploadImg = (img) => {
    setLoading(true)
    const data = new FormData()
    data.append('file', img)
    data.append('upload_preset', 'city-suggestions')
    data.append('cloud_name', 'cloudinary-img-app')
    fetch('https://api.cloudinary.com/v1_1/cloudinary-img-app/image/upload', {
      method: 'POST',
      body: data
    })
      .then((res) => res.json())
      .then((data) => {
        setPicUrl(data.url);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleCreateSuggestion = () => {
      fetch('/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          title,
          body,
          picUrl
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({html: data.error, classes: '#c62828 red darken-3'});
          } else {
            M.toast({html: 'Created suggestion successfully' });
            history.push('/')
          }
        })
        .catch((err) => {
          console.log(err);
        })
  }

  return (
    <div className="card input-filed create-card">
      <h5>Create your suggestion:</h5>
      <div className="input-field">
          <input
            id="title"
            type="text"
            className="validate"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="title">Title</label>
      </div>
      <div className="input-field">
        <input
          id="body"
          type="text"
          className="validate"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <label htmlFor="body">Body</label>
      </div>
      <div className="file-field input-field">
        <div className="btn grey">
          <span>{loading ? 'Loading...' : 'Upload Image'}</span>
          <input
            type="file"
            onChange={(e) => handleUploadImg(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light"
        onClick={handleCreateSuggestion}
        disabled={picUrl === '' ? true : false}
      >
          Create
      </button>
    </div>
  )
}

export default CreatePost;