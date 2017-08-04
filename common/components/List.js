import React from 'react';
import {connect} from 'react-redux';
import Picker from './Picker'
import TableBundles from './TableBundles'
import {selectAuthor,fetchPostsIfNeeded,invalidatePosts,fetchItem} from '../actions/actions'
import { Form, Row, Col, Spin ,Button,Menu, Icon,Input, Layout} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;

class List extends React.Component {
    constructor(props){
        super(props);
        this.handleShow = this.handleShow.bind(this)
    }
    componentDidMount(){
        const {dispatch} = this.props;
        //dispatch(fetchPostsIfNeeded(selectedAuthor))
    }
    // componentWillReceiveProps(nextProps){
    //     if(nextProps.selectedAuthor !== this.props.selectedAuthor){
    //         console.log('我要加载新的subreddit了')
    //         const {dispatch,selectedAuthor} = nextProps;
    //         dispatch(fetchPostsIfNeeded(selectedAuthor))
    //     }
    // }
    handleShow(id){
        const {dispatch} = this.props;
        dispatch(fetchItem(id));
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
                            >
                                <Row>
                                    <Col span={8}>
                                        <FormItem {...formItemLayout} label="资源ID">
                                            <Input placeholder="placeholder" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem {...formItemLayout} label="资源名称">
                                            <Input placeholder="placeholder" />
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <Button type="primary" htmlType="submit">筛选</Button>
                                    </Col>
                                </Row>
                            </Form>
                              {bundlelists.length > 0 &&
                            <div>
                                <TableBundles bundles={bundlelists} onShow={this.handleShow} />
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