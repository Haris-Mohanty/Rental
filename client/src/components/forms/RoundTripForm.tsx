// src/components/forms/RoundTripForm.tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, MapPin, ChevronDown, Search } from "lucide-react";
import { format, addMinutes, startOfDay, isBefore } from "date-fns";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

interface RoundTripForm {
    pickupDate: Date | null;
    setPickupDate: (date: Date | null) => void;
    pickupTime: string;
    setPickupTime: (time: string) => void;
    dropOffDate: Date | null;
    setDropOffDate: (date: Date | null) => void;
    dropOffTime: string;
    setDropOffTime: (time: string) => void;
}


const cities = [
    "Bhubaneswar, Odisha", "Puri, Odisha", "Konark, Odisha", "Cuttack, Odisha", "Rourkela, Odisha",
    "Sambalpur, Odisha", "Berhampur, Odisha", "Balasore, Odisha", "Jharsuguda, Odisha",
    "Sundargarh, Odisha", "Bhadrak, Odisha", "Baripada, Odisha", "Angul, Odisha",
    "Dhenkanal, Odisha", "Koraput, Odisha", "Keonjhar, Odisha", "Paradip, Odisha",
    "Jajpur, Odisha", "Titlagarh, Odisha", "Phulbani, Odisha", "Rayagada, Odisha",
    "Jagatsinghpur, Odisha", "Nayagarh, Odisha", "Kendrapara, Odisha", "Malkangiri, Odisha"
];

const RoundTripForm: React.FC<RoundTripForm> = ({
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    dropOffDate,
    setDropOffDate,
    dropOffTime,
    setDropOffTime,
}) => {




    const [pickupCity, setPickupCity] = useState("");
    const [destination, setDestination] = useState("");
    const [isPickupDateOpen, setIsPickupDateOpen] = useState(false);
    const [isDropOffDateOpen, setIsDropOffDateOpen] = useState(false);
    const [isPickupTimeOpen, setIsPickupTimeOpen] = useState(false);
    const [isDropOffTimeOpen, setIsDropOffTimeOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);

    // Handle Search Button Click
    const handleSearch = () => {
        const formData = {
            pickupCity,
            destination,
            pickupDate: pickupDate ? format(pickupDate, "dd-MM-yyyy") : null,
            pickupTime,
            dropOffDate: dropOffDate ? format(dropOffDate, "dd-MM-yyyy") : null,
            dropOffTime,
        };
        console.log("Selected Data:", formData);

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
        <div className="px-6 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Pickup City Dropdown */}
            <div className="col-span-1 md:col-span-2">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" /> Pick Up City/Town
                </label>
                <Popover open={isCityOpen} onOpenChange={setIsCityOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer"
                                            onClick={() => setIsCityOpen((prev) => !prev)}
                                        >
                                            <span className={!pickupCity ? "text-gray-400" : ""}>
                                                {pickupCity || "Select or type city"}
                                            </span>
                                            <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search or type city..."
                                                className="border-b"
                                                value={pickupCity}
                                                onValueChange={(val) => setPickupCity(val)}
                                            />
                                            <CommandEmpty>
                                                <div
                                                    className="cursor-pointer px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
                                                    onClick={() => {
                                                        if (pickupCity.trim()) {
                                                            setPickupCity(pickupCity);
                                                            setIsCityOpen(false);
                                                        }
                                                    }}
                                                >
                                                    Tap to add &quot;{pickupCity}&quot;
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {cities
                                                    .filter((city) =>
                                                        city.toLowerCase().includes(pickupCity.toLowerCase())
                                                    )
                                                    .map((city) => (
                                                        <CommandItem
                                                            key={city}
                                                            onSelect={() => {
                                                                setPickupCity(city);
                                                                setIsCityOpen(false);
                                                            }}
                                                            className="cursor-pointer hover:bg-gray-100"
                                                        >
                                                            {city}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
            </div>

            {/* Destination */}
            <div className="col-span-1 md:col-span-2">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" /> Destination
                </label>
                <Input
                    placeholder="Enter the destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
            </div>

            {/* Pickup Date */}
            <div className="col-span-1 md:col-span-2">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <CalendarDays className="w-4 h-4" /> Pickup Date
                </label>
                <Popover open={isPickupDateOpen} onOpenChange={setIsPickupDateOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer flex items-center"
                        >
                            <span>{pickupDate ? format(pickupDate, "dd-MM-yyyy") : "Select date"}</span>
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
            <div className="col-span-1 md:col-span-2">
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

            {/* Drop-off Date */}
            <div className="col-span-1 md:col-span-2">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <CalendarDays className="w-4 h-4" /> Drop-off Date
                </label>
                <Popover open={isDropOffDateOpen} onOpenChange={setIsDropOffDateOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer flex items-center"
                        >
                            <span>{dropOffDate ? format(dropOffDate, "dd-MM-yyyy") : "Select date"}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dropOffDate || undefined}
                            onSelect={(date) => {
                                setDropOffDate(date ?? null);
                                setIsDropOffDateOpen(false);
                            }}
                            disabled={(date) => date < startOfDay(new Date())}
                            className="cursor-pointer"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Drop-off Time */}
            <div className="col-span-1 md:col-span-2">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <Clock className="w-4 h-4" /> Drop-off Time
                </label>
                <Popover open={isDropOffTimeOpen} onOpenChange={setIsDropOffTimeOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between text-left font-normal cursor-pointer rounded-lg border-gray-300">
                            {dropOffTime || "Select time"}
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
                                            setDropOffTime(time);
                                            setIsDropOffTimeOpen(false);
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
            <div className="col-span-1 md:col-span-12 flex justify-end mt-4">
                <Button
                    className="flex items-center gap-2 bg-[#257ce0] hover:bg-[#60b2ff] text-white font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer"
                    onClick={handleSearch}
                >
                    <Search className="w-5 h-5" />
                    Search Cabs
                </Button>
            </div>
        </div>

    );
};

export default RoundTripForm;