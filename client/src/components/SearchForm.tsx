"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CarFront, Repeat, Plane, MapPinned, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OneWayForm from "./forms/OneWayForm";
import RoundTripForm from "./forms/RoundTripForm";
import AirportTransferForm from "./forms/AirportTransferForm";
import MultiWayForm from "./forms/MultiWayForm";
import LocalTrip from "./forms/LocalTrip";

const tabs = [
    { key: "local", label: "LOCAL TRIP", icon: <Home className="w-4 h-4" /> },
    { key: "oneway", label: "ONE-WAY", icon: <CarFront className="w-4 h-4" /> },
    { key: "roundtrip", label: "ROUND TRIP", icon: <Repeat className="w-4 h-4" /> },
    { key: "multiway", label: "MULTI WAY", icon: <MapPinned className="w-4 h-4" /> },
    { key: "airport", label: "AIRPORT TRANSFER", icon: <Plane className="w-4 h-4" /> },
];

const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" as const } },
};

// New card animation variants
const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const SearchForm = () => {
    const [activeTab, setActiveTab] = useState("local");
    const [airportType, setAirportType] = useState<"pickup" | "dropoff">("pickup");

    const [pickupDate, setPickupDate] = useState<Date | null>(null);
    const [returnDate, setReturnDate] = useState<Date | null>(null);

    const [pickupTime, setPickupTime] = useState("");
    const [returnTime, setReturnTime] = useState("");

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-6xl mx-auto"
        >
            <Card className="bg-white shadow-xl border border-gray-200 rounded-xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" as const }}
                    className="text-center md:py-2 px-4 md:px-8"
                >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-tight mb-1">
                        🚖 Book Your Perfect Ride with Ease
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        Choose from Local Trip, One-way, Round Trip, Multi-way, or Airport Transfers.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-5 border-b bg-[#152B57] rounded-t-xl">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "relative flex items-center justify-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white transition cursor-pointer w-full",
                                index === tabs.length - 1 ? "col-span-2 md:col-span-1" : "",
                                activeTab === tab.key
                                    ? "bg-[#257ce0] shadow-lg text-white"
                                    : "hover:bg-[#60b2ff] text-white"



                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Forms with smooth animation */}
                <div className="sm:p-2 md:p-4">
                    <AnimatePresence mode="wait">
                        {activeTab === "local" && (
                            <motion.div key="local" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <LocalTrip
                                    pickupDate={pickupDate}
                                    setPickupDate={setPickupDate}
                                    pickupTime={pickupTime}
                                    setPickupTime={setPickupTime}
                                />
                            </motion.div>
                        )}
                        {activeTab === "oneway" && (
                            <motion.div key="oneway" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <OneWayForm
                                    pickupDate={pickupDate}
                                    setPickupDate={setPickupDate}
                                    pickupTime={pickupTime}
                                    setPickupTime={setPickupTime}
                                />
                            </motion.div>
                        )}
                        {activeTab === "roundtrip" && (
                            <motion.div key="roundtrip" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <RoundTripForm
                                    pickupDate={pickupDate}
                                    setPickupDate={setPickupDate}
                                    dropOffDate={returnDate}
                                    setDropOffDate={setReturnDate}
                                    pickupTime={pickupTime}
                                    setPickupTime={setPickupTime}
                                    dropOffTime={returnTime}
                                    setDropOffTime={setReturnTime}
                                />
                            </motion.div>
                        )}
                        {activeTab === "multiway" && (
                            <motion.div key="multiway" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <MultiWayForm
                                    pickupDate={pickupDate}
                                    setPickupDate={setPickupDate}
                                    dropOffDate={returnDate}
                                    setDropOffDate={setReturnDate}
                                    pickupTime={pickupTime}
                                    setPickupTime={setPickupTime}
                                    dropOffTime={returnTime}
                                    setDropOffTime={setReturnTime}
                                />
                            </motion.div>
                        )}
                        {activeTab === "airport" && (
                            <motion.div key="airport" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <AirportTransferForm
                                    airportType={airportType}
                                    setAirportType={setAirportType}
                                    pickupDate={pickupDate}
                                    setPickupDate={setPickupDate}
                                    pickupTime={pickupTime}
                                    setPickupTime={setPickupTime}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.div>
    );
};

export default SearchForm;
