"use client";

import React from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

import animationData from "./landing.json";

const LottieAnimation = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={600} width={600} />
        </div>
    );
};

export default LottieAnimation;
