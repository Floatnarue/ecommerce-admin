import Layout from '@/components/Layout';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';

import { withSwal } from 'react-sweetalert2';





function Categories({ swal }) {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState("");
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories')
            .then(response => {
                setCategories(response.data)
            });
    }

    async function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name,values}) => (
            {
                name ,
                values : values.join(',')
            }
        )));


    }


    async function saveCategory(e) {
        e.preventDefault();
        const data = { 
            name, 
            parentCategory , 
            properties : properties.map(prop => (
                {
                    name : prop.name,
                    values : prop.values.split(',')
                }
            )),
        };

        if (editedCategory) {
            await axios.put('/api/categories', { ...data, _id: editedCategory._id });
        }
        else {
            await axios.post('/api/categories', data);

        }

        

        setName('');
        fetchCategories();
        setEditedCategory("");
        setParentCategory("");
        setProperties([]);


    }

    async function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: "Yes , Delete!",
            confirmButtonColor: "#d55",
            reverseButtons: true,

        }).then(result => {
            if (result.isConfirmed) {
                const { _id } = category;
                axios.delete('/api/categories?_id=' + _id);
                fetchCategories();

            }
        })



    }

    async function addProperties() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }]
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }



    return (
        <Layout>
            <h1>Categories</h1>
            <label >
                {editedCategory
                    ? `Edit category ${editedCategory.name}`
                    : "Create new category name"}
            </label>
            <form onSubmit={saveCategory}
                className=' text-black'>
                <div className='flex gap-1'>
                    <input

                        value={name}
                        type='text'
                        placeholder={'Category name'}
                        onChange={(e) => setName(e.target.value)} />
                    <select
                        value={parentCategory}

                        onChange={(e) => setParentCategory(e.target.value)}>
                        <option value="">No parent category</option>
                        {categories?.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                    </select>


                </div>
                <div className='gap-1 '>
                    <label className='block mt-1'>
                        Properties
                    </label>
                    <button className='btn-default text-sm'
                        onClick={addProperties}
                        type='button'>
                        Add new properties
                    </button>
                    {properties.length > 0&& properties.map((property, index) => (
                        <div className='flex gap-1 mt-2 mb-2'>
                            <input
                                type='text'
                                value={property.name}
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder='property name (example : color)' />
                            <input
                                type='text'
                                value={property.values}
                                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                                placeholder='values, comma seperated' />

                            <button
                                className='btn-default'
                                onClick={() => removeProperty(index)}>
                                Remove
                            </button>
                        </div>

                    ))}
                </div>
                <div className='flex gap-1 mt-3'>
                    {editedCategory && (
                        <button
                            type='button'
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                            }}
                            className='btn-default '>

                            Cancel
                        </button>


                    )}

                    <button type='submit' className='btn-primary flex'>
                        Save
                    </button>
                </div>

            </form>

            {!editedCategory && (
                <table className='basic mt-4'>
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody className='text-black '>
                        {categories.length > 0 && categories.map
                            (category => (
                                <tr>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>

                                    <td>
                                        <button onClick={() => editCategory(category)} className='btn-primary'>Edit</button>
                                        <button
                                            onClick={() => deleteCategory(category)}
                                            className='btn-primary ml-2'>Delete</button>
                                    </td>

                                </tr>
                            ))}
                    </tbody>
                </table>
            )}


        </Layout>
    );


}


export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />

));
