import React, { useState, useEffect, useContext } from 'react'
import { Modal, Button } from 'react-materialize'
import { UserContext } from '../../App'

export default function SuggestDetails(props) {
  const suggestId = props.match.params.id;
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const {state, dispatch} = useContext(UserContext)

  useEffect(() => {
    setLoading(true)
    fetch(`/suggestions/${suggestId}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setSuggestion(result.suggestion)
        setLoading(false)
        setShow(true)
      })
  }, [])

  const supportHandle = (id) => {
    fetch('/support', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        suggestionId: id
      })
    })
      .then((res) => res.json())
      .then((result) => {
        setSuggestion(result)
      })
        .catch((err) => {
          console.log(err);
        })
  }

  const unSupportHandle = (id) => {
    fetch('/unsupport', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        suggestionId: id
      })
    })
      .then((res) => res.json())
      .then((suggestion) => {
        setSuggestion(suggestion)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const opinionHandle = (text, id) => {
    fetch('/postopinion', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        suggestionId: id,
        text
      })
    })
      .then((res) => res.json())
      .then((result) => {
        setSuggestion(result)
      })
      .catch((err) => {
        console.log(err);
      })
}

  return (
    <div className="home">
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
      {!suggestion && !loading && <h5><i>Suggestion not found</i></h5>}
      {!loading && suggestion &&
        (
          <div className="col s12 m7">
            <div className="card horizontal">
              <div className="card-image">
                <img className="suggest-img"
                  src={suggestion.photo}
                  alt={suggestion.title}
                />
                <div className="thumb">
                  {suggestion.postedBy._id !== state._id && (
                    <div className="card-icons">
                      {suggestion.supports.includes(state._id)
                      ? (
                      <i
                        className="medium material-icons"
                        style={{ color: 'lightcoral' }}
                        onClick={() => {
                          unSupportHandle(suggestion._id)
                        }}
                      >
                        thumb_down
                      </i>
                      ) : (
                        <i
                        className="medium material-icons"
                        style={{ color: 'lightgreen' }}
                        onClick={() => {
                          supportHandle(suggestion._id)
                        }}
                      >
                        thumb_up
                      </i>
                      )}
                    </div>
                    )}
                    {suggestion.postedBy._id === state._id && <h6><div className="check-suggestion"><i className="material-icons">check</i> This is your suggestion</div></h6>}
                    <h6>
                      <strong>({suggestion.supports.length} supports)</strong>
                    </h6>
                  </div>
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <h4 className="title-card">
                    {suggestion.title}
                  </h4>
                  <p>{suggestion.body}</p>
                  {suggestion.postedBy._id !== state._id && (
                    <Modal
                      header={suggestion.postedBy.name}
                      trigger={<Button waves='light' className="author-info-btn">Information about the author</Button>}>
                      <div>
                        <img
                          className="profile-img"
                          src={suggestion.postedBy.photo}
                          alt="photo"
                        />
                      </div>
                      <p>Email: {suggestion.postedBy.email}</p>
                    </Modal>
                  )}
                </div>
                <div className="card-action">
                  {suggestion.opinions.map((opinion) => {
                    return (
                      <h6 key={opinion._id}><span><img className="avatar-img" src={opinion.createdBy.photo} alt="photo" /><b>{opinion.createdBy.name}</b></span> <i>{opinion.text}</i></h6>
                    )
                  })}
                  {suggestion.postedBy._id !== state._id && (
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      opinionHandle(e.target[0].value, suggestion._id);
                      e.target[0].value = ''
                    }}>
                      <div className="input-field">
                        <input id={suggestion._id} type="text" className="validate" />
                        <label htmlFor={suggestion._id}>Place your opinion</label>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
