'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, User, Briefcase, Settings } from 'lucide-react';
import Image from 'next/image';

const carBrands = ['Honda', 'Audi', 'Nissan', 'Mazda', 'Toyota'];

const cars = [
    {
        brand: 'Honda',
        name: 'Mercedes-Benz E-Class Luxury',
        image: '/cars/mercedes-1.png',
        transmission: 'Auto',
        price: '$120',
    },
    {
        brand: 'Honda',
        name: 'Kia Motors Subcompact car',
        image: '/cars/kia.png',
        transmission: 'Manual',
        price: '$120',
    },
    {
        brand: 'Honda',
        name: 'Mercedes-Benz E-Class Luxury',
        image: '/cars/mercedes-2.png',
        transmission: 'Auto',
        price: '$120',
    },
    {
        brand: 'Honda',
        name: 'Tesla Model S',
        image: '/cars/tesla.png',
        transmission: 'Auto',
        price: '$120',
    },
    {
        brand: 'Toyota',
        name: 'Toyota Corolla',
        image: '/cars/toyota-corolla-white.png',
        transmission: 'Manual',
        price: '$120',
    },
    {
        brand: 'Toyota',
        name: 'Toyota Corolla',
        image: '/cars/toyota-corolla-red.png',
        transmission: 'Manual',
        price: '$120',
    },
    {
        brand: 'Kia',
        name: '8 seater 2023 kia carnival',
        image: '/cars/kia-carnival.png',
        transmission: 'Manual',
        price: '$120',
    },
    {
        brand: 'Mazda',
        name: 'Mitsubishi ASX',
        image: '/cars/mitsubishi-asx.png',
        transmission: 'Auto',
        price: '$120',
    },
];

const PopularCarDeals = () => {
    const [activeBrand, setActiveBrand] = useState('Honda');

    return (
        <section className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3">
                    Book Your Car in Minutes – Here’s How
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
                    Experience a seamless ride booking journey — from choosing your car to hitting the road, it’s quick, easy, and hassle-free.
                </p>
            </div>

            {/* Brand Tabs */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap">
                {carBrands.map((brand) => (
                    <Button
                        key={brand}
                        variant={brand === activeBrand ? 'default' : 'outline'}
                        className="text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 sm:py-2"
                        onClick={() => setActiveBrand(brand)}
                    >
                        {brand}
                    </Button>
                ))}
            </div>

            {/* Car Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {cars
                    .filter((car) => car.brand === activeBrand)
                    .map((car, index) => (
                        <Card
                            key={index}
                            className="p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200"
                        >
                            <Image
                                src={car.image}
                                alt={car.name}
                                width={300}
                                height={200}
                                className="w-full h-32 sm:h-36 md:h-40 object-contain mb-3 sm:mb-4"
                            />
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate mb-1">
                                {car.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                Transmission: {car.transmission}
                            </p>

                            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3 sm:w-4 sm:h-4" /> 4
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" /> 2
                                </div>
                                <div className="flex items-center gap-1">
                                    <Car className="w-3 h-3 sm:w-4 sm:h-4" /> 4
                                </div>
                                <div className="flex items-center gap-1">
                                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" /> 2
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-primary font-semibold text-sm sm:text-base">
                                    {car.price}{' '}
                                    <span className="text-xs sm:text-sm font-normal text-gray-500">
                                        / Day
                                    </span>
                                </span>
                                <Button
                                    size="sm"
                                    className="text-xs sm:text-sm px-3 py-1 sm:px-4"
                                >
                                    Book now
                                </Button>
                            </div>
                        </Card>
                    ))}
            </div>

            {/* See All Button */}
            <div className="mt-6 text-center">
                <Button variant="secondary" className="text-sm sm:text-base">
                    See All
                </Button>
            </div>
        </section>
    );
};

export default PopularCarDeals;
