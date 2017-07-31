/**
 * Created by yunhailu on 2017/7/31.
 */
import React from 'react';
import { Router, Route, Link ,browserHistory} from 'react-router'
import { Tabs, Row, Col, Button,Menu, Icon,Input, Layout} from 'antd'
import fetch from 'isomorphic-fetch'
const Search = Input.Search;
export default class User extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            customers: []
        }
    }
    getCustomers(id){
        const content = JSON.stringify({ id });
        return fetch('/api/getCustomer',{
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Content-Length": content.length.toString()
            },
            body: content
        }).then(res=>{
            console.log(res);
            if(res.ok){
                return res.json();
            } else {
                console.log('Get customers Failed !')
            }
        })
    }
    componentDidMount(){
        this.getCustomers('24008').then(resp => {
            console.log(resp);
            const { customers } = this.state;
            customers.push(resp);
            this.setState({customers});
        });
    }
    render(){
        const {user,logOut} = this.props;
        const TabPane = Tabs.TabPane;
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><Icon type="apple" />Tab 1</span>} key="1">
                        <Row>
                            <Col span={6}>ID</Col>
                            <Col span={6}>Name</Col>
                            <Col span={6}>E-mail</Col>
                            <Col span={6}>Company</Col>
                        </Row>
                        {
                            this.state.customers.map(customer => {
                                return (
                                    <div key="{customer.id}">
                                        <Row>
                                            <Col span={6}>{customer.id}</Col>
                                            <Col span={6}>{customer.name}</Col>
                                            <Col span={6}>{customer.email}</Col>
                                            <Col span={6}>{customer.company}</Col>
                                        </Row>
                                    </div>
                                );
                            })
                        }
                    </TabPane>
                    <TabPane tab={<span><Icon type="android" />Tab 2</span>} key="2">
                        Tab 2
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}