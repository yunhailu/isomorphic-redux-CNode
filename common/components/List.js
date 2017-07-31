import React from 'react';
import {connect} from 'react-redux';
import Picker from './Picker'
import Posts from './Posts'
import TablePosts from './TablePosts'
import Side from './Side'
import {selectAuthor,fetchPostsIfNeeded,invalidatePosts,fetchItem} from '../actions/actions'
import { Form, Row, Col, Spin ,Button,Menu, Icon,Input, Layout} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;

class List extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
        this.handleShow = this.handleShow.bind(this)
    }
    componentDidMount(){
        const {dispatch,selectedAuthor} = this.props;
        //dispatch(fetchPostsIfNeeded(selectedAuthor))
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.selectedAuthor !== this.props.selectedAuthor){
            console.log('我要加载新的subreddit了')
            const {dispatch,selectedAuthor} = nextProps;
            dispatch(fetchPostsIfNeeded(selectedAuthor))
        }
    }
    handleChange(nextAuthor){
        this.props.dispatch(selectAuthor(nextAuthor));
    }
    handleRefreshClick(e) {
        e.preventDefault()

        const { dispatch, selectedAuthor } = this.props
        dispatch(invalidatePosts(selectedAuthor))
        dispatch(fetchPostsIfNeeded(selectedAuthor))
    }
    handleShow(id){
        const {dispatch} = this.props;
        dispatch(fetchItem(id));
    }
    handleSearch(){
        console.log('submit');
    }
    render(){
        const { item,selectedAuthor, params,posts, isFetching, lastUpdated,user} = this.props;
        let realPosts = params.author===undefined?posts:posts.filter((post)=>post.author===params.author);
        let postsHaveNoComment = realPosts.filter((post)=>post.discussion.length === 0);
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };
        return (
            <div>
                <Layout>
                    <Content style={{marginRight:'20px'}}>
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
                            {realPosts.length > 0 &&
                            <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                                {/* <Posts posts={realPosts} onShow={this.handleShow}/> */}
                                <TablePosts posts={realPosts} onShow={this.handleShow} />
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
  const { selectedAuthor, postsByAuthor, item, user } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByAuthor[selectedAuthor] || {
    isFetching: true,
    items: []
  }
  return {
    selectedAuthor,
    posts: posts||[],
    isFetching,
    lastUpdated,
    item,
    user
  }
}
export default connect(mapStateToProps)(List)