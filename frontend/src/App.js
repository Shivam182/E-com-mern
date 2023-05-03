import React from 'react';
import './App.css';
import Header from './component/layout/Header/Header.js'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';
import Footer from './component/layout/Footer/Footer.js';
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignup from './component/User/LoginSignup';
import store from './store';
import { loadUser } from './actions/userAction';
import UserOptions from './component/layout/Header/UserOptions.js'
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile.js'
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile.js'
import UpdatePassword from './component/User/UpdatePassword.js'


function App() {

  const {isAuthenticated,user} = useSelector((state)=>state.user);

React.useEffect(()=>{
  WebFont.load({
    google:{
      families:['Roboto','Droid Sans','Chilanka']
    }
  });

  store.dispatch(loadUser());
},[]);

  return <Router>
    <Header/>
    {isAuthenticated && <UserOptions user={user}/>}
    <Routes> 
          <Route exact path='/' Component={Home}/>
          <Route exact path='/product/:id' Component={ProductDetails}/>
          <Route exact path='/products/:keyword' Component={Products}/>
          <Route exact path='/products' Component={Products}/>
          <Route exact path='/search' Component={Search}/>
          <Route exact path='/login' Component={LoginSignup }  />
          <Route element={<ProtectedRoute/>}>
              <Route exact path='/account' Component={Profile} />
              <Route exact path='/me/update' Component={UpdateProfile}/>
              <Route exact path='/password/update' Component={UpdatePassword} />
          </Route>
          {/* <ProtectedRoute exact path='/account' Component={Profile}/>
          <ProtectedRoute exact path='/me/update' Component={UpdateProfile}/>
          <ProtectedRoute exact path='/password/update' Component={UpdatePassword}/> */}
    </Routes>
    <Footer/>
  </Router>
}

export default App;