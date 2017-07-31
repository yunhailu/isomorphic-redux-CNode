import React from 'react';
import {connect} from 'react-redux';
import { Router, Route, Link,browserHistory } from 'react-router'
import {fetchUser,selectAuthor, logOut} from '../actions/actions'
import List from './List'
import MyHeader from './Headers'
import Side from './Side'
import fetch from 'isomorphic-fetch'
import {Button,Menu, Icon,Input, Layout} from 'antd'
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

require('../../assets/styles/app.scss')
class App extends React.Component {
    constructor(props){
       super(props);
       this.handleLogout = this.handleLogout.bind(this)
    }
    handleLogout(){
        const {dispatch} = this.props;
        localStorage.removeItem('token');
        dispatch(logOut());
        browserHistory.push('/');
    }
    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(fetchUser())
    }
    render() {
        const {user,posts} = this.props;
        return (
            <div id="hey">
                <Layout>
                    <MyHeader logOut={this.handleLogout} user={user}/>
                    {/*<img src={require('../../assets/images/test.jpg')} width='200'/>*/}
                    <Layout>
                        <Sider width="100" style={{backgroundColor:"#EDEDED",marginTop:'20px'}}>
                            <Menu
                                mode="vertical"
                                defaultSelectedKeys={['1']}
                                style={{ borderRight: 0 }}
                            >
                            <Menu.Item key="1">资源管理</Menu.Item>
                            <Menu.Item key="2">审核上线</Menu.Item>
                            </Menu>
                        </Sider>
                        <Content style={{backgroundColor: '#EDEDED', padding:"15px 5%"}}>
                            {this.props.children}
                        </Content>
                    </Layout>
                    <Footer style={{ textAlign: 'center' }}>
                        created by Xia Luo,haha
                    </Footer>
                </Layout>
            </div>
        )
  }
}

function mapStateToProps(state) {
  const { user,postsByAuthor,selectedAuthor } = state
  const {
    items: posts
  } = postsByAuthor[selectedAuthor] || {
    items: []
  }
  return {
    user,
    posts: posts||[]
  }
}
export default connect(mapStateToProps)(App)