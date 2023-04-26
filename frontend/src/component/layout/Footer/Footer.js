import React from 'react'
import playstore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
        <div class='leftFooter'>

            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playstore} alt='playstore' />
            <img src={appStore} alt='appstore'/>
        </div>

        <div class='midFooter'>
            <h1>ECOMMERCE</h1>
            <p>High Quality is our first priority</p>
            <p>Copyrights 2021 &copy; ShivamYadav</p>
        </div>

        <div class='rightFooter'>
            <h4>Follow Us</h4>
            <a href=''>Instagram</a>
            <a href=''>Youtube</a>
            <a href=''>Facebook</a>
        </div>
    </footer>
  )
}

export default Footer;