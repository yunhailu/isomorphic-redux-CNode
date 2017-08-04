import React from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Button, Input, Form, Row, Col, Select} from 'antd'
import {fetchUser} from '../../actions/actions'
import { getCookie } from '../../util/authService'

const FormItem = Form.Item;
const Option = Select.Option;

class Detail extends React.Component {
    constructor(props){
        super(props)
        this.handleDatas = this.handleDatas.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            bundleItem: "",
            partUserType: "",
            businessType: "",
            utilityType: ""
        }
    }
    componentDidMount(){
        const {bundlelists,params} = this.props;
        console.log('cratedparams',params);
        let bundle = bundlelists.filter((bundle)=>bundle['_id'] === params.id)[0];
        this.setState({
          bundleItem: bundle
        })
    }
    componentWillReceiveProps(nextProps){
      const {params} = nextProps;
      console.log('receiveparams',params);
      let bundle = this.props.bundlelists.filter((bundle)=>bundle['_id'] === params.id)[0];
      this.setState({
        bundleItem: bundle
      })
    }
    handleDatas(data, func, statuType){
        console.log('this.state.bundleItem[statuType]',this.state.bundleItem[statuType]);
        const valueDefault = this.state[statuType] || this.state.bundleItem[statuType];
        return <Select 
                    defaultValue={this.state.bundleItem[statuType]} 
                    style={{ width: 120 }} 
                    onChange={func.bind(this,statuType)} 
                    value={valueDefault}
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
    gotoAddcategory(name){
      browserHistory.push(`/addProperty/${name}`)
    }
    handleClick(){
      console.log('更新资源文件')
    }
    goback(){
      browserHistory.goBack();
    }
    render(){
        let {business,utility} = this.props.propertys.items;
        const partUserData = ["不灰度", "灰度10%", "灰度20%", "全量"];
        const partUsertypes = this.handleDatas(partUserData, this.handleChange, 'partUserType'),
              businessTypes = this.handleDatas(business, this.handleChange, 'businessType'),
              utilityTypes = this.handleDatas(utility, this.handleChange, 'utilityType');
        const resourceUrl = this.state.bundleItem.resourceUrl,
              createdTime = this.state.bundleItem.createdTime,
              bundleVersion = this.state.bundleItem.bundleVersion,
              onlinebundleVersion = this.state.bundleItem.onlinebundleVersion || 'wait...',
              resourceId = this.state.bundleItem.resourceId,
              appType = this.state.bundleItem.appType,
              baseType = this.state.bundleItem.baseType,
              beforeValue = this.state.bundleItem.beforeValue,
              forceValue = this.state.bundleItem.forceValue,
              description = this.state.bundleItem.description
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
                <h3>资源详情</h3>
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <Row>
                        <Col>
                            <FormItem {...formItemLayoutLength} label="资源URL">
                                <Input value={resourceUrl} />
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem {...formItemLayoutLength} label="创建时间">
                                <Input value={createdTime} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="bundle版本号">
                                <Input value={bundleVersion} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="线上bundle版本号">
                                <Input value={onlinebundleVersion} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                             <FormItem {...formItemLayoutText} label="灰度情况:">
                                {partUsertypes}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="资源ID">
                                <Input value={resourceId} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="支持app最低版本">
                                <Input value={appType} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="base版本">
                                <Input value={baseType} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="是否预加载">
                                <Input value={beforeValue} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="是否强制更新">
                                <Input value={forceValue} />
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
                            <FormItem {...formItemLayoutText} label="用途类型:">
                                {utilityTypes}
                                <Button type="primary"  onClick={() => this.gotoAddcategory('utility')}>新增</Button>
                            </FormItem>   
                        </Col>                   
                    </Row>
                    <Row>
                        <FormItem {...formItemLayoutLength} label="描述">
                            <Input type="textarea" ref="content" autosize={{minRows:6}} value={description} />
                        </FormItem>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayoutButton}>
                                <Button type="primary" onClick={this.handleClick}>提交</Button>
                                <Button onClick={this.goback}>返回</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
  const { bundles, propertys } = state
  const {
    bundlelists
  } = bundles || {
    bundlelists: []
  }
  return {
    bundlelists,
    propertys
  }
}
export default connect(mapStateToProps)(Detail)