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
    handleSearch(author){
        this.refs.search.input.refs.input.value=''
        browserHistory.push(`/list/${author}`)
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
                <Menu selectedKeys={[this.state.current]} theme="dark" onClick={this.handleNavigator} mode="horizontal">
                    <Menu.Item key="logo">
                        <Link to="/"><img src="https://o4j806krb.qnssl.com/public/images/cnodejs_light.svg"/></Link>
                    </Menu.Item>
                    <Menu.Item key="search">
                        <Search
                            ref='search'
                            placeholder="搜索指定用户的文章"
                            onSearch={value => this.handleSearch(value)}
                        />
                    </Menu.Item>
                    <Menu.Item key="list">
                        <Link to="/">首页</Link>
                    </Menu.Item>
                    {
                        user.name && (
                            <Menu.Item key="publish">
                                <Link to="/publish">发表文章</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user.name && <Menu.Item>用户:{user.name}</Menu.Item>
                    }
                    {
                        !user.name && (
                            <Menu.Item>
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