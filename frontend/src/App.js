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

function App() {

React.useEffect(()=>{
  WebFont.load({
    google:{
      families:['Roboto','Droid Sans','Chilanka']
    }
  })
},[]);

  return <Router>
    <Header/>
    <Routes>
          <Route exact path='/' Component={Home}/>
          <Route exact path='/product/:id' Component={ProductDetails}/>
          <Route exact path='/products/:keyword' Component={Products}/>
          <Route exact path='/products' Component={Products}/>
          <Route exact path='/search' Component={Search}/>
    </Routes>
    <Footer/>
  </Router>
}

export default App;