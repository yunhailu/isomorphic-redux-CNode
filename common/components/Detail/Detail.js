import React from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Button, Input, Form, Row, Col, Select} from 'antd'
import {fetchBundles} from '../../actions/actions'
import { updateBundle } from '../../util/fetch';

const FormItem = Form.Item;
const Option = Select.Option;

class Detail extends React.Component {
    constructor(props){
        super(props)
        this.handleDatas = this.handleDatas.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.getItemFromList = this.getItemFromList.bind(this)
        const initialStatus = 
        this.state = {
            bundleItem: "",
            partUserType: this.getItemFromList(props.bundlelists, props.params.id).partUserType,
            businessType: this.getItemFromList(props.bundlelists, props.params.id).businessType,
            utilityType: this.getItemFromList(props.bundlelists, props.params.id).utilityType,
            isFailed: false
        }
    }
    componentDidMount(){
        console.log('componentDidMount');
        const {bundlelists,params} = this.props;
        console.log('cratedparams',params);
        let bundle = this.getItemFromList(bundlelists, params.id);
        console.log('bundlessss', bundle);
        this.setState({
          bundleItem: bundle
        })
    }
    getItemFromList(list, id){
        return list.filter((bundle)=>bundle['_id'] === id)[0];
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
        console.log('statusType', statuType);
        console.log('this.state.bundleItem', this.state.bundleItem);
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
      const { params, dispatch } = this.props;
      const id = params.id,
            partUserType = this.state.partUserType,
            businessType = this.state.businessType,
            utilityType = this.state.utilityType;
      const content = JSON.stringify({
                id,
                partUserType,
                businessType,
                utilityType
            });
      console.log('content', content);
      updateBundle({params: content}).then(data=>{
            console.log('data', data);
            if(data.ok){
                console.log('detail',data.json)
                dispatch(fetchBundles())
                browserHistory.push('/')
            } else {
                this.setState({
                    isFailed: true
                })
            }
        })
    }
    goback(){
      browserHistory.goBack();
    }
    render(){
        console.log('this.props.propertys',this.props.propertys);
        console.log('this.props.bundlelists',this.props.bundlelists);
        let {business,utility} = this.props.propertys.items;
        const partUserData = ["不灰度", "灰度10%", "灰度20%", "全量"];
        const partUsertypes = this.handleDatas(partUserData, this.handleChange, 'partUserType'),
              businessTypes = this.handleDatas(business, this.handleChange, 'businessType'),
              utilityTypes = this.handleDatas(utility, this.handleChange, 'utilityType');
        const resourceUrl = this.state.bundleItem.resourceUrl,
              createdTime = this.state.bundleItem.createdTime,
              androidbundleName = this.state.bundleItem.bundleName && this.state.bundleItem.bundleName.android && this.state.bundleItem.bundleName.android.projectName,
              iosbundleName = this.state.bundleItem.bundleName && this.state.bundleItem.bundleName.ios && this.state.bundleItem.bundleName.ios.projectName,
              onlinebundleName = this.state.bundleItem.onlinebundleName || 'wait...',
              resourceId = this.state.bundleItem.resourceId,
              appType = this.state.bundleItem.appType,
              baseType = this.state.bundleItem.baseType,
              beforeValue = this.state.bundleItem.beforeValue,
              forceValue = this.state.bundleItem.forceValue,
              isUseOldDependency = this.state.bundleItem.isUseOldDependency,
              description = this.state.bundleItem.description;
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
                                <Input value={resourceUrl} disabled/>
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem {...formItemLayoutLength} label="创建时间">
                                <Input value={createdTime} disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="android bundle版本号">
                                <Input value={androidbundleName} disabled />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="ios bundle版本号">
                                <Input value={iosbundleName} disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="是否利用上次依赖">
                                <Input value={isUseOldDependency} disabled />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="线上bundle版本号">
                                <Input value={onlinebundleName} disabled />
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
                                <Input value={resourceId}  disabled/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="支持app最低版本">
                                <Input value={appType} disabled />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutText} label="base版本">
                                <Input value={baseType} disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="是否预加载">
                                <Input value={beforeValue} disabled />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayoutText} label="是否强制更新">
                                <Input value={forceValue} disabled />
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
                            <Input type="textarea" ref="content" autosize={{minRows:6}} value={description} disabled />
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