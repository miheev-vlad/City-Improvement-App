import React, { useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css'
import { UserContext } from '../App';

const NavBar = () => {
  const infoModal = useRef(null)
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
      M.Modal.init(infoModal.current)
  }, [])
  const renderList = () => {
    if (state) {
      return [
        <li key="search"><i data-target="modal2" className="material-icons modal-trigger" style={{color:"black", fontSize:"30px"}}>help_outline</i></li>,
        <li key="profile"><Link to='/profile'>{state.name}</Link></li>,
        <li key="logout">
          <button
            className="btn #9e9e9e grey"
            onClick={() => {
              localStorage.clear()
              dispatch({ type: 'CLEAR' })
              history.push('/signin')
            }}
          >
            LogOut
          </button>
        </li>
      ]
    } else {
      return [
        <li key="search"><i data-target="modal2" className="material-icons modal-trigger" style={{color:"black", fontSize:"30px"}}>help_outline</i></li>,
        <li key="signin">
            <Link to='/signin'>SignIn</Link>
        </li>
      ]
    }
  }
  return (
    <nav className="nav-bar">
      <div className="nav-wrapper white">
        <Link to={state ? '/' : '/signin'} className="brand-logo left">
          <img className="brand-img" src="/images/city.jpg" alt="photo" />Suggestions
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div id="modal2" className="modal" ref={infoModal} style={{ color:"black" }}>
        <div className="modal-content">
          <h5 className="info-h5"><b>{state ? `We are glad to welcome you, ${state.name}!` : 'We are glad to welcome you!'}</b></h5>
          <h5>What is City Improvement App?..</h5>
          <h6 className="info-h6">The application was created to find fresh suggestions that can be applied and useful to improve the environment of our cities. The winners will be determined by an expert jury.</h6>
          <Link to={state ? "/" : "/signin"} onClick={() => {
              M.Modal.getInstance(infoModal.current).close()
              }}
          >
            <i className="info-i">View all suggestions</i>
          </Link>
          <Link to={state ? "/create" : "/signin"} onClick={() => {
              M.Modal.getInstance(infoModal.current).close()
              }}
          >
            <i className="info-i">Create your suggestions</i>
          </Link>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
          >
            close
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;