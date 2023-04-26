import React from 'react'
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';



const Product = ({product}) => {
  return (
    <div>
        <Link>
            <img src={product.images[0].url} alt={product.name}/>
            <p>{product.name}</p>
            <div>
                <ReactStars {...options}/> <span></span>
            </div>
        </Link>
    </div>
  )
}

export default Product;