"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Loader from "./Loader";

const phoneRegex = /^\+?[0-9]{6,15}$/;

// Zod schema
const callbackSchema = z.object({
    phone: z
        .string()
        .min(6, "Enter a valid phone number")
        .regex(phoneRegex, "Invalid phone number format"),
    country: z.string().min(1, "Select a country"),
    countryCode: z.string().optional(),
    dialCode: z.string().optional(),
    location: z.object({
        coords: z.string(),
        address: z.string(),
    }).optional(),
    timestamp: z.string().optional(),
});

// Infer form values from schema
type CallbackFormValues = z.infer<typeof callbackSchema>;


// Country type
interface Country {
    name: string;
    code: string;
    dial_code: string;
    flag: string;
}

// Raw country data from API
interface RawCountry {
    name: { common: string };
    cca2: string;
    idd: {
        root?: string;
        suffixes?: string[];
    };
    flags: {
        png?: string;
        svg?: string;
    };
}

interface CallbackRequestFormProps {
    compact?: boolean;
}

// Main component
const CallbackRequestForm: React.FC<CallbackRequestFormProps> = ({ compact }) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [filtered, setFiltered] = useState<Country[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // React Hook Form setup
    const { handleSubmit, control, register, reset, setValue } =
        useForm<CallbackFormValues>({
            resolver: zodResolver(callbackSchema),
            defaultValues: { phone: "", country: "India" },
        });

    // Fetch countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true); // start loading
            try {
                const res = await fetch(
                    "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags"
                );
                const data = await res.json();

                if (!Array.isArray(data)) throw new Error("Invalid country data");

                const formatted: Country[] = data.map((c: RawCountry) => ({
                    name: c.name.common,
                    code: c.cca2,
                    dial_code: c.idd?.root
                        ? c.idd.root + (c.idd?.suffixes ? c.idd.suffixes[0] : "")
                        : "",
                    flag: c.flags.svg || c.flags.png || "🌐",
                }));

                formatted.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(formatted);
                setFiltered(formatted);

                const india = formatted.find((c) => c.name === "India");
                if (india) setValue("country", india.name);
            } catch (error) {
                console.error("Error fetching countries:", error);
                toast.error("Failed to load countries");
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, [setValue]);


    // Search filter
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(countries);
        } else {
            setFiltered(
                countries.filter((c) =>
                    c.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, countries]);

    // Form submission
    const onSubmit = async (values: CallbackFormValues) => {
        if (!phoneRegex.test(values.phone)) {
            toast.error("Invalid phone number format");
            return;
        }

        setLoading(true);
        try {
            // Find selected country details
            const selected = countries.find((c) => c.name === values.country);

            // Get user location
            const location = await getUserLocation();

            // Prepare payload
            const payload = {
                ...values,
                countryCode: selected?.code || "",
                dialCode: selected?.dial_code || "",
                location,
                timestamp: new Date().toISOString(),
            };

            // Send POST request
            const res = await fetch("/api/request-callback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            // Handle response
            if (res.ok && data.success) {
                toast.success(data.message || "Callback request submitted!");
                reset({ phone: "", country: "India" });
            } else {
                toast.error(data.message || "Failed to submit callback request");
            }
        } catch (error) {
            console.error("Error submitting callback:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // Get user location with Geolocation API and fallback to localStorage
    const getUserLocation = async (): Promise<{ coords: string; address: string }> => {
        try {
            if (!navigator.geolocation) {
                return { coords: "Unknown", address: "Unknown" };
            }

            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
                        localStorage.setItem("lastCoords", coords);

                        try {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
                            );

                            if (!res.ok) throw new Error("Failed reverse geocode");

                            const data = await res.json();

                            const address = data?.display_name || "Unknown";
                            resolve({ coords, address });
                        } catch (err) {
                            resolve({ coords, address: "Unknown" });
                        }
                    },
                    (err) => {
                        const last = localStorage.getItem("lastCoords") || "Unknown";
                        resolve({ coords: last, address: "Unknown" });
                    },
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            });
        } catch (err) {
            const last = localStorage.getItem("lastCoords") || "Unknown";
            return { coords: last, address: "Unknown" };
        }
    };


    return (
        <>
            <div className="max-w-md mx-auto p-1 md:p-3 bg-white rounded-2xl shadow-xl md:space-y-2 border border-gray-100">
                <h2 className="text-xs md:text-xl font-semibold text-center text-gray-800">
                    Request a Callback
                </h2>


                {loading ? (
                    <Loader />
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={compact ? "flex items-center space-x-1 md:space-x-2" : "space-y-3 md:space-y-5"}
                    >
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => {
                                const selectedCountry = countries.find((c) => c.name === field.value);

                                return (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-20 md:w-22 flex items-center cursor-pointer border-gray-300">
                                            {selectedCountry ? (
                                                <div className="flex items-center">
                                                    <Image
                                                        src={selectedCountry.flag}
                                                        alt={selectedCountry.name}
                                                        width={20}
                                                        height={16}
                                                        className="rounded-sm object-contain"
                                                    />
                                                    <span className="text-xs md:text-sm font-medium text-gray-700">
                                                        {selectedCountry.dial_code}
                                                    </span>
                                                </div>
                                            ) : (
                                                <SelectValue placeholder="🌐" />
                                            )}
                                        </SelectTrigger>

                                        <SelectContent className="max-h-64 overflow-y-auto">
                                            <div className="md:p-1 sticky top-0 bg-white z-10 border-b">
                                                <Input
                                                    placeholder="Search country..."
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    className="h-8 text-xs md:text-sm"
                                                />
                                            </div>
                                            {filtered.map((c) => (
                                                <SelectItem key={c.code} value={c.name}>
                                                    <div className="flex items-center space-x-2">
                                                        <Image
                                                            src={c.flag}
                                                            alt={c.name}
                                                            width={20}
                                                            height={16}
                                                            className="rounded-sm object-contain"
                                                        />
                                                        <span>{c.name}</span>
                                                        <span className="text-gray-500 text-sm">
                                                            {c.dial_code}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                );
                            }}
                        />

                        <Input
                            type="tel"
                            placeholder="Phone Number"
                            {...register("phone")}
                            className="md:flex-1 border-gray-300 text-xs md:text-sm"
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer bg-[#257ce0] hover:bg-[#60b2ff] text-white font-semibold px-2 md:px-6 md:py-2 rounded-lg shadow"
                        >
                            {loading ? "..." : "Submit"}
                        </Button>
                    </form>
                )}


            </div>
        </>
    );
};

export default CallbackRequestForm;
