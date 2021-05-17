import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';

const SignIn = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory();
  const signUpEmail = JSON.parse(localStorage.getItem('email'))
  const [email, setEmail] = useState(signUpEmail ? signUpEmail : '');
  const [password, setPassword] = useState('');
  const handleSignin = () => {
    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({html: data.error, classes: '#c62828 red darken-3'});
        } else {
          localStorage.setItem('jwt', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          dispatch({ type: 'USER', payload: data.user })
          M.toast({html: data.message});
          history.push('/')
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className="sign-cards">
      <div className="card auth-card">
        <h5>SignIn Card</h5>
        <div className="input-field">
          <input
            id="email"
            type="email"
            className="validate"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email" class={signUpEmail && "active"}>Email</label>
        </div>
        <div className="input-field">
          <input
            id="password"
            type="password"
            className="validate"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button
          className="btn waves-effect waves-light"
          onClick={handleSignin}
        >
          SignIn
        </button>
        <h5>
          <Link to='/signup'>Dont have an account?..<br />Signup now</Link>
        </h5>
      </div>
    </div>
  )
}

export default SignIn;