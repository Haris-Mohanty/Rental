"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { User, Briefcase, Wind, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { cars as defaultCars } from "../app/data/cars";
import ContactDialog from "./ContactDialog";
import { motion } from "framer-motion";

type Car = {
  category: string;
  name: string;
  image: string;
  passengers: number;
  luggage: number;
  ac: boolean;
  kms: string;
  specialPrice: string;
};

const PopularCarsSlider = ({ cars = defaultCars }: { cars?: Car[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === cars.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile, cars.length]);

  const prevSlide = () => setCurrentIndex((prev) => (prev - itemsPerPage + cars.length) % cars.length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + itemsPerPage) % cars.length);

  const visibleCars = Array.from({ length: itemsPerPage }, (_, i) => cars[(currentIndex + i) % cars.length]);

  return (
    <section className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Popular Car Deals</h2>
        <p className="text-gray-500 text-base">Choose your ride – affordable & comfortable</p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:flex relative items-center">
        <button onClick={prevSlide} className="absolute -left-6 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {visibleCars.map((car, idx) => (
            <CarCard key={idx} car={car} />
          ))}
        </div>

        <button onClick={nextSlide} className="absolute -right-6 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-gray-100">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative items-center justify-center">
        <button
          onClick={() => setCurrentIndex(currentIndex === 0 ? cars.length - 1 : currentIndex - 1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="w-full flex justify-center">
          <CarCard car={cars[currentIndex]} />
        </div>

        <button
          onClick={() => setCurrentIndex(currentIndex === cars.length - 1 ? 0 : currentIndex + 1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

// ----- CarCard Component -----
const CarCard = ({ car }: { car: Car }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    whileHover={{ scale: 1.05 }}
    className="w-full max-w-xs sm:max-w-md"
  >
    <Card className="relative p-4 sm:p-4 rounded-xl shadow-md border text-center hover:shadow-lg transition">
      <div className="absolute left-0 top-0">
        <div className="bg-gradient-to-r from-[#257ce0] to-[#60b2ff] text-white text-xs font-semibold px-3 py-1 rounded-tr-md rounded-bl-md">
          {car.category}
        </div>
      </div>

      <Image
        src={car.image}
        alt={car.name}
        width={400}
        height={250}
        className="w-full h-32 md:h-40 object-contain"
      />

      <h3 className="font-semibold text-lg truncate text-teal-700">{car.name}</h3>
      <p className="text-sm text-gray-500">{car.kms}</p>

      <div className="flex justify-center gap-4 sm:gap-6 text-gray-600 text-sm">
        <div className="flex items-center gap-1"><User className="w-4 h-4 text-green-600" /> {car.passengers}</div>
        <div className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-green-600" /> {car.luggage}</div>
        <div className="flex items-center gap-1"><Wind className="w-4 h-4 text-green-600" /> {car.ac ? "AC" : "Non-AC"}</div>
        <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-green-600" /> 12 hr</div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-2">
        <span className="font-semibold text-lg text-red-500">
          {car.specialPrice}
          <span className="text-sm font-normal text-teal-600"> /12 hrs</span>
        </span>

        <ContactDialog
          category={car.category}
          name={car.name}
          passengers={car.passengers}
          luggage={car.luggage}
          ac={car.ac}
          specialPrice={car.specialPrice}
        />
      </div>
    </Card>
  </motion.div>
);

export default PopularCarsSlider;
