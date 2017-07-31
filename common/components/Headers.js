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
                <Menu selectedKeys={[this.state.current]} theme="dark" onClick={this.handleNavigator} mode="horizontal" style={{padding:'0 30px'}}>
                    <Menu.Item key="logo"  style={{width:'12%'}}>
                        <Link to="/"><img src="https://o4j806krb.qnssl.com/public/images/cnodejs_light.svg"/></Link>
                    </Menu.Item>
                    <Menu.Item key="search">
                        <Search
                            ref='search'
                            placeholder="搜索指定用户的文章"
                            style={{ width: 200 }}
                            onSearch={value => this.handleSearch(value)}
                        />
                    </Menu.Item>
                    <Menu.Item key="list">
                        <Link to="/">首页</Link>
                    </Menu.Item>
                    <Menu.Item key="space" key="space">
                        <Link to="/space">个人中心</Link>
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
                        !user.name && <Menu.Item><Link to="/Space">登录/注册</Link></Menu.Item>
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