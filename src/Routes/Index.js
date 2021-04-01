import React, { Suspense} from "react";
import {
  HashRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { Header } from '../Components/Header/Index';
import {Staking,Admin} from './lazy'
import {AlertControl} from '../Components/Alert/alert';
import Loader  from '../Components/Loader/Loader';

export const App = () => {

  return <>
    <AlertControl>
    <HashRouter>
    <Suspense fallback={<Loader />}>
  
      <Switch>
        {/* <Route exact path={"/"} component={Exchange} /> */}
        <Route exact path={"/"} component={Staking} />
        <Route exact path={"/admin"} component={Admin} />
      </Switch>
      </Suspense>
    </HashRouter>
 
    </AlertControl>
  </>
}