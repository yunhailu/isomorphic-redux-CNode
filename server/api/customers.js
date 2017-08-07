// const jwt = require("jwt-simple");
import qs from 'qs';
import Customers from '../Models/customers'

export default function(req,res,next){
    const customer = {
        id: qs.parse(req.query).id || req.body.id
    };
    const customersEntity = new Customers();

    customersEntity.getCustomers(
        customer
    ,(err,user)=>{
        if(user){
            return res.status(200).json({
                name: user.name,
                email: user.email,
                id: user.id,
                company: user.company
            })
        } else {
            return res.status(404).end()
        }
    })
}