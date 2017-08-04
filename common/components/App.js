import React from 'react';
import {connect} from 'react-redux';
import { Router, Route, Link,browserHistory } from 'react-router'
import {fetchUser, logOut} from '../actions/actions'
import List from './List'
import MyHeader from './Headers'
import fetch from 'isomorphic-fetch'
import {Button,Menu, Icon,Input, Layout} from 'antd'
import { signOut } from '../util/authService'

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

require('../../assets/styles/app.less')
class App extends React.Component {
    constructor(props){
       super(props);
       this.handleLogout = this.handleLogout.bind(this)
    }
    handleLogout(){
        const {dispatch} = this.props;
        signOut();
        console.log('signOut',signOut);
        dispatch(logOut());
        browserHistory.push('/');
    }
    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(fetchUser())
    }
    render() {
        const {user} = this.props;
        return (
            <div id="hey">
                <Layout>
                    <MyHeader logOut={this.handleLogout} user={user}/>
                    {/*<img src={require('../../assets/images/test.jpg')} width='200'/>*/}
                    <Layout>
                        <Sider width="100">
                            <Menu
                                mode="vertical"
                                defaultSelectedKeys={['1']}
                            >
                            <Menu.Item key="1">资源管理</Menu.Item>
                            <Menu.Item key="2">审核上线</Menu.Item>
                            </Menu>
                        </Sider>
                        <Content>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
  }
}

function mapStateToProps(state) {
  const { user} = state
  return {
    user
  }
}
export default connect(mapStateToProps)(App)