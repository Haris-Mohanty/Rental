"use client";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    CalendarDays,
    Clock,
    ChevronDown,
    MapPin,
    Plus,
    Minus,
    Search,
    Phone,
    MessageCircle,
} from "lucide-react";
import { addMinutes, format, isBefore, startOfDay } from "date-fns";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface MultiWayFormProps {
    pickupDate: Date | null;
    setPickupDate: (date: Date | null) => void;
    dropOffDate: Date | null;
    setDropOffDate: (date: Date | null) => void;
    pickupTime: string;
    setPickupTime: (time: string) => void;
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

const MultiWayForm: React.FC<MultiWayFormProps> = ({
    pickupDate,
    setPickupDate,
    dropOffDate,
    setDropOffDate,
    pickupTime,
    setPickupTime,
    dropOffTime,
    setDropOffTime,
}) => {
    const [pickupCity, setPickupCity] = useState("");
    const [destinations, setDestinations] = useState<string[]>([""]);
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);
    const [isDropOffDateOpen, setIsDropOffDateOpen] = useState(false);
    const [isDropOffTimeOpen, setIsDropOffTimeOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Generate times (15 min intervals)
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

    const addDestination = () => {
        if (destinations.length >= 3) {
            toast.error("You can only add up to 3 destinations.");
            return;
        }
        if (destinations[destinations.length - 1].trim() === "") {
            toast.error("Please fill the destination before adding another.");
            return;
        }
        setDestinations([...destinations, ""]);
    };

    const removeDestination = (index: number) =>
        setDestinations(destinations.filter((_, i) => i !== index));

    const updateDestination = (index: number, value: string) => {
        const updated = [...destinations];
        updated[index] = value;
        setDestinations(updated);
    };

    const handleSearch = () => {
        if (!pickupCity) {
            toast.error("Please select a pickup city.");
            return;
        }
        if (!pickupDate) {
            toast.error("Please select pickup date.");
            return;
        }
        if (!dropOffDate) {
            toast.error("Please select drop-off date.");
            return;
        }

        setIsDialogOpen(true);
    };

    const whatsappMessage = `Hello, I want to book a multi-way trip.

Pickup City: ${pickupCity}
Destinations: ${destinations.filter((d) => d.trim()).join(" → ")}
Pickup: ${pickupDate ? format(pickupDate, "dd-MM-yyyy") : ""} at ${pickupTime}
Drop-off: ${dropOffDate ? format(dropOffDate, "dd-MM-yyyy") : ""} at ${dropOffTime}`;

    return (
        <>
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


                {/* Drop-off Date */}
                <div className="col-span-1 md:col-span-1">
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
                <div className="col-span-1 md:col-span-1">
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

                {/* Destinations Row */}
                <div className="col-span-1 md:col-span-2 lg:col-span-6 space-y-3">
                    {destinations.map((dest, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <Input
                                placeholder="Type Destination"
                                value={dest}
                                onChange={(e) => updateDestination(index, e.target.value)}
                            />
                            {destinations.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => removeDestination(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                            )}
                            {index === destinations.length - 1 && (
                                <Button
                                    type="button"
                                    onClick={addDestination}
                                    className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Search Button */}
                <div className="col-span-1 md:col-span-2 lg:col-span-6 flex justify-end">
                    <Button
                        onClick={handleSearch}
                        className="w-full md:w-auto px-6 h-10 flex items-center gap-2 bg-[#257ce0] hover:bg-[#60b2ff] text-white font-semibold rounded-lg shadow-lg cursor-pointer"
                    >
                        <Search className="w-5 h-5" />
                        Search Cabs
                    </Button>
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Owner Details</DialogTitle>
                        <DialogDescription>
                            Contact the cab owner directly for booking confirmation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">Owner: <span className="font-semibold">Banaja Travels</span></p>
                            <p className="text-sm text-gray-600">Phone: +91 9876543210</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() =>
                                    window.open(
                                        `https://wa.me/919937376969?text=${encodeURIComponent(whatsappMessage)}`,
                                        "_blank"
                                    )
                                }
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => (window.location.href = "tel:+919876543210")}
                            >
                                <Phone className="w-4 h-4" />
                                Call
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MultiWayForm;
