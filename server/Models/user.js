/**
 * author       : Lishoulong
 * createTime   : 2017/8/14 11:00
 * description  :
 */

import mongoose from 'mongoose'
import db from './db'
mongoose.Promise = global.Promise
const Schema = mongoose.Schema;

const UserSchema = new Schema({
        iid: String,
        userName: {
            type: String,
            required: true,
        },
        password: String,
        status: String,
        realName: String,
        orgId: String,
        dutyId: String,
        mobile: String,
        email: String,
        gender: String,
        age: Number,
        address: String,
        post: String,
        lastResetPwdTime: String,
        lastLoginIp: String,
        isAdmin: String,
        creater: String,
        cardBank: String,
        cardNum: String,
        costCenterName: String,
        costCenterCode: String,
        onboardTime: String,
        employId: String,
        cityId: String,
        msn: String,
        leaders: String,
        empClassify: String,
        positionName: String,
        location: String,
        updateUser: String,
        subordinates: [Schema.Types.Mixed],
        isRNAdmin: { //是否是管理员
            type: Boolean,
            default: false,
        },
        isDel: { //是否删除
            type: Boolean,
            default: false,
        },
    }, {
        timestamps: true,
    }
);

export default db.model('user',UserSchema);