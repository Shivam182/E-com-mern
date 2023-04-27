import React, { Fragment, useEffect } from 'react'
import {CgMouse} from 'react-icons/all'
import './Home.css';
import Product from './Product.js';
import MetaData from '../layout/MetaData'; 
import {getProduct} from '../../actions/productActions'
import {useSelector,useDispatch} from 'react-redux';




// Temporary Product : afterwards we will fetch it from redux.
const product = {
  name:"Blue Tshirt",
  images: [{ url: 'https://i.ibb.co/DRST11n/1.webp'}],
  price:'$3000',
  _id:'shivam',
};

const Home = () => {

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getProduct());
  },[dispatch]);

  return (
    
    <Fragment>
      <MetaData title='ECOMMERCE'/>
    <div className='banner'>
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href='#container' >
            <button>
              Scroll <CgMouse />
            </button>
        </a>
    </div>

    <h2 className='homeHeading'>Featured Products</h2>

    <div className='container' id='container'>

        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/>
        <Product product={product}/> 

    </div>

    </Fragment>

  )
}

export default Home;