import React from 'react';
import {connect} from 'react-redux';
import { Router, Route, Link,browserHistory } from 'react-router'
import {logOut, fetchUser} from '../actions/actions'
import List from './List'
import MyHeader from './Headers'
import fetch from 'isomorphic-fetch'
import {Button,Menu, Icon,Input, Layout} from 'antd'

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

require('../../assets/styles/app.less')
class App extends React.Component {
    constructor(props){
       super(props);
       this.handleLogout = this.handleLogout.bind(this)
    }
    componentDidMount(){
        const {dispatch} = this.props;
        // dispatch(fetchUser());
    }
    handleLogout(){
        const {dispatch} = this.props;
        fetch('/api/logout',{
                method: 'GET',
                credentials: "include"
            })
        // .then(res => res.json())
        // .then(json=>{
        //     console.log('json',json);
        //     if(json.ok){
        //         dispatch(logOut());
        //         // browserHistory.push('/')
        //     } else {
        //         console.log("退出失败")
        //     }
        // })
    }
    render() {
        const {user} = this.props;
        console.log('user', user);
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