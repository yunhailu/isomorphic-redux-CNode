import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch'
import {browserHistory} from 'react-router';
import {Form, Row, Col,Input,Button,Menu,Dropdown,Radio} from 'antd'
import {invalidatePosts,fetchUser,fetchPostsIfNeeded} from '../actions/actions'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class Publish extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.onbeforeChange = this.onbeforeChange.bind(this)
        this.onforceChange = this.onforceChange.bind(this)
        this.state = {
            title: '',
            content: '',
            type:'分享',
            partUserType: '不灰度',
            isFailed: false,
            beforeValue: 2,
            forceValue: 2,
        }
    }
    handleSelect(e){
        this.setState({
            type: e.key
        })
    }
    handlepartUserSelect(typevalue, e){
        console.log(typevalue);
        this.setState({
            [typevalue]: e.key
        })
    }
    handleClick(){
        const {dispatch,selectedAuthor} = this.props
        const title = this.state.title,
            postContent = this.state.content,
            type = this.state.type,
            access_token = localStorage.getItem('token')
        const content = JSON.stringify({
                title,
                type,
                content:postContent,
                access_token
            })
        fetch('/api/post',{
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Content-Length": content.length.toString()
            },
            body: content
        }).then(res=>{
            if(res.ok){
                this.state.title = '';
                this.state.content = '';
                dispatch(invalidatePosts(this.props.selectedAuthor));
                dispatch(fetchUser())
                dispatch(fetchPostsIfNeeded(selectedAuthor))
                browserHistory.push('/')
            } else {
                this.setState({
                    isFailed: true
                })
            }
        })
    }
    gotoAddcategory(name){
        console.log(name);
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
    handleData(data, func, statuType){
        return <Menu onClick={func.bind(this,statuType)} selectedKeys={[`this.state.${statuType}`]}>
                {
                    (data.length > 0) && data.map((item, key) => {
                        return (<Menu.Item key={item}>{item}</Menu.Item>)
                    })
                }
            </Menu>
    }
    render(){
        console.log('propertys',this.props.propertys);
        const types = (
            <Menu onClick={this.handleSelect} selectedKeys={[this.state.type]}>
                <Menu.Item key="分享">分享</Menu.Item>
                <Menu.Item key="笑话">笑话</Menu.Item>
                <Menu.Item key="提问">提问</Menu.Item>
            </Menu>
        )
        const partUserData = ["不灰度", "灰度10%", "灰度20%", "全量"];
        const partUsertypes = this.handleData(partUserData, this.handlepartUserSelect, 'partUserType');
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 8 },
        };
        const formItemLayoutText = {
            labelCol: { span: 3 },
            wrapperCol: { span: 16 },
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
                            <FormItem {...formItemLayoutText} label="资源URL">
                                <Input placeholder="placeholder" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="所属业务线">
                                <Dropdown.Button overlay={types}>
                                    {this.state.type}
                                </Dropdown.Button><br/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <Button type="primary"  onClick={() => this.gotoAddcategory('business')}>新增</Button>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="支持app最低版本">
                                <Dropdown.Button overlay={types}>
                                    {this.state.type}
                                </Dropdown.Button><br/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <Button type="primary"  onClick={() => this.gotoAddcategory('app')}>新增</Button>
                        </Col>                       
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="用途类型">
                                <Dropdown.Button overlay={types}>
                                    {this.state.type}
                                </Dropdown.Button><br/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <Button type="primary"  onClick={() => this.gotoAddcategory('utility')}>新增</Button>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="base版本">
                                <Dropdown.Button overlay={types}>
                                    {this.state.type}
                                </Dropdown.Button><br/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <Button type="primary"  onClick={() => this.gotoAddcategory('base')}>新增</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="灰度情况">
                                <Dropdown.Button overlay={partUsertypes}>
                                    {this.state.partUserType}
                                </Dropdown.Button><br/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="简述">
                                <Input placeholder="placeholder" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayoutText} label="描述">
                            <Input type="textarea" ref="content" autosize={{minRows:6}} />
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="是否预加载">
                                <RadioGroup onChange={this.onbeforeChange} value={this.state.beforeValue}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="是否强制更新">
                                <RadioGroup onChange={this.onforceChange} value={this.state.forceValue}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {/* <Col span={2}>
                            <Button type="primary" onClick={this.handleClick}>提交</Button>
                        </Col>
                        <Col span={2}>
                            <Button onClick={this.handleClick}>返回</Button>
                        </Col>
                        {
                            this.state.isFailed && <span>发表失败</span>
                        } */}
                        <Col>
                            <FormItem {...formItemLayoutButton}>
                                <Button type="primary" onClick={this.handleClick}>提交</Button>
                                <Button onClick={this.handleClick}>返回</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                {/* <Input ref="title" onChange={(e)=>this.setState({title: e.target.value})}>
                </Input>
                文章版块:<Dropdown.Button overlay={types}>
                    {this.state.type}
                </Dropdown.Button><br/>
                内容:<Input type="textarea" ref="content" autosize={{minRows:10}} onChange={(e)=>this.setState({content: e.target.value})}>
                </Input> */}
            </div>
        )
    }
}

function mapStateToProps(state) {
  const { selectedAuthor,user,propertys } = state
  return {
    user,
    selectedAuthor,
    propertys
  }
}
export default connect(mapStateToProps)(Publish)