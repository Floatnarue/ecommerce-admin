import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import Spinner from './spinner';
import { ReactSortable } from 'react-sortablejs';
export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties : assignedProperties ,
}) {
    const router = useRouter();
    const [title, setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }, []);
    async function saveProduct(e) {

        // we dont't want it to refresh all the time => use e.preventDefault() ;
        e.preventDefault();
        const data = { 
            title, description, price, images, category , properties : productProperties , 
        };


        if (_id) {
            // update product
            await axios.put('/api/products', { ...data, _id });

        } else {
            // create product
            await axios.post('/api/products', data)

        }


        setGoToProducts(true);

    };

    async function uploadImages(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            })
            setIsUploading(false);
        }

    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }


    const propertiesToFill = [];
    // check if we have category select ? 
    if (category && categories.length > 0) {
        // find category id we were selected in categories
        let catInfo = categories.find(({ _id }) => _id === category);
        // push all props into var
        propertiesToFill.push(...catInfo.properties);
        // check if category have parents ?
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            // set catInfo back to parentCat
            catInfo = parentCat;
        }

    }




    if (goToProducts) {
        router.push('/products');
    }


    return (



        <form onSubmit={saveProduct}>

            <label>Product name</label>
            <input type='text' className='text-black' placeholder='product name' value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>
                Category
            </label>
            <select value={category} onChange={ev => setCategory(ev.target.value)} className='text-black'>
                <option value="">
                    Uncategorised
                </option>
                {categories.length > 0 && categories.map(c => (


                    <option value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className='text-black'>
                    <div>
                        {p.name}
                    </div>
                    <select value={productProperties[p.name]}
                        onChange={(ev) => setProductProp(p.name, ev.target.value)}>
                        {p.values.map(v => (
                            <option value={v}>
                                {v}
                            </option>
                        ))}

                    </select>
                </div>
            ))}
            <label>
                Photos
            </label>
            <div className='mt-2 mb-2 flex flex-wrap gap-1'>
                <ReactSortable
                    className='flex flex-wrap gap-1 '
                    list={images}
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-md
                        border border-gray-200">
                            <img src={link} alt="" className='rounded-lg' />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    // use spinner when isUploading is true ;
                    <div className='h-24 flex items-center '>
                        <Spinner />
                    </div>
                )}
                <label className='w-24 h-24 border text-sm flex flex-col items-center justify-center gap-1 
                text-gray-500 rounded-md bg-gray-200
                '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type='file' onChange={uploadImages} className='hidden' />

                </label>


            </div>
            <label>Description</label>
            <textarea placeholder='description'
                className='text-black'
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>

            <label>Price (in USD)</label>
            <input type='text' className='text-black' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)} />

            <button type='submit' className='btn-primary' >Save</button>

        </form>



    );
}
