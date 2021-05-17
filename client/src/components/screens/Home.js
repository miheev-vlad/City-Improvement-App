import React, { useContext, useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'react-materialize'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'

const Home = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [suggestDetails, setSuggestDetails] = useState(null)
  const [loadSerch, setLoadSerch] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const { state, dispatch } = useContext(UserContext)
  const options = {
    onCloseEnd: () => {
      setSearch('')
      setSuggestDetails(null)
    }
  }
  useEffect(() => {
      M.Modal.init(searchModal.current, options)
  }, [])
  useEffect(() => {
    setLoading(true)
    fetch('/getall', {
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
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
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
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
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
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      })
      .catch((err) => {
        console.log(err);
      })
}
  const fetchSuggestion = (query) => {
    setLoadSerch(true)
    setSearch(query)
    fetch('/search-suggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    })
      .then((res) => res.json())
      .then((results) => {
        setSuggestDetails(results.suggestion)
        setLoadSerch(false)
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
      {!loading && (<div>
        <i data-target="modal1" className="medium material-icons modal-trigger" style={{color:"grey"}}>find_in_page</i>
      </div>)}
      <div id="modal1" className="modal" ref={searchModal} style={{ color:"black" }}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="search suggestion"
            value={search}
            onChange={(e) => fetchSuggestion(e.target.value)}
          />
            {suggestDetails && !loadSerch && suggestDetails.length > 0 && search && (suggestDetails.map((item) => {
              return (
                <div key={item._id}>
                <Link to={`/suggestions/${item._id}`} onClick={() => {
                    setSearch('')
                    setSuggestDetails(null)
                    M.Modal.getInstance(searchModal.current).close()
                    }}
                >
                  {item.title}
                </Link>
                <hr />
                </div>) 
            }))}
            {suggestDetails && !loadSerch && suggestDetails.length === 0 && search && <h6>Nothing was found...</h6>}
            {!loadSerch && !search && <h6>Enter a value to search</h6>}
            {loadSerch && (
              <div className="progress">
                <div className="indeterminate"></div>
              </div>
            )}
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => {
              setSearch('')
              setSuggestDetails(null)
            }}>close</button>
        </div>
      </div>
      {show && data.length === 0 && <h5><i>No suggestions yet...</i></h5>}
      {data.map((item) => {
        return (
          <div className="col s12 m7" key={item._id}>
            <div className="card horizontal">
              <div className="card-image">
                <img className="suggest-img"
                  src={item.photo}
                  alt={item.title}
                />
                <div className="thumb">
                  {item.postedBy._id !== state._id && (
                    <div className="card-icons">
                      {item.supports.includes(state._id)
                      ? (
                      <i
                        className="medium material-icons"
                        style={{ color: 'lightcoral' }}
                        onClick={() => {
                          unSupportHandle(item._id)
                        }}
                      >
                        thumb_down
                      </i>
                      ) : (
                        <i
                        className="medium material-icons"
                        style={{ color: 'lightgreen' }}
                        onClick={() => {
                          supportHandle(item._id)
                        }}
                      >
                        thumb_up
                      </i>
                      )}
                    </div>
                    )}
                    {item.postedBy._id === state._id && <h6><div className="check-suggestion"><i className="material-icons">check</i> This is your suggestion</div></h6>}
                    <h6>
                      <strong>({item.supports.length} supports)</strong>
                    </h6>
                  </div>
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <h4 className="title-card">
                    <Link to={'/suggestions/' + item._id}>{item.title}</Link>
                  </h4>
                  <p>{item.body}</p>
                  {item.postedBy._id !== state._id && (
                    <Modal
                      header={item.postedBy.name}
                      trigger={<Button waves='light' className="author-info-btn">Information about the author</Button>}>
                      <div>
                        <img
                          className="profile-img"
                          src={item.postedBy.photo}
                          alt="photo"
                        />
                      </div>
                      <p>Email: {item.postedBy.email}</p>
                    </Modal>
                  )}
                </div>
                <div className="card-action">
                  {item.opinions.map((opinion) => {
                    return (
                      <h6 key={opinion._id}><span><img className="avatar-img" src={opinion.createdBy.photo} alt="photo" /><b>{opinion.createdBy.name}</b></span> <i>{opinion.text}</i></h6>
                    )
                  })}
                  {item.postedBy._id !== state._id && (
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      opinionHandle(e.target[0].value, item._id);
                      e.target[0].value = ''
                    }}>
                      <div className="input-field">
                        <input id={item._id} type="text" className="validate" />
                        <label htmlFor={item._id}>Place your opinion</label>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Home;