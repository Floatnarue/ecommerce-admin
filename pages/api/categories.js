import { Category } from '@/models/Category';

import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from 'next-auth';
import { authOption, isAdminRequest } from './auth/[...nextauth]';

export default async function handle(req, res) {
    try {
        
        await mongooseConnect();
        await isAdminRequest(req,res) ;

        
    } catch (error) {
        res.status(500).send(error);
        return;
    }


    
    
    

    const { method } = req;


    if (method === "POST") {
        const { name, parentCategory , properties} = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties , // need to be array 
        });
        res.json(categoryDoc);


    }

    if (method === "GET") {
        res.json(await Category.find().populate('parent'));
    }

    if (method === "PUT") {
        const { name, parentCategory,properties, _id } = req.body;
        const categoryDoc = await Category.updateOne({ _id },
            {
                name,
                parent: parentCategory,
                properties
            });
        res.json(categoryDoc);
    }

    if (method === "DELETE") {
        const {_id}  = req.query ;
        await Category.deleteOne({_id}) ;
        res.json('ok')
    }



}
