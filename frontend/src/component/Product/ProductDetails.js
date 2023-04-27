import React, { Fragment, useEffect } from 'react'
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../../actions/productActions';
import {useParams} from 'react-router-dom';
import Loader from '../layout/Loader/Loader'


const ProductDetails = () => {
    
   
    const {id} = useParams();


    const dispatch = useDispatch();

    const {product, loading, error} = useSelector(state=>state.productDetails)
    useEffect(() => {
        console.log('i was called ....');
        dispatch(getProductDetails(id));
        
      }, [id,dispatch]);


   
  return (
  <Fragment>
    {
        loading ? <Loader/>: <Fragment>
        <div className='ProductDetails'>
            <div>
                <Carousel>
                    {
                    
                        product && product.images.map((item,i)=>(
                            <img className='CarouselImage'
                            key={item.url}
                            src={item.url}
                            alt={`${i} Slide`}/>
                            // <p>iuweiufherf</p>
                            
                        ))
                    }
                </Carousel>
            </div>
        </div>
       </Fragment>
    }
  </Fragment>
  )
}

export default ProductDetails;