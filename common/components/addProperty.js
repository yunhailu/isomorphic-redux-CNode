import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import {browserHistory} from 'react-router';
import {Tabs, Input, Button} from 'antd';
import { getCookie } from '../util/authService'
import {fetchPropertyList} from '../actions/actions';
const TabPane = Tabs.TabPane;

class AddProperty extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            propertyvalue: ''
        }
    }
    addPropertyType(propertytype){
        const {dispatch} = this.props
        const propertyvalue = this.state.propertyvalue;
        const content = JSON.stringify({
                propertytype,
                propertyvalue
            })
        fetch('/api/property',{
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Content-Length": content.length.toString()
            },
            body: content
        }).then(res=>{
            if(res.ok){
                this.state.propertyvalue = '';
                dispatch(fetchPropertyList());
                browserHistory.push('/Publish')
            } else {
                console.log(res.message);
                this.setState({
                    isFailed: true
                })
            }
        })
    }
    makeInput(typeline){
        let typeValue = '';
        if(typeline == 'business'){
            typeValue = '例如：商品详情页'
        }else if(typeline == 'app'){
            typeValue = '例如：3.3'
        }else if(typeline == 'utility'){
            typeValue = '例如：发布'
        }else if(typeline == 'base'){
            typeValue = '例如：0.44.3'
        }
        return (
            <div style={{ marginLeft: 16, marginTop: 20}}>
                <Input addonBefore={typeline} defaultValue={typeValue}  onChange={(e)=>this.setState({propertyvalue: e.target.value})}/>
                <Button type="primary" style={{marginLeft: 20}} onClick={() => this.addPropertyType(typeline)}>提交</Button>
                <Button>返回</Button>
            </div>
        )
    }
    render(){
        const {params} = this.props;
        let defaultKey = params.type || 'business'
        return (
            <div>
                <h3>新建属性</h3>
                <Tabs defaultActiveKey={defaultKey}
                      tabPosition={'left'}
                      style={{ height: 220 }}
                >
                    <TabPane tab="新增业务线" key="business">{this.makeInput('business')}</TabPane>
                    <TabPane tab="新增app最低版本" key="app">{this.makeInput('app')}</TabPane>
                    <TabPane tab="新增用途类型" key="utility">{this.makeInput('utility')}</TabPane>
                    <TabPane tab="新增base版本" key="base">{this.makeInput('base')}</TabPane>
                </Tabs>
            </div>
        )
    }
}

function mapStateToProps(state) {
  const { selectedAuthor,user } = state
  return {
    user,
    selectedAuthor
  }
}
export default connect(mapStateToProps)(AddProperty)