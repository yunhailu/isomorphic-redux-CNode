import React from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import { reg } from '../../util/fetch';
import {addUser} from '../../actions/actions'
import { Input, Button,Icon } from 'antd';
require('./Reg.less');

class Reg extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            name: '',
            isRNAdmin: ''
        }
    }
    handleClick(){
        console.log('this.props',this.props);
        const {dispatch} = this.props;
        const name = this.state.name,
            isRNAdmin = this.state.isRNAdmin;
        const params = JSON.stringify({
                name,
                isRNAdmin
            })
        reg({params: params})
        .then(res => res.data)
        .then(json=>{
            console.log('json',json);
            if(json.ok){
                dispatch(addUser(json.json))
                browserHistory.push('/')
            } else {
                console.log("注册失败")
            }
        })
    }
    render(){
        const { name,isRNAdmin } = this.state;
        const suffix = name ? <Icon type="close-circle" onClick={()=>{
            this.setState({ name: '' });
        }} /> : null;
        return (
            <div className="login">
                <h3>注册</h3>
                    <Input
                        placeholder="Enter your userName"
                        prefix={<Icon type="user" />}
                        suffix={suffix}
                        value={name}
                        onChange={(e)=>{
                            this.setState({name:e.target.value})
                        }}
                        className="login-input-first"
                    />
                    <Input
                        placeholder="Is RN admin?"
                        prefix={<Icon type="user" />}
                        value={isRNAdmin}
                        onChange={(e)=>{
                            this.setState({isRNAdmin:e.target.value})
                        }}
                        className="login-input-second"
                    />
                    <Button type="primary" onClick={this.handleClick}>注册</Button>
            </div>
        )
    }
}

export default connect()(Reg)