import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
export default function SignupScreen() {
    //naviaget  to pefer location
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    //need to store submit handler data in local storage
    //access to context in local storage below lines
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        //pervent to refreshing hte page next line
        e.preventDefault();
        //send jsx request to bakend
        if (password !== confirmPassword) {
            toast.error('Password do not match');
            return;
        }
        try {
            const { data } = await Axios.post('/api/users/signup', {
                name,
                email,
                password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            // console.log(data);
            //save local storage in browerse storage
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        } catch (err) {
            toast.error(getError(err));
        }
    };
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);
    return (
        <Container className="small-container" id="id-small-conatiner">
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <h1 className='my-3'>Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='name' >
                    <Form.Label>Name</Form.Label>
                    <Form.Control required onChange={(e) => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='email' >
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password' >
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='confirmPassword' >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' required onChange={(e) => setConfirmPassword(e.target.value)} />
                </Form.Group>

                <div className='mb-3'>
                    <Button type='submit'>Sign Up</Button>
                </div>
                <div className='mb-3'>
                    Already have an account?{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                </div>
            </Form>
        </Container>
    )
}
