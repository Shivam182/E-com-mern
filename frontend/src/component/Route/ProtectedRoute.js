import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { redirect, Route, Navigate, Outlet } from "react-router-dom";


// const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {


//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);

//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//           {...rest}
//           render={(props) => {
//             if (isAuthenticated === false) {
//               return redirect('/login');
//             }

//             if (isAdmin === true && user.role !== "admin") {
//               return redirect('/login');
//             }

//             return <Component {...props} />;
//           }}
//         />
//       )}
//     </Fragment>
//   );
// };


const ProtectedRoute = () => {

  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading === false) {
    
  if (user !== null) {

    // const isAuthenticated = Parse.User.current().getSessionToken();
    return isAuthenticated ? <Outlet /> : null; // or loading indicator, etc...

  }

  return redirect('/login');
  }

 
};

export default ProtectedRoute;