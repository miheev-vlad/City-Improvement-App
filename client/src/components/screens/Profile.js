import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css';
import { UserContext } from '../../App'

const Profile = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [image, setImage] = useState('')
  const {state,dispatch} = useContext(UserContext)
  const [picLoad, setPicLoad] = useState(false)
  const history = useHistory();

  useEffect(() => {
    setLoading(true)
    fetch('/mysuggestions', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.suggestions)
        setLoading(false)
        setShow(true)
      })
  }, [])

  const deleteSuggHandler = (id) => {
    fetch(`/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.error) {
          M.toast({html: result.error, classes: '#c62828 red darken-3'});
        } else {
          const newData = data.filter((item) => {
            return item._id !== result.result._id
          })
          setData(newData)
          M.toast({html: result.message});
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  useEffect(()=>{
    if(image){
      setPicLoad(true)
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', 'city-suggestions')
      data.append('cloud_name', 'cloudinary-img-app')
      fetch('https://api.cloudinary.com/v1_1/cloudinary-img-app/image/upload', {
        method: 'POST',
        body: data
    })
      .then((res) => res.json())
      .then((data) => {
        fetch('/updatepic', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                pic: data.url
            })
        }).then((res) => res.json())
          .then((result) => {
            localStorage.setItem('user', JSON.stringify({ ...state, photo: result.photo }))
            dispatch({ type: 'UPDATEPIC', payload: result.photo })
            setPicLoad(false)
        })
      })
      .catch((err) => {
        setPicLoad(false)
        console.log(err)
      })
      }
  }, [image])
  const updatePhoto = (file) => {
    setImage(file)
  }
  return (
    <div>
      <div className="profile">
        <div className="profile-img-name">
          <div>
            <img
              className="profile-img"
              src={state ? state.photo : 'loading...'}
              alt="photo"
            />
          </div>
          <div>
            <h4>
              {state ? state.name : 'loading...'}
            </h4>
            <h6>
                Email: {state ? state.email : 'loading...'}
            </h6>
            <div className="profile-suggestions">
              <h6>
                <strong>{data.length} suggestions for improvement</strong>
              </h6>
            </div>
          </div>
        </div>
        <div className="file-field input-field">
          <div className="btn grey">
            <span>{picLoad ? 'Loading...' : 'Upload Photo'}</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="profile-table">
        {loading && (
          <div className="loader-container">
            <div className="preloader-wrapper big active">
              <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div><div className="gap-patch">
                  <div className="circle"></div>
                </div><div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {show && (
          <a
            className="waves-effect waves-light btn"
            onClick={() => {
              history.push('/create')
            }}
          >
            <i className="material-icons left">add</i>Add suggestion
          </a>
        )}
        {show && data.length > 0 && <h5><i>Your Suggestions:</i></h5>}
        {data.map((item) => {
        return (
          <div className="col s12 m7" key={item._id}>
            <div className="card horizontal">
              <div className="card-image">
                <img className="suggest-img"
                  src={item.photo}
                  alt={item.title}
                />
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <h4 className="title-card">
                    <Link to={'/suggestions/' + item._id}>{item.title}</Link>
                  </h4>
                  <p>{item.body}</p>
                </div>
                <div className="card-action">
                  <div className="card-icons delete-icon">
                    <i
                      className="medium material-icons"
                      style={{ color: 'red' }}
                      onClick={() => {
                        deleteSuggHandler(item._id)
                      }}
                    >
                      delete_forever
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}

export default Profile;