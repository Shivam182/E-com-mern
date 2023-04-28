import React, { Fragment, useEffect } from 'react'
import './Products.css';
import { useDispatch, useSelector } from 'react-redux'
import {getProduct} from '../../actions/productAction';
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard';
import { useParams } from 'react-router-dom';



const Products = () => {

  const {keyword} = useParams();

  const dispatch =  useDispatch();
  const {products, loading, error} = useSelector(state=>state.products);

  useEffect(()=>{
    dispatch(getProduct(keyword))
  },[dispatch,keyword])

  return (<Fragment>
    {loading ? <Loader/>:<Fragment>
      <h2 className='productsHeading'>Products</h2>
      <div className='products'>
        {
          products && products.map((product)=>(
            <ProductCard key={product._id} product={product}/>
          ))
        }
      </div>
    </Fragment> }
     
    </Fragment>
  )
}

export default Products;