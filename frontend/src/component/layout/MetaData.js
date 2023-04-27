import React from 'react'
import Helmet from 'react-helmet';


const MetaData = ({title}) => {
    console.log('hellll....ooooo');
  return (
   <Helmet>
    <title>{title}</title>
   </Helmet>
  )
}

export default MetaData;