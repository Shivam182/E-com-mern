import React, { useState } from "react";
import "./App.css";
import Header from "./component/layout/Header/Header.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignup from "./component/User/LoginSignup";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from './component/Order/MyOrders.js'
import OrderDetails from './component/Order/OrderDetails.js'
import Dashboard from './component/Admin/Dashboard.js'
import ProductList from './component/Admin/ProductList.js'
import NewProduct from './component/Admin/NewProduct.js'
import UpdateProduct from './component/Admin/UpdateProduct.js'
import OrderList from './component/Admin/OrderList.js'
import ProcessOrder from './component/Admin/ProcessOrder.js'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    getStripeApiKey();
    store.dispatch(loadUser());
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/product/:id" Component={ProductDetails} />
        <Route exact path="/products/:keyword" Component={Products} />
        <Route exact path="/products" Component={Products} />
        <Route exact path="/search" Component={Search} />
        <Route exact path="/login" Component={LoginSignup} />
        <Route element={<ProtectedRoute />}>
          <Route exact path="/me/update" Component={UpdateProfile} />
          <Route exact path="/account" Component={Profile} />
          <Route exact path="/password/update" Component={UpdatePassword} />
          <Route exact path="/shipping" Component={Shipping} />
          <Route exact path="/order/confirm" Component={ConfirmOrder} />

          {stripeApiKey && (
            <Route
              path="/process/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Outlet />
                </Elements>
              }
            >
              <Route path="/process/payment" element={<Payment />} />
             
            </Route>
          )}

         

          <Route exact path="/success" Component={OrderSuccess} />
          <Route exact path="/orders" Component={MyOrders} />
          <Route exact path="/order/:id" Component={OrderDetails}/>
          <Route isAdmin={true} exact path="/admin/dashboard" Component={Dashboard}/>
          <Route isAdmin={true} exact path="/admin/products" Component={ProductList}/>
          <Route isAdmin={true} exact path="/admin/product" Component={NewProduct}/>
          <Route isAdmin={true} exact path="/admin/product/:id" Component={UpdateProduct}/>
          <Route isAdmin={true} exact path="/admin/orders" Component={OrderList}/>
          <Route isAdmin={true} exact path="/admin/order/:id" Component={ProcessOrder}/>

        </Route>
        <Route exact path="/password/forgot" Component={ForgotPassword} />
        <Route exact path="/password/reset/:token" Component={ResetPassword} />
        <Route exact path="/cart" Component={Cart} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
