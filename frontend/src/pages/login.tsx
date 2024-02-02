"use client";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import lotus from '@/lotus.png'
import { userLogin } from '@/store/actions/authAction'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/router'
import { ERRORS_CLEAR, SUCCESS_MESSAGE_CLEAR } from '@/store/types/authType'
import { Socket, io } from 'socket.io-client'
import toast, { Toaster } from 'react-hot-toast'

interface Dictionary<T> {
    [Key: string]: T;
}

const Login = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { authenticate, errors, successMessage, myInfo } = useAppSelector(state => state.auth)
    const socketRef = useRef<Socket | null>(null)

    const [state, setState] = useState({
        email: '',
        password: '',
    })

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const login = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(userLogin(state))
    }

    const handleRouterReload = () => {
        //router.reload()
    }

    useEffect(() => {
        router.events.on('routeChangeComplete', handleRouterReload)
    }, [router])

    useEffect(() => {
        const init = async () => {
            const { Input,
                Ripple,
                initTE, } = await import("tw-elements");
            initTE({ Input, Ripple });;
        };
        init();
    }, []);

    useEffect(() => {
        const socket = io("ws://localhost:8000", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket

        if (socketRef.current) {
            socketRef.current.emit('checkIfActiveInstance', myInfo)
        }
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
                    <div className=" w-[20%] justify-center items-center align-middle">
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

                                    <form onSubmit={login}>
                                        <p className="mb-4">Please login to your account</p>
                                        {/*--Email input-*/}
                                        <div className="relative mb-4" data-te-input-wrapper-init>
                                            <input
                                                onChange={inputHandler}
                                                value={state.email}
                                                name='email'
                                                type="text"
                                                className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] 
                                                leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                                                data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none 
                                                dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                id="emailInput"
                                                placeholder="Username" />
                                            <label
                                                //for="exampleFormControlInput1"
                                                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate 
                                                pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out 
                                                peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary 
                                                peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] 
                                                motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                            >
                                                Email
                                            </label>
                                        </div>

                                        {/*--Password input-*/}
                                        <div className="relative mb-4" data-te-input-wrapper-init>
                                            <input
                                                onChange={inputHandler}
                                                value={state.password}
                                                name='password'
                                                type="password"
                                                className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] 
                                                leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                                                data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none 
                                                dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                id="passwordInput"
                                                placeholder="Password" />
                                            <label
                                                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] 
                                                truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out 
                                                peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary 
                                                peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] 
                                                motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                            >
                                                Password
                                            </label>
                                        </div>

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
                                                    dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                                                    data-te-ripple-init
                                                    data-te-ripple-color="light">
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