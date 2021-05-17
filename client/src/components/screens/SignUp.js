import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignup = () => {
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({html: data.error, classes: '#c62828 red darken-3'});
        } else {
          M.toast({html: data.message});
          localStorage.setItem('email', JSON.stringify(data.email))
          history.push('/signin')
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className="sign-cards">
      <div className="card auth-card">
        <h5>SignUp Card</h5>
        <div className="input-field">
          <input
            id="name"
            type="text"
            className="validate"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="name">Name</label>
        </div>
        <div className="input-field">
          <input
            id="email"
            type="email"
            className="validate"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email</label>
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
          onClick={handleSignup}
        >
          SignUp
        </button>
        <h5>
          <Link to='/signin'>Already have an account?..<br />Signin now</Link>
        </h5>
      </div>
    </div>
  )
}

export default SignUp;