"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Users, Briefcase, Snowflake, Gauge, PlusCircle, Phone, MessageCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { Car } from "../app/data/cars";
import ContactDialog from "./ContactDialog";

type CarCardProps = Car;

const CarCard: React.FC<CarCardProps> = ({
    category,
    name,
    image,
    passengers,
    luggage,
    ac,
    kms,
    rentalPrice,
    discountedPrice,
    gst,
    totalPrice,
    specialPrice,
    extraKm,
    extraHour,
    nightDeliveryCharge
}) => {

    return (
        <Card className="relative w-full rounded-lg shadow-md border p-2">
            {/* Car Category */}
            <div className="absolute left-0">
                <div className="relative bg-gradient-to-r from-[#257ce0] to-[#60b2ff] text-white text-xs font-semibold px-3 py-1 rounded-tr-md">
                    {category}
                </div>
            </div>

            {/* Car Image + Info */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center md:items-start">
                {/* Left side - Image + Name */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <Image
                        src={image}
                        alt={`Image of ${name}`}
                        width={220}
                        height={120}
                        className="object-contain w-full max-w-sm sm:max-w-md md:max-w-md"
                    />
                    <h2 className="font-bold text-base md:text-lg uppercase text-teal-700">{name}</h2>
                </div>

                {/* Right side - Info Badges */}
                <div className="flex-1 grid grid-cols-2 gap-2 place-items-center">
                    <div className="flex flex-col items-center justify-center border rounded-md p-3 w-full h-[80px] text-sm text-gray-700">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>Passenger x {passengers}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border rounded-md p-3 w-full h-[80px] text-sm text-gray-700">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span>Luggage x {luggage}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border rounded-md p-3 w-full h-[80px] text-sm text-gray-700">
                        <Snowflake className="w-5 h-5 text-blue-600" />
                        <span>AC {ac ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border rounded-md p-3 w-full h-[80px] text-sm text-gray-700">
                        <Gauge className="w-5 h-5 text-blue-600" />
                        <span>{kms}</span>
                    </div>
                </div>
            </div>

            {/* Fare + Additional Price */}
            <div className="border-t pt-1 ml-4 text-sm flex flex-col md:flex-row md:gap-6">
                {/* Fare Details */}
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800">Fare Details</h3>
                    <p>
                        Rental Price:{" "}
                        <span className="line-through text-gray-500">{rentalPrice}</span>{" "}
                        <span className="font-semibold text-gray-800">{discountedPrice}</span>
                    </p>
                    <p>
                        Night Delivery Charge:{" "}
                        <span className="font-semibold text-gray-800">{nightDeliveryCharge}</span>
                    </p>
                    <p>GST (5%): {gst}</p>
                    <p>
                        Total Price:{" "}
                        <span className="line-through text-gray-500">{totalPrice}</span>
                    </p>
                    <p className="text-green-600 font-bold">Special Price: {specialPrice}</p>
                </div>

                {/* Additional Price */}
                <div className="flex-1 mt-2 md:mt-0">
                    <h3 className="font-semibold text-gray-800 md:mb-1">Additional Price</h3>
                    <p className="text-red-500 flex items-center gap-1">
                        <PlusCircle className="w-4 h-4" /> Extra Km: {extraKm}
                    </p>
                    <p className="text-red-500 flex items-center gap-1">
                        <PlusCircle className="w-4 h-4" /> Extra Hour: {extraHour}
                    </p>
                    <p className="text-xs text-gray-500 md:mt-1">
                        ** Toll, Parking & Interstate taxes extra if applicable
                    </p>
                </div>
            </div>

            {/* Special Today Price Highlight */}
            <div className="flex gap-2 items-center justify-between p-3 bg-blue-50 border rounded-md">
                <div className="text-center rounded-md font-semibold text-gray-900">
                    Special Today Price:
                </div>
                <div className="text-center text-2xl font-bold text-blue-600">
                    {specialPrice}
                </div>
            </div>

            {/* Dialog */}
            <div className="flex flex-col md:flex-row">
                <ContactDialog
                    category={category}
                    name={name}
                    passengers={passengers}
                    luggage={luggage}
                    ac={ac}
                    specialPrice={specialPrice}
                />
            </div>
        </Card>
    );
};

export default CarCard;
