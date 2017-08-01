import mongoose from 'mongoose';
const propertyEntity = mongoose.model('property');

export default function(req,res,next){
    propertyEntity.get(null,(err,propertys)=>{
        if(err){
            return res.status(500).end('服务器错误');
        } 
        return res.status(200).json(propertys.reverse());
    })
}