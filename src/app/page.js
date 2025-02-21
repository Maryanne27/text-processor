"use client";

import { useRouter } from 'next/navigation';
import  React, { useState } from 'react';
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter()
  return (
    <section className="relative w-full h-screen flex items-center">
      <div className="absolute inset-0">
        <Image
          src="/bg.JPG"  
          alt="AI Brain Background"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
      </div>

     
      <div className="relative z-10 max-w-xl ml-10 md:ml-20 text-white">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold"
        >
          Supercharge Your Text with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 text-base md:text-xl text-[FAFAFA]"
        >
          Summarize, Translate, and enhance text effortlessly.
        </motion.p>

       
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
         
        >
           <button 
            className="mt-6 px-6 py-3 rounded-xl bg-gray-200 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] text-gray-700 font-semibold transition-all duration-300 ease-in-out hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff]"
       onClick={() => router.push('/main')} 
      >
        Get Started
       </button>
        </motion.div>
        



      </div>
    </section>
  );
}
