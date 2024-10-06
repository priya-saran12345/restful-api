import React, { useState } from 'react';
import axios from 'axios';
import style from '../styling/style.module.css';
import img from '../images/me.JPG';
import loader from '../images/loader.gif';
import { useNavigate } from 'react-router-dom';

const Addcategory = () => {
    const [product, setproduct] = useState('');
    const [image, setimage] = useState(null);
    const [price, setprice] = useState('');
    const [seeimage, setseeimage] = useState(img);
    const [isloading, setisloading] = useState(false);
    const [error, seterror] = useState('');
    const [haserr, sethaserr] = useState(false);
    let navigate = useNavigate();

    const submithandler = (e) => {
        e.preventDefault();
        setisloading(true);

        if (!product || !price || !image) {
            sethaserr(true);
            seterror("All fields are required.");
            setisloading(false);
            return;
        }

        const fD = new FormData();
        fD.append('description', product);
        fD.append('mrp', price);
        fD.append('photo', image); // Ensure this is the file object

        axios.post('https://restful-api-five.vercel.app/product', fD, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'multipart/form-data', // This header may not be necessary with FormData
            }
        })
        .then(result => {
            console.log(result.data);
            navigate('/category');
        })
        .catch(err => {
            console.error('Error in POST request:', err);
            sethaserr(true);
            seterror(err.message);
        })
        .finally(() => {
            setisloading(false); // Ensure loading state is reset
        });
    };

    return (
        <>
            <h2 className={`${style.h1} text-center my-4}`}>Add a new Product</h2>
            {isloading && 
                <div className='container w-50 d-flex justify-content-center'>
                    <img src={loader} className={style.load} alt='loading' />
                </div>
            }
            {!isloading && 
                <div className={`container w-25 rounded py-3 my-4 d-flex justify-content-center ${style.add}`}>
                    <form onSubmit={submithandler}>
                        <input 
                            type='text' 
                            className='w-100 p-1 rounded m-bottom-3' 
                            placeholder='Product description' 
                            onChange={(e) => setproduct(e.target.value)} 
                        />
                        <input 
                            type='file' 
                            placeholder='Image' 
                            onChange={(e) => {
                                setimage(e.target.files[0]);
                                setseeimage(URL.createObjectURL(e.target.files[0]));
                            }} 
                        />
                        <img className='rounded' src={seeimage} alt='preview' height='100px' width="100px" />
                        <input 
                            type='number' 
                            onChange={(e) => setprice(e.target.value)} 
                            className='w-100 p-1 rounded fs-6' 
                            placeholder='Price' 
                        />
                        <input 
                            type='submit' 
                            className='btn btn-primary' 
                            disabled={isloading} 
                        />
                    </form>
                </div>
            }
            {haserr && <p style={{ color: "red" }}>{error}</p>}
        </>
    );
}

export default Addcategory;
