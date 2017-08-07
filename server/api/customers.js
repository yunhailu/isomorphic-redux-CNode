// const jwt = require("jwt-simple");
import qs from 'qs';
import Q from 'q';
import Customers from '../Models/customers'

const ext = (customersEntity, customer) => {
    const deferred = Q.defer();
    customersEntity.getCustomers(customer, (err,user) => {
        if(err){
            deferred.reject(err);
        } else {
            deferred.resolve(user);
        }
    });
    return deferred.promise;
};

export default function(req,res,next){
    const customer = {
        id: qs.parse(req.query).id || req.body.id
    };
    const customersEntity = new Customers();

    // customersEntity.getCustomers(customer, (err,user)=>{
    //     if(user){
    //         return res.status(200).json({
    //             name: user.name,
    //             email: user.email,
    //             id: user.id,
    //             company: user.company
    //         })
    //     } else {
    //         return res.status(404).end()
    //     }
    // })

    ext(customersEntity, customer).then(user => {
        return res.status(200).json({
            name: user.name,
            email: user.email,
            id: user.id,
            company: user.company
        });
    }, err => res.status(404).end());
}