import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch'
import {browserHistory} from 'react-router';
import {Tabs, Input, Button} from 'antd'
const TabPane = Tabs.TabPane;

class Publish extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    callback(){
        console.log('callback');
    }
    makeInput(typeline){
        let typeValue = '';
        if(typeline == '新增业务线'){
            typeValue = '例如：商品详情页'
        }else if(typeline == '新增app最低版本'){
            typeValue = '例如：3.3'
        }else if(typeline == '新增用途类型'){
            typeValue = '例如：发布'
        }else if(typeline == '新增base版本'){
            typeValue = '例如：0.44.3'
        }
        return (
            <div style={{ marginLeft: 16, marginTop: 20}}>
                <Input addonBefore={typeline} defaultValue={typeValue} />
                <Button type="primary" style={{marginLeft: 20}}>提交</Button>
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
                    <TabPane tab="新增业务线" key="business">{this.makeInput('新增业务线')}</TabPane>
                    <TabPane tab="新增app最低版本" key="app">{this.makeInput('新增app最低版本')}</TabPane>
                    <TabPane tab="新增用途类型" key="utility">{this.makeInput('新增用途类型')}</TabPane>
                    <TabPane tab="新增base版本" key="base">{this.makeInput('新增base版本')}</TabPane>
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
export default connect(mapStateToProps)(Publish)