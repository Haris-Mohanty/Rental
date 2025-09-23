// src/components/forms/OneWayForm.tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, MapPin, ChevronDown, Search } from "lucide-react";
import { format, addMinutes, startOfDay, isBefore } from "date-fns";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

interface OneWayFormProps {
    pickupDate: Date | null;
    setPickupDate: (date: Date | null) => void;
    pickupTime: string;
    setPickupTime: (time: string) => void;
}


const cities = [
    "Bhubaneswar, Odisha", "Puri, Odisha", "Konark, Odisha", "Cuttack, Odisha", "Rourkela, Odisha",
    "Sambalpur, Odisha", "Berhampur, Odisha", "Balasore, Odisha", "Jharsuguda, Odisha",
    "Sundargarh, Odisha", "Bhadrak, Odisha", "Baripada, Odisha", "Angul, Odisha",
    "Dhenkanal, Odisha", "Koraput, Odisha", "Keonjhar, Odisha", "Paradip, Odisha",
    "Jajpur, Odisha", "Titlagarh, Odisha", "Phulbani, Odisha", "Rayagada, Odisha",
    "Jagatsinghpur, Odisha", "Nayagarh, Odisha", "Kendrapara, Odisha", "Malkangiri, Odisha"
];

const OneWayForm: React.FC<OneWayFormProps> = ({
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
}) => {

    const handleSearch = () => {
        const formData = {
            pickupCity,
            pickupLocation,
            dropoffLocation,
            pickupDate: pickupDate ? format(pickupDate, "dd-MM-yyyy") : null,
            pickupTime,
        };
        console.log("Selected Data:", formData);

    };


    const [pickupCity, setPickupCity] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

    const [isCityOpen, setIsCityOpen] = useState(false);

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
        <div className="px-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Pickup City Dropdown */}
            <div className="col-span-1 md:col-span-1">
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

            {/* Pickup Location */}
            <div className="col-span-1 md:col-span-1">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" /> Pickup Location
                </label>
                <Input
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                />
            </div>

            {/* Drop Off Location */}
            <div className="col-span-1 md:col-span-1">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" /> Drop Off Location
                </label>
                <Input
                    placeholder="Enter drop off location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                />
            </div>

            {/* Pickup Date */}
            <div className="col-span-1 md:col-span-1">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <CalendarDays className="w-4 h-4" /> Pickup Date
                </label>
                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
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
                                setIsDatePopoverOpen(false); // close popover after selecting
                            }}
                            disabled={(date) => date < startOfDay(new Date())} // disable past dates
                            className="cursor-pointer" // cursor pointer for all calendar days
                        />
                    </PopoverContent>
                </Popover>
            </div>


            {/* Pickup Time */}
            <div className="col-span-1 md:col-span-1">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                    <Clock className="w-4 h-4" /> Pickup Time
                </label>
                <Popover open={isTimePopoverOpen} onOpenChange={setIsTimePopoverOpen}>
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
                                            setIsTimePopoverOpen(false);
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
            <div className="col-span-1 md:col-span-5 flex justify-end mt-4">
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

export default OneWayForm;