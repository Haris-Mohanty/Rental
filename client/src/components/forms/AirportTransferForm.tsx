"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addMinutes, format, isBefore, startOfDay } from "date-fns";
import { CalendarDays, ChevronDown, Clock, MapPin, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // ✅ import toast

interface AirportTransferFormProps {
    airportType: "pickup" | "dropoff";
    setAirportType: (type: "pickup" | "dropoff") => void;
    pickupDate: Date | null;
    setPickupDate: (date: Date | null) => void;
    pickupTime: string;
    setPickupTime: (time: string) => void;
}

const AirportTransferForm: React.FC<AirportTransferFormProps> = ({
    airportType,
    setAirportType,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
}) => {
    const [city, setCity] = useState("Bhubaneswar, Odisha");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [isPickupDateOpen, setIsPickupDateOpen] = useState(false);
    const [isPickupTimeOpen, setIsPickupTimeOpen] = useState(false);

    // handle search
    const handleSearch = () => {
        if (!pickupDate) {
            toast.error("Please select a pickup date."); // ✅ toast instead of alert
            return;
        }
        if (!pickupTime) {
            toast.error("Please select a pickup time."); // ✅ toast instead of alert
            return;
        }

        const data = {
            airportType,
            city,
            pickupLocation:
                airportType === "pickup"
                    ? "Biju Patnaik International Airport, Airport Road, Bhubaneswar, Odisha, India"
                    : pickupLocation,
            dropoffLocation:
                airportType === "dropoff"
                    ? "Biju Patnaik International Airport, Airport Road, Bhubaneswar, Odisha, India"
                    : dropoffLocation,
            pickupDate: format(pickupDate, "dd-MM-yyyy"),
            pickupTime,
        };

        console.log("Searching cabs with data:", data);
        toast.success("Searching cabs..."); // ✅ success toast
    };

    // Generate 15-min interval times
    const times = useMemo(() => {
        const t: string[] = [];
        let current = startOfDay(new Date());
        const end = addMinutes(current, 24 * 60);
        while (isBefore(current, end)) {
            t.push(format(current, "hh:mm aa"));
            current = addMinutes(current, 15);
        }
        return t;
    }, []);

    return (
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Transfer Type */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex gap-2 mb-2">
                <Button
                    onClick={() => {
                        setAirportType("pickup");
                        setDropoffLocation("");
                    }}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium cursor-pointer",
                        airportType === "pickup"
                            ? "bg-[#152B57] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    )}
                >
                    Pick Up
                </Button>
                <Button
                    onClick={() => {
                        setAirportType("dropoff");
                        setPickupLocation("");
                    }}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium cursor-pointer",
                        airportType === "dropoff"
                            ? "bg-[#0b73d4] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    )}
                >
                    Drop Off
                </Button>
            </div>

            {/* City */}
            <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" /> City/Town
                </label>
                <Input
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>

            {/* Pickup Location */}
            <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" /> Pickup Location
                </label>
                <Input
                    value={
                        airportType === "pickup"
                            ? "Biju Patnaik International Airport, Airport Road, Bhubaneswar, Odisha, India"
                            : pickupLocation
                    }
                    onChange={(e) => setPickupLocation(e.target.value)}
                    readOnly={airportType === "pickup"}
                    className={airportType === "pickup" ? "bg-gray-100" : ""}
                />
            </div>

            {/* Drop Off Location */}
            <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" /> Drop Off Location
                </label>
                <Input
                    value={
                        airportType === "dropoff"
                            ? "Biju Patnaik International Airport, Airport Road, Bhubaneswar, Odisha, India"
                            : dropoffLocation
                    }
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    readOnly={airportType === "dropoff"}
                    className={airportType === "dropoff" ? "bg-gray-100" : ""}
                />
            </div>

            {/* Pickup Date + Time + Search in one row */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pickup Date */}
                <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                        <CalendarDays className="w-4 h-4" /> Pickup Date
                    </label>
                    <Popover open={isPickupDateOpen} onOpenChange={setIsPickupDateOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full h-10 justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer"
                            >
                                <span>
                                    {pickupDate ? format(pickupDate, "dd-MM-yyyy") : "Select date"}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={pickupDate || undefined}
                                onSelect={(date) => {
                                    setPickupDate(date ?? null);
                                    setIsPickupDateOpen(false);
                                }}
                                disabled={(date) => date < startOfDay(new Date())}
                                className="cursor-pointer"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Pickup Time */}
                <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                        <Clock className="w-4 h-4" /> Pickup Time
                    </label>
                    <Popover open={isPickupTimeOpen} onOpenChange={setIsPickupTimeOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between text-left font-normal cursor-pointer rounded-lg border-gray-300">
                                {pickupTime || "Select time"}
                                <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full max-h-60 overflow-y-auto p-0">
                            <Command>
                                <CommandInput placeholder="Search time..." className="border-b" />
                                <CommandEmpty>No time found.</CommandEmpty>
                                <CommandGroup>
                                    {times.map((time) => (
                                        <CommandItem
                                            key={time}
                                            onSelect={() => {
                                                setPickupTime(time);
                                                setIsPickupTimeOpen(false);
                                            }}
                                            className="cursor-pointer hover:bg-gray-100"
                                        >
                                            {time}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                    <Button
                        onClick={handleSearch}
                        className="w-full h-10 flex items-center justify-center gap-2 bg-[#257ce0] hover:bg-[#60b2ff] text-white font-semibold rounded-lg shadow-lg"
                    >
                        <Search className="w-5 h-5" />
                        Search Cabs
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AirportTransferForm;
