"use client"

import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import Link from 'next/link'
import LottieAnimation from './landing/lottieAnimation'
import Scroller from "./stockupdates/scroller"

export default function Home() {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <main className="flex min-h-screen items-start justify-start bg-black text-white p-4 overflow-hidden">
            {loading ? (
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 21.5L17.5 13L13 10L15 2.5L6.5 11L11 14L9 21.5Z"
                            fill="white"
                        />
                    </svg>
                </motion.div>
            ) : (
                <div className="max-w-2xl text-left mt-40 ml-32">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 animate-fade-in-down">
                        SolaceFlow.
                    </h1>
                    <div className="text-xl sm:text-2xl mb-8 animate-fade-in-up">
                        Seamless trading platform using Solace for equity data flow and executing trades.
                    </div>
                    <div className={`scrolling-text ${isVisible ? "scrolling" : ""}`}>< Scroller /></div>
                    
                    <Link
                        href="/trading"
                        className="inline-block transition-transform animate-fade-in"
                    >
                        <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-100 px-6 font-black text-black"><span>Try it Out</span><div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg></div></button>
                    </Link>
                    <Link
                        href="#"
                        className="inline-block transition-transform animate-fade-in pl-6"
                    >
                        <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gray-700 px-6 font-black text-white"><span>Demo Video</span><div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg></div></button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, x: 30, y: -30 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 1.4 }}
                        className="p-6 rounded-lg shadow-lg pt-32 blur-[2px]"
                    >
                        <div className="w-[1000px] h-64-rotate-12 skew-y-6 -ml-5">
                            <img
                                src="https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="3D Effect"
                                width={1920}
                                height={1080}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        transition={{ duration: 0.01, ease: 'easeOut', delay: 1 }}
                    >
                        <div style={{
                            position: 'fixed',
                            top: '2%',
                            right: '6%',
                            opacity: '40%'
                        }}>
                            <LottieAnimation />
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    )
}