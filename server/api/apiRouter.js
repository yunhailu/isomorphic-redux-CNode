import Express from 'express';
import addProperty from './addProperty';
import getPropertyList from './getPropertyList';
import addBundle from './addBundle';
import getBundleList from './getBundleList';
import updateBundle from './updateBundle';
import reg from './reg';
import getUser from './getUser';
import logout from './logout';
import bundleUpload from './bundleUpload';

const router = Express.Router();

// 增查属性接口
router.post('/property', addProperty);
router.get('/propertyList',getPropertyList);

// bundles api
router.post('/bundle', addBundle);
router.get('/getBundles',getBundleList);
router.put('/updateBundle',updateBundle);
router.post('/bundleUpload', bundleUpload)

// register
router.post('/reg', reg);

// logout
router.get('/logout', logout);

// 获取用户信息
router.get('getUser', getUser);

export default router;