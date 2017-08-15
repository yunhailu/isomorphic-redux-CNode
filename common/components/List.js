import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router'
import Picker from './Picker'
import TableBundles from './TableBundles'
import { Form, Row, Col, Spin ,Button,Menu, Icon,Input, Layout} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;

class List extends React.Component {
    constructor(props){
        super(props);
    }
    handleSearch(){
        console.log('submit');
    }
    render(){
        const {bundlelists, isRequesting, lastUpdated} = this.props;
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };
        return (
            <div>
                <Layout>
                    <Content>
                        <div>
                            <Form
                                className="ant-advanced-search-form"
                                onSubmit={this.handleSearch}
                                style={{textAlign: 'center'}}
                            >
                                <Row style={{paddingTop: 10}}>
                                    <Col span={2}>
                                        <Button style={{marginLeft: 10}}><Link to="/publish">添加新资源</Link></Button>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem {...formItemLayout} label="资源ID">
                                            <Input placeholder="placeholder" />
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem {...formItemLayout} label="资源名称">
                                            <Input placeholder="placeholder" />
                                        </FormItem>
                                    </Col>
                                    <Col span={4}>
                                        <Button type="primary" htmlType="submit">筛选</Button>
                                    </Col>
                                </Row>
                            </Form>
                              {bundlelists.length > 0 &&
                            <div>
                                <TableBundles bundles={bundlelists} />
                            </div> 
                            } 
                        </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}

function mapStateToProps(state) {
  const { bundles } = state
  const {
    isRequesting,
    lastUpdated,
    bundlelists
  } = bundles || {
    isRequesting: true,
    bundlelists: []
  }
  return {
    bundlelists,
    isRequesting,
    lastUpdated
  }
}
export default connect(mapStateToProps)(List)