import React, { PropTypes, Component } from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { Card,Row,Col,Rate,Icon,Pagination,Table, Button } from 'antd';
import {postApi} from '../util/api';
import io from 'socket.io-client'
const socket = io('http://localhost:3000');

export default class Bundles extends Component {
  constructor(props){
        super(props);
        const {bundles} = this.props;
        this.state = {
          currentPage: 1,
          currentBundles: this.handlePosts(bundles).slice(0,15)
        };
        this.onChange = this.onChange.bind(this);
        socket.on('bundleUpload',(data) => this.bundleUpload(data))
    }
  bundleUpload(data){
    console.log('bundleupload', data);
  }
  onChange(page,total){
    const {bundles} = this.props;
    //console.log(bundles.length)
    this.setState({
      currentPage: page,
      currentBundles: page*15>bundles.length?this.handlePosts(bundles).slice((page-1)*15): this.handlePosts(bundles).slice((page-1)*15,page*15)
    })
  }
  handlePosts(bundles){
    return bundles.map((bundle,i) => {
        if(!bundle.key){
            bundle.key = i;
        }
        return bundle;
    })
  }
  enterDetail(id){
    browserHistory.push(`/detail/${id}`);
  }
  bundleCdn(resourceId, resourceUrl){
    console.log('resourceId',resourceId);
    console.log('resourceUrl',resourceUrl);
    const content = JSON.stringify({
                resourceId,
                resourceUrl
            })
    postApi('bundleUpload', content)
        .then(res=>{
            if(res.ok){
                console.log('res.ok');
            }
        })
  }
  componentWillReceiveProps(props){
    const {bundles} = props;
    this.setState({
      currentPage: 1,
      currentBundles: this.handlePosts(bundles).slice(0,15)
    })
  }
  render() {
    const {bundles} = this.props;
    const columns = [{
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          const id = this.state.currentBundles[index]['_id'];
          const resourceId = this.state.currentBundles[index]['resourceId'];
          const resourceUrl = this.state.currentBundles[index]['resourceUrl'];
          return (
            <span>
              <a onClick={() => this.enterDetail(id)}>操作</a>
              <span className="ant-divider" />
              <a onClick={() => this.bundleCdn(resourceId, resourceUrl)}>上线</a>
            </span>
          )
        },
    }, {
        title: '资源ID',
        dataIndex: 'resourceId'
    },{
        title: 'bundle名字',
        dataIndex: 'bundleName',
    },{
        title: '业务线',
        dataIndex: 'businessType',
    },{
        title: '支持app最低版本',
        dataIndex: 'appType',
    },{
        title: 'base版本',
        dataIndex: 'baseType',
    },{
        title: '简述',
        dataIndex: 'simDescription',
    }];
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    return (
      <div style={{ background: 'white', padding: '30px', minHeight:'600px', fontSize:'16px' }}>
        {/* {this.state.currentBundles.map((post, i) =>
          <Row  key={i} style={{borderBottom:'1px solid #EDEDED',height:'50px',lineHeight:'50px',overflow:'hidden'}}>
            <Col span="2">{post.author}:</Col>
            <Col span="2"><span style={{backgroundColor:'green',color:'white'}}>{post.type}</span></Col>
            <Col span="12"><Link className="link" to={"/item/" + post.flag} >{post.title}</Link></Col>
            <Col span="2"><span style={{color:'red'}}>{post.discussion.length}</span>条评论</Col>
            <Col span="6"><span>{post.time.minute}</span></Col>
          </Row>
        )} */}
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.currentBundles} bordered/>
        <Pagination style={{marginTop:'5px'}} showQuickJumper defaultCurrent={1} total={bundles.length} defaultPageSize={15} onChange={this.onChange} />
      </div>
    )
  }
}

Bundles.propTypes = {
  bundles: PropTypes.array.isRequired
}