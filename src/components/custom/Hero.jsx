import React from 'react'
import { Button } from '../ui/button'
import { Link } from "react-router-dom";
export const Hero = () => {
  return (
    <div className="py-20 px-4 flex flex-col items-center max-w-6xl mx-auto gap-8 text-center">
      <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl text-center mb-6 leading-tight">
        Tap, Plan, Go — With Virllo’s AI, your dream tour is just a click away. Smart, seamless, and made just for you.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-10 leading-relaxed">
        Discover your next adventure with AI-powered planning. Virllo makes trip creation effortless, fast, and tailored to you.
      </p>
      <Link to={"/create-trip"}>
        <Button className="mt-8 px-10 py-5 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          Begin Your Journey
        </Button>
      </Link>
    </div>
  )
}
export default Hero