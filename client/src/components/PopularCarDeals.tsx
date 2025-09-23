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
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">
                    Book Your Car in Minutes – Here’s How
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Experience a seamless ride booking journey — from choosing your car to hitting the road, it’s quick, easy, and hassle-free.
                </p>
            </div>

            {/* Brand Tabs */}
            <div className="flex justify-center gap-4 mb-10 flex-wrap">
                {carBrands.map((brand) => (
                    <Button
                        key={brand}
                        variant={brand === activeBrand ? 'default' : 'outline'}
                        onClick={() => setActiveBrand(brand)}
                    >
                        {brand}
                    </Button>
                ))}
            </div>

            {/* Car Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cars
                    .filter((car) => car.brand === activeBrand)
                    .map((car, index) => (
                        <Card key={index} className="p-4 rounded-xl shadow-sm border border-gray-200">
                            <Image
                                src={car.image}
                                alt={car.name}
                                width={300}
                                height={200}
                                className="w-full h-40 object-contain mb-4"
                            />
                            <h3 className="font-semibold text-gray-800 text-sm truncate mb-1">
                                {car.name}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">Transmission: {car.transmission}</p>

                            <div className="flex justify-between text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" /> 4
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" /> 2
                                </div>
                                <div className="flex items-center gap-1">
                                    <Car className="w-4 h-4" /> 4
                                </div>
                                <div className="flex items-center gap-1">
                                    <Settings className="w-4 h-4" /> 2
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-primary font-semibold text-sm">
                                    {car.price} <span className="text-xs font-normal text-gray-500">/ Day</span>
                                </span>
                                <Button size="sm" className="text-xs px-4 py-1">
                                    Book now
                                </Button>
                            </div>
                        </Card>
                    ))}
            </div>

            <div className="mt-10 text-center">
                <Button variant="secondary">See All</Button>
            </div>
        </section>
    );
};

export default PopularCarDeals;
