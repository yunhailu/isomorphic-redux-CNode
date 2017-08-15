import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch'
import {browserHistory} from 'react-router';
import {Form, Row, Col,Input,Button,Menu,Dropdown,Radio,Select} from 'antd'
import {fetchBundles, fetchPropertyList} from '../../actions/actions'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
require('./Publish.less')
class Publish extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.onbeforeChange = this.onbeforeChange.bind(this)
        this.onforceChange = this.onforceChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDatas = this.handleDatas.bind(this)
        this.state = {
            title: '',
            content: '',
            type:'分享',
            partUserType: '不灰度',
            appType: '3.3',
            businessType: '分享',
            utilityType: '发布',
            baseType: '0.44.3',
            description: '',
            simDescription: '',
            resourceUrl: '',
            isFailed: false,
            beforeValue: '否',
            forceValue: '否',
            optionValue: 'lala'
        }
    }
    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(fetchPropertyList());
    }
    handleSelect(e){
        this.setState({
            type: e.key
        })
    }
    handleTypesSelect(typevalue, e){
        console.log(typevalue);
        this.setState({
            [typevalue]: e.key
        })
    }
    handleClick(){
        const {dispatch} = this.props
        const partUserType = this.state.partUserType,
              appType = this.state.appType,
              baseType = this.state.baseType,
              businessType = this.state.businessType,
              utilityType = this.state.utilityType,
              description = this.state.description,
              simDescription = this.state.simDescription,
              resourceUrl = this.state.resourceUrl,
              beforeValue = this.state.beforeValue,
              forceValue = this.state.forceValue
        const content = JSON.stringify({
                partUserType,
                appType,
                baseType,
                businessType,
                utilityType,
                description,
                simDescription,
                resourceUrl,
                beforeValue,
                forceValue
            })
        fetch('/api/bundle',{
            method: 'POST',
            credentials: "include",
            headers:{
                "Content-Type": "application/json",
                "Content-Length": content.length.toString()
            },
            body: content
        }).then(res=>{
            if(res.ok){
                this.state.resourceUrl = '';
                this.state.description = '';
                this.state.simDescription = '';
                dispatch(fetchBundles())
                browserHistory.push('/')
            } else {
                this.setState({
                    isFailed: true
                })
            }
        })
    }
    gotoAddcategory(name){
        browserHistory.push(`/addProperty/${name}`)
    }
    onbeforeChange(e){
        this.setState({
            beforeValue: e.target.value,
        })
    }
    onforceChange(e){
        this.setState({
            forceValue: e.target.value,
        })
    }
    handleDatas(data, func, statuType){
        return <Select 
                    defaultValue={this.state[statuType]} 
                    style={{ width: 120 }} 
                    onChange={func.bind(this,statuType)} 
                    value={this.state[statuType]}
                >
                {
                    (!!data.length && data.length > 0) && data.map((item, key) => {
                        return (<Option value={item} key={key}>{item}</Option>)
                    })
                }
            </Select>
    }
    handleChange(typevalue,value){
        console.log('typevalue',typevalue);
        console.log('value',value)
        this.setState({
            [typevalue]: value
        })
    }
    render(){
        let {app,base,business,utility} = this.props.propertys.items;
        const partUserData = ["不灰度", "灰度10%", "灰度20%", "全量"];
        const partUsertypes = this.handleDatas(partUserData, this.handleChange, 'partUserType'),
              appTypes = this.handleDatas(app, this.handleChange, 'appType'),
              baseTypes = this.handleDatas(base, this.handleChange, 'baseType'),
              businessTypes = this.handleDatas(business, this.handleChange, 'businessType'),
              utilityTypes = this.handleDatas(utility, this.handleChange, 'utilityType');
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 8 },
        };
        const formItemLayoutLength = {
            labelCol: { span: 3 },
            wrapperCol: { span: 16 },
        };
        const formItemLayoutText = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
        };
        const formItemLayoutButton = {
            wrapperCol: { span: 16, offset: 8 },
        };
        return (
            <div>
                <h3>新建资源</h3>
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row>
                        <Col>
                            <FormItem {...formItemLayoutLength} label="资源URL">
                                <Input placeholder="placeholder" onChange={(e)=>this.setState({resourceUrl: e.target.value})} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="业务线类型:">
                                {businessTypes}
                                <Button type="primary"  onClick={() => this.gotoAddcategory('business')}>新增</Button>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="支持app最低版本:">
                                {appTypes}
                                <Button type="primary"  onClick={() => this.gotoAddcategory('app')}>新增</Button>
                            </FormItem>   
                        </Col>                   
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="用途类型:">
                                {utilityTypes}
                                <Button type="primary"  onClick={() => this.gotoAddcategory('utility')}>新增</Button>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="base版本:">
                                {baseTypes}
                                <Button type="primary"  onClick={() => this.gotoAddcategory('base')}>新增</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                             <FormItem {...formItemLayoutText} label="灰度情况:">
                                {partUsertypes}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem {...formItemLayoutText} label="简述">
                                <Input placeholder="placeholder" onChange={(e)=>this.setState({simDescription: e.target.value})}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayoutLength} label="描述">
                            <Input type="textarea" ref="content" autosize={{minRows:6}} onChange={(e)=>this.setState({description: e.target.value})}/>
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="是否预加载">
                                <RadioGroup onChange={this.onbeforeChange} value={this.state.beforeValue}>
                                    <Radio value={'是'}>是</Radio>
                                    <Radio value={'否'}>否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="是否强制更新">
                                <RadioGroup onChange={this.onforceChange} value={this.state.forceValue}>
                                    <Radio value={'是'}>是</Radio>
                                    <Radio value={'否'}>否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayoutButton}>
                                <Button type="primary" onClick={this.handleClick}>提交</Button>
                                <Button onClick={this.handleClick}>返回</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
  const { user,propertys } = state
  return {
    user,
    propertys
  }
}
export default connect(mapStateToProps)(Publish)