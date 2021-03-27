import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from "./auth/Login"
import Register from "./auth/Register"
import ActivationEmail from './auth/ActivationEmail';
import NotFound from "./../utils/notFound/NotFound";
import ForgotPassword from './auth/ForgotPassword';

import { useSelector } from "react-redux";

const Body = () => {
  const auth = useSelector(state => state.auth)
  const { isLogged } = auth
  return (
    <section>
      <Switch>
        <Route path="/login" component={isLogged ? NotFound : Login} exact />
        <Route path="/register" component={isLogged ? NotFound : Register} exact />

        <Route path="/forgot_password" component={isLogged ? NotFound : ForgotPassword} exact />

        <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />
      </Switch>
    </section>
  )
}

export default Body
