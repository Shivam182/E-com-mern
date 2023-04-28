import React, { Fragment, useEffect } from 'react'
import {CgMouse} from 'react-icons/all'
import './Home.css';
import ProductCard from './ProductCard';
import MetaData from '../layout/MetaData'; 
import {getProduct} from '../../actions/productAction'
import {useSelector,useDispatch} from 'react-redux';
import Loader from '../layout/Loader/Loader';
// import {useAlert} from 'react-alert';
// import { errorMonitor } from 'nodemailer/lib/xoauth2';



const Home = () => {

  // const alert =  useAlert();

  const dispatch = useDispatch();
  const {loading, error, products, productsCount} = useSelector(state=>state.products);

  useEffect(()=>{
    dispatch(getProduct());

    if (error) {
      // getting error if returning fxn from use effect ....
       alert.error(error);
      // console.log("Some error occured: "+ error)
    }

  },[dispatch,error]);

  return (
    
    <Fragment>
      {
        loading ? <Loader/>:<Fragment>
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
  
          {products && products.map(product=>(
            <ProductCard product={product}/>
          ))}
  
      </div>
  
      </Fragment>
      }
    </Fragment>

  )
}

export default Home;