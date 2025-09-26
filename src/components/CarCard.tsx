"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Users, Briefcase, Snowflake, Gauge, PlusCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface CarCardProps {
    category: string;
    name: string;
    image: string;
    passengers: number;
    luggage: number;
    ac: boolean;
    kms: string;
    rentalPrice: string;
    discountedPrice: string;
    gst: string;
    totalPrice: string;
    specialPrice: string;
    extraKm: string;
    extraHour: string;
    nightDeliveryCharge: number;
}

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
                        alt={name}
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex-1 bg-gradient-to-r from-[#257ce0] to-[#60b2ff] hover:from-[#1f66c0] hover:to-[#4fa8ff] text-white py-2 cursor-pointer">
                            Click for more Details
                        </Button>
                    </DialogTrigger>

                    <DialogContent
                        className="p-0 w-[92%] ml-4 md:ml-0 sm:w-[95%] max-w-full sm:max-w-lg 
             sm:rounded-xl sm:shadow-xl sm:p-6 bg-white
             h-[50vh] sm:h-auto sm:max-h-[40vh] overflow-y-auto
             fixed bottom-0 left-0 sm:top-1/2 sm:left-1/2
             sm:-translate-x-1/2 sm:-translate-y-1/2 translate-y-0"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex flex-col"
                        >
                            <DialogHeader className="p-4 sm:p-0 border-b sm:border-none">
                                <DialogTitle className="text-xl font-bold text-center text-[#257ce0]">
                                    Owner Details
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-600 text-center">
                                    Contact information of the car owner
                                </DialogDescription>
                            </DialogHeader>

                            {/* Scrollable content */}
                            <div className="flex-1 p-4 sm:p-0 space-y-4">
                                <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <p className="text-gray-800"><span className="font-semibold">Name:</span> Manoj Kumar Sahoo</p>
                                    <p className="text-gray-800"><span className="font-semibold">Mob No:</span> +91 77898 10517</p>
                                    <p className="text-gray-800"><span className="font-semibold">Business Email:</span> service@banajatravels.com</p>
                                    <p className="text-gray-800"><span className="font-semibold">Personal Email:</span> manojkumar5122001@gmail.com</p>
                                    <p className="text-gray-800"><span className="font-semibold">Address:</span> Bhubaneswar, Odisha</p>
                                </div>
                            </div>
                        </motion.div>
                    </DialogContent>

                </Dialog>
            </div>
        </Card>
    );
};

export default CarCard;
