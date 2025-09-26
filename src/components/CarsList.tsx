"use client";
import CarCard from "./CarCard";
import { cars } from "../app/data/cars";

const CarsList = () => {
    return (
        <div className="w-full space-y-6">
            {cars.map((car, idx) => (
                <CarCard key={idx} {...car} />
            ))}
        </div>
    );
};

export default CarsList;
