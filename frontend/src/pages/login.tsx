"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import lotus from '@/lotus.png'
import { userLogin } from '@/store/actions/authAction'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/router'
import { ERRORS_CLEAR, SUCCESS_MESSAGE_CLEAR } from '@/store/types/authType'
import toast, { Toaster } from 'react-hot-toast'
import { socket } from '@/socket';

const Login = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { authenticate, errors, successMessage, myInfo } = useAppSelector(state => state.auth)

    const [formInputState, setFormInputState] = useState({
        email: '',
        password: '',
    })

    const fields= [
        {
            name: 'email',
            placeholder: 'Email'
        },
        {
            name: 'password',
            placeholder: 'Password'
        }
    ]

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        setFormInputState({
            ...formInputState,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(userLogin(formInputState))
    }

    useEffect(() => {
        socket.emit('checkIfActiveInstance', myInfo)
    }, [myInfo])

    useEffect(() => {
        if (authenticate) {
            router.push('/')
        }
        if (successMessage) {
            dispatch({
                type: SUCCESS_MESSAGE_CLEAR
            })
        }
        if (errors.length != 0) {
            dispatch({
                type: ERRORS_CLEAR
            })
        }
    })

    useEffect(() => {
        errors.map((error: string) => {
            toast.error(`${error}`)
        })
    }, [errors])

    return (
        <>
            <Toaster
                position={'top-center'}
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontSize: '18px'
                    }
                }}
            />
            <section className="gradient-form min-h-screen bg-neutral-200 dark:bg-neutral-700">
                <div className="flex min-h-screen items-center justify-center text-neutral-800 dark:text-neutral-200">
                    <div className=" min-w-[400px] max-w-[400px] justify-center items-center align-middle">
                        <div className="rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                            {/*-- Left column container-*/}
                            <div className="px-4 md:px-0 w-full">
                                <div className="mx-6">
                                    {/*--Logo-*/}
                                    <div className="text-center">
                                        <Image
                                            className="mx-auto w-48 h-auto"
                                            src={lotus}
                                            alt="logo" />
                                        <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                                            Lotus Messenger
                                        </h4>
                                    </div>

                                    <form onSubmit={handleLogin}>
                                        <p className="mb-4">Please login to your account</p>
                                        {
                                            fields.map((field) => {
                                                return (
                                                    <div className="relative mb-4" >
                                                        <input
                                                            onChange={handleInputChanges}
                                                            value={field.name === 'email' ? formInputState.email : formInputState.password}
                                                            type="text"
                                                            name={field.name}
                                                            id="floating_outlined"
                                                            className="block px-2.5 h-9 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-[5px] border border-gray-500 focus:border-none
                                                                     text-white focus:border-blue-500 focus:outline-none focus:ring-2 peer"
                                                            placeholder=" " />
                                                        <label
                                                            htmlFor="floating_outlined"
                                                            className="absolute text-nm text-white duration-300 transform -translate-y-4 scale-[0.9] top-1 z-10 origin-[0] ml-2 px-1
                                                                       peer-focus:ml-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 bg-darkBgPrimary
                                                                       peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-[0.9] peer-focus:-translate-y-4
                                                                     peer-focus:text-primary rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 ">
                                                            {field.placeholder}
                                                        </label>
                                                    </div>  
                                                )
                                            })
                                        }

                                        {/*--Submit button-*/}
                                        <div className="mb-12 pb-1 pt-1 text-center">
                                            <button
                                                className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal 
                                                text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out 
                                                hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] 
                                                focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] 
                                                focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] 
                                                bg-gradient-to-r from-orange via-magneta to-crayola"
                                                type="submit"
                                                data-te-ripple-init
                                                data-te-ripple-color="light">
                                                Log in
                                            </button>

                                            {/*--Forgot password link-*/}
                                            <a href="#!">Forgot password?</a>
                                        </div>

                                        {/*--Register button-*/}
                                        <div className="flex items-center justify-between pb-6">
                                            <p className="mb-0 mr-2">{`Don't have an account?`}</p>
                                            <Link href={'/register'} title='Register'>
                                                <button
                                                    type="button"
                                                    className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase 
                                                    leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 
                                                    hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 
                                                    focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 
                                                    dark:hover:bg-neutral-100 dark:hover:bg-opacity-10">
                                                    Register
                                                </button>
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login;