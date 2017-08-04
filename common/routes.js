import React from 'react';
import {Route,IndexRoute} from 'react-router';
import App from '../common/components/App';
import List from '../common/components/List';
import Detail from '../common/components/Detail/Detail';
import Publish from '../common/components/Publish/Publish';
import LogIn from '../common/components/LogIn/LogIn';
import Reg from '../common/components/Reg';
import addProperty from '../common/components/addProperty';
import {redirectToBack,redirectToLogin} from './util/authService'
import testLogin from '../common/components/testLogin';

const routes = (
    <Route>
        <Route path="/" component={App}>
                <IndexRoute component={List}/>
                <Route path="/detail/:id" component={Detail}/>
                <Route path="/publish" component={Publish}/>
                <Route path="/addProperty/:type" component={addProperty}/>
        </Route>
        <Route path="/logIn" component={LogIn} onEnter={redirectToBack}/>
        <Route path="/reg" component={Reg}/>
    </Route>
    );

export default routes;