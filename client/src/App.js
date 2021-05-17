import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Switch, useHistory, Redirect } from 'react-router-dom'
import NavBar from './components/NavBar';
import './App.css';
import Home from './components/screens/Home';
import SignIn from './components/screens/SignIn';
import SignUp from './components/screens/SignUp';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducers/userReducer'
import SuggestDetails from './components/screens/SuggestDetails';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  const user = JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
    if (user) {
      dispatch({ type: 'USER', payload: user })
    } else {
      history.push('/signin')
    }
  }, [])
  if (user) {
  return (
    <Switch>
      <Route path='/' exact>
        <Home />
      </Route>
      <Route path='/suggestions/:id' component={SuggestDetails} />
      <Route path='/signin'>
        <SignIn />
      </Route>
      <Route path='/signup'>
        <SignUp />
      </Route>
      <Route path='/profile'>
        <Profile />
      </Route>
      <Route path='/create'>
        <CreatePost />
      </Route>
      <Redirect to='/' />
    </Switch>
  )} else {
  return (
    <Switch>
      <Route path='/signin'>
        <SignIn />
      </Route>
      <Route path='/signup'>
        <SignUp />
      </Route>
      <Redirect to='/signup' />
    </Switch>
  )}
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
