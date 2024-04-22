import mongoose, { model, Schema, models } from 'mongoose';

const OrderSchema = new Schema({
    line_items :Object ,
    name : String ,
    tel : String ,
    address : String ,
    city : String ,
    portal : String ,
    email : String ,
    paid : Boolean ,

}, {
    timestamps: true,
});


export const Order = models.Order || model('Order', OrderSchema);