// const jwt = require("jwt-simple");
import qs from 'qs';
import Customers from '../Models/customers';
import { formatResp } from '../util';

export default function(req, res, next){
    const customer = {
        id: qs.parse(req.query).id || req.body.id
    };
    const customersEntity = new Customers();

    customersEntity.getCustomers(customer).then(user => {
        if(!user) {
            return res.status(200).json(formatResp({err: "Not Found!"}));
        }
        return res.status(200).json(formatResp({
            name: user.name,
            email: user.email,
            id: user.id,
            company: user.company
        }));
    }).catch(err => {
        return res.status(404).end(err);
    });
}