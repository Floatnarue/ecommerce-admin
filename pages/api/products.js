

import product from "@/models/Product"
import mongooseConnect from "@/lib/mongoose";
export default async function handle(req, res) {

    const { method } = req;
    res.json(req.method)
    try {
        await mongooseConnect() ; 

    } catch (error) {
        res.status(500).send(error);
    }


    if (method === 'POST') {
        const { title, description, price } = req.body;
        const productDoc = await product.create({
            title, description, price,
        });
        res.json(productDoc);
    }
}


