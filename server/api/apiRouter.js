import Express from 'express';
import getItem from './getItem';
import getList from './getList';
import user from './user';
import addPost from './addPost';
import log from './log';
import reg from './reg';
import comment from './comment';
import vote from './vote';
import auth from '../middleware/auth';
import sortUsers from './sortUsers';
import getUserInfo from './getUserInfo';
import addProperty from './addProperty';
import getPropertyList from './getPropertyList';
import addBundle from './addBundle';
import getBundleList from './getBundleList';
import updateBundle from './updateBundle';
const co = require('co')

const router = Express.Router();

router.get('/post', co.wrap(getList));
router.post('/post', auth);
router.post('/post',addPost);

router.get('/detail',getItem);

router.post('/log',log);

router.post('/reg',reg);

router.post('/user',user);

router.post('/comment',auth);
router.post('/comment',comment)

router.post('/vote',auth);
router.post('/vote',vote);

router.get('/sortUsers',sortUsers);

router.post('/getUserInfo',getUserInfo);

// 增查属性接口
router.post('/property', co.wrap(addProperty));
router.get('/propertyList',co.wrap(getPropertyList));

// bundles api
router.post('/bundle', co.wrap(addBundle));
router.get('/getBundles',co.wrap(getBundleList));
router.put('/updateBundle',co.wrap(updateBundle));

export default router;