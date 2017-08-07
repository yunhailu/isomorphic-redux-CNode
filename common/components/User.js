/**
 * Created by yunhailu on 2017/7/31.
 */
import React from 'react';
import { Router, Route, Link ,browserHistory} from 'react-router'
import { Tabs, Table, Row, Col, Button,Menu, Icon,Input, Layout} from 'antd'
import { getCustomer } from '../fetch';
const Search = Input.Search;
export default class User extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            customers: []
        }
    }
    getCustomers(id){
        return getCustomer({id});
    }
    componentDidMount(){
        this.getCustomers('24008').then(resp => {
            console.log(resp);
            const { customers } = this.state;
            if(resp.code == 0){
                customers.push(resp.data);
                this.setState({customers});
            }
        });
    }
    render(){
        const {user,logOut} = this.props;
        const TabPane = Tabs.TabPane;
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: text => <a href="#">{text}</a>,
        }, {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        }];
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><Icon type="apple" />Tab 1</span>} key="1">
                        <Table columns={columns} dataSource={this.state.customers} />
                    </TabPane>
                    <TabPane tab={<span><Icon type="android" />Tab 2</span>} key="2">
                        Tab 2
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}