"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, MapPin, ChevronDown, Search } from "lucide-react";
import { format, addMinutes, startOfDay, isBefore, isToday } from "date-fns";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { toast } from "sonner";

// Cities
const cities = [
    "Bhubaneswar, Odisha", "Puri, Odisha", "Konark, Odisha", "Cuttack, Odisha", "Rourkela, Odisha",
    "Sambalpur, Odisha", "Berhampur, Odisha", "Balasore, Odisha", "Jharsuguda, Odisha",
    "Sundargarh, Odisha", "Bhadrak, Odisha", "Baripada, Odisha", "Angul, Odisha",
    "Dhenkanal, Odisha", "Koraput, Odisha", "Keonjhar, Odisha", "Paradip, Odisha",
    "Jajpur, Odisha", "Titlagarh, Odisha", "Phulbani, Odisha", "Rayagada, Odisha",
    "Jagatsinghpur, Odisha", "Nayagarh, Odisha", "Kendrapara, Odisha", "Malkangiri, Odisha"
];

// Durations
const durations = [
    { label: "8 Hours 80 Kms", value: "8h_80kms" },
    { label: "12 Hours 120 Kms", value: "12h_120kms" },
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

    const handleSearch = () => {
        if (!pickupCity) {
            toast.error("Please select a pickup city.");
            return;
        }
        if (!duration) {
            toast.error("Please add duration.");
            return;
        }
        if (!pickupDate) {
            toast.error("Please select pickup date.");
            return;
        }


        toast.success("Searching cabs... 🚖");

        const formData = {
            pickupCity,
            duration,
            pickupDate: pickupDate ? format(pickupDate, "dd-MM-yyyy") : null,
            pickupTime,
        };
        console.log("Selected Data:", formData);
    };

    // Generate times dynamically based on selected date
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
        <div className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

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
                            onClick={() => setIsDurationOpen((prev) => !prev)} // ✅ toggle open/close
                        >
                            <span className={!duration ? "text-gray-400" : ""}>{duration || "Select"}</span>
                            <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandGroup>
                                <CommandItem
                                    key="select"
                                    onSelect={() => {
                                        setDuration("");
                                        setIsDurationOpen(false);
                                    }}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    Select
                                </CommandItem>
                                {durations.map((d) => (
                                    <CommandItem
                                        key={d.value}
                                        onSelect={() => {
                                            setDuration(d.label);
                                            setIsDurationOpen(false);
                                        }}
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
                            className="w-full justify-between text-left font-normal rounded-lg border-gray-300 cursor-pointer flex items-center"
                            onClick={() => setIsDateOpen((prev) => !prev)} // ✅ toggle open/close
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
                            onSelect={(date) => {
                                setPickupDate(date ?? null);
                                setIsDateOpen(false); // ✅ close after selecting
                            }}
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
                            onClick={() => setIsTimeOpen((prev) => !prev)} // ✅ toggle open/close
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
                                {times.map((time) => (
                                    <CommandItem
                                        key={time}
                                        onSelect={() => {
                                            setPickupTime(time);
                                            setIsTimeOpen(false); // ✅ close after selecting
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
            <div className="col-span-1 md:col-span-4 flex justify-end mt-4">
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

export default LocalTrip;
