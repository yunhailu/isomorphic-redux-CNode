import React from 'react';
import { Router, Route, Link ,browserHistory} from 'react-router'
import {Button,Menu, Icon,Input, Layout} from 'antd'
const Search = Input.Search;
const { Header } = Layout;

export default class Headers extends React.Component {
    constructor(props){
        super(props)
        this.state = {
           current: 'list'
       }
        this.handleNavigator = this.handleNavigator.bind(this);
    }
    handleNavigator(e){
        this.setState({
            current: e.key
        })
    }
    render(){
        const {user,logOut} = this.props;
        return (
            <Header>
                <Menu style={{paddingTop: 8}} selectedKeys={[this.state.current]} theme="dark" onClick={this.handleNavigator} mode="horizontal">
                    <Menu.Item key="logo">
                        <Link to="/"><img  style={{width: 50, width: 50}} src="https://img.58cdn.com.cn/zhuanzhuan/Mzhuanzhuan/m/img/logo.png"/></Link>
                    </Menu.Item>
                    <Menu.Item key="title">
                        <Link to="/">RN资源管理系统</Link>
                    </Menu.Item>
                    <Menu.Item key="list" style={{marginLeft: 40}}>
                        <Link to="/">首页</Link>
                    </Menu.Item>
                    {
                        user.name && <Menu.Item style={{marginLeft: 40}}>用户:{user.name}</Menu.Item>
                    }
                    {
                        !user.name && (
                            <Menu.Item style={{marginLeft: 40}}>
                                <Link to="/logIn">登录</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        !user.name && (
                            <Menu.Item>
                                <Link to="/reg">注册</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user.name && (
                            <Menu.Item key="logout">
                                <span onClick={()=>logOut()}>退出</span>
                            </Menu.Item>
                        )
                    }
                </Menu>
            </Header>
        )
    }
}