"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, MapPin, ChevronDown, Search } from "lucide-react";
import { format, addMinutes, startOfDay, isBefore, isToday } from "date-fns";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { toast } from "sonner";
import ShareContactCard from "../ShareContactDetails";

// Cities & Durations
const cities = [
    "Bhubaneswar, Odisha", "Puri, Odisha", "Konark, Odisha", "Cuttack, Odisha", "Rourkela, Odisha",
    "Sambalpur, Odisha", "Berhampur, Odisha", "Balasore, Odisha", "Jharsuguda, Odisha",
    "Sundargarh, Odisha", "Bhadrak, Odisha", "Baripada, Odisha", "Angul, Odisha",
    "Dhenkanal, Odisha", "Koraput, Odisha", "Keonjhar, Odisha", "Paradip, Odisha",
    "Jajpur, Odisha", "Titlagarh, Odisha", "Phulbani, Odisha", "Rayagada, Odisha",
    "Jagatsinghpur, Odisha", "Nayagarh, Odisha", "Kendrapara, Odisha", "Malkangiri, Odisha"
];
const durations = [
    { label: "8 Hours / 80 Kms", value: "8h_80kms" },
    { label: "12 Hours / 120 Kms", value: "12h_120kms" },
];

interface LocalTripFormProps {
    pickupDate: Date | null;
    setPickupDate: (date: Date | null) => void;
    pickupTime: string;
    setPickupTime: (time: string) => void;
}

const LocalTrip: React.FC<LocalTripFormProps> = ({
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
}) => {
    const [pickupCity, setPickupCity] = useState("");
    const [duration, setDuration] = useState("");
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [isDurationOpen, setIsDurationOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [showContactCard, setShowContactCard] = useState(false);

    const handleSearch = () => {
        if (!pickupCity) return toast.error("Please select a pickup city.");
        if (!duration) return toast.error("Please select a duration.");
        if (!pickupDate) return toast.error("Please select a pickup date.");

        // Show contact details form
        setShowContactCard(true);
    };

    // Generate pickup times
    const times = useMemo(() => {
        const t: string[] = [];
        const now = new Date();
        let current = pickupDate && isToday(pickupDate) ? now : startOfDay(pickupDate || now);
        const end = addMinutes(startOfDay(pickupDate || now), 24 * 60);
        while (isBefore(current, end)) {
            t.push(format(current, "hh:mm aa"));
            current = addMinutes(current, 15);
        }
        return t;
    }, [pickupDate]);

    return (
        <div className="space-y-6 px-4 md:px-8">

            {!showContactCard ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Pickup City */}
                    <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                            <MapPin className="w-4 h-4" /> Pick Up City/Town
                        </label>
                        <Popover open={isCityOpen} onOpenChange={setIsCityOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer"
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
                                            onClick={() => pickupCity.trim() && setIsCityOpen(false)}
                                        >
                                            Tap to add &quot;{pickupCity}&quot;
                                        </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {cities.filter(city => city.toLowerCase().includes(pickupCity.toLowerCase()))
                                            .map(city => (
                                                <CommandItem
                                                    key={city}
                                                    onSelect={() => { setPickupCity(city); setIsCityOpen(false); }}
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

                    {/* Duration */}
                    <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                            <Clock className="w-4 h-4" /> Duration
                        </label>
                        <Popover open={isDurationOpen} onOpenChange={setIsDurationOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer"
                                >
                                    <span className={!duration ? "text-gray-400" : ""}>{duration || "Select"}</span>
                                    <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandGroup>
                                        {durations.map(d => (
                                            <CommandItem
                                                key={d.value}
                                                onSelect={() => { setDuration(d.label); setIsDurationOpen(false); }}
                                                className="cursor-pointer hover:bg-gray-100"
                                            >
                                                {d.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Pickup Date */}
                    <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                            <CalendarDays className="w-4 h-4" /> Pickup Date
                        </label>
                        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer"
                                >
                                    <span className={!pickupDate ? "text-gray-400" : ""}>
                                        {pickupDate ? format(pickupDate, "dd-MM-yyyy") : "Select date"}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={pickupDate || undefined}
                                    onSelect={(date) => { setPickupDate(date ?? null); setIsDateOpen(false); }}
                                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
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
                        <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between text-left font-normal cursor-pointer rounded-lg border-gray-300"
                                >
                                    <span className={!pickupTime ? "text-gray-400" : ""}>{pickupTime || "Select time"}</span>
                                    <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full max-h-60 overflow-y-auto p-0">
                                <Command>
                                    <CommandInput placeholder="Search time..." className="border-b" />
                                    <CommandEmpty>No time found.</CommandEmpty>
                                    <CommandGroup>
                                        {times.map(time => (
                                            <CommandItem
                                                key={time}
                                                onSelect={() => { setPickupTime(time); setIsTimeOpen(false); }}
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
                    <div className="col-span-1 md:col-span-4 flex justify-center md:justify-end mt-2">
                        <Button
                            className="flex items-center gap-2 bg-gradient-to-r from-[#257ce0] to-[#60b2ff] text-white font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer w-full md:w-auto justify-center
               transition-transform duration-300 ease-in-out hover:scale-105 hover:from-[#1f66c0] hover:to-[#4fa8ff]"
                            onClick={handleSearch}
                        >
                            <Search className="w-5 h-5" />
                            Get Instant Quote
                        </Button>
                    </div>

                </div>
            ) : (
                // ✅ Show Share Contact Details card
                <div className="w-full mx-auto">
                    <ShareContactCard
                        pickupCity={pickupCity}
                        duration={duration}
                        pickupDate={pickupDate}
                        pickupTime={pickupTime}
                        onEdit={() => setShowContactCard(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default LocalTrip;
