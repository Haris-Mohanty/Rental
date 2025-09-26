"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";
import Loader from "./Loader";
import CarsList from "./CarsList";

const contactSchema = z.object({
    mobile: z
        .string()
        .nonempty("Mobile number is required")
        .regex(/^\+?[0-9]{6,15}$/, "Invalid mobile number"),
    email: z
        .union([z.string().email("Enter a valid email address"), z.literal("")])
        .optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ShareContactCardProps {
    pickupCity: string;
    duration: string;
    pickupDate: Date | null;
    pickupTime: string;
    onEdit: () => void;
}

const ShareContactCard: React.FC<ShareContactCardProps> = ({
    pickupCity,
    duration,
    pickupDate,
    pickupTime,
    onEdit,
}) => {
    const [loading, setLoading] = useState(false);
    const [showCars, setShowCars] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            mobile: "",
            email: "",
        },
    });

    const onSubmit = async (values: ContactFormValues) => {
        setLoading(true);
        try {
            const formData = {
                ...values,
                email: values.email ?? "",
                pickupCity,
                duration,
                pickupDate: pickupDate ? pickupDate.toDateString() : "",
                pickupTime,
            };

            const res = await fetch("/api/send-trip-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                reset();
                setShowCars(true);
            } else {
                toast.error("Failed to fetch. Try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={
                !showCars
                    ? "max-w-lg mx-auto px-2 md:px-0"
                    : "w-full"
            }
        >
            {!showCars ? (
                <Card className="shadow-xl rounded-2xl border border-gray-100">
                    <CardHeader className="text-center bg-gradient-to-r from-[#257ce0] to-[#60b2ff] text-white rounded-t-2xl p-6">
                        <CardTitle className="text-lg md:text-2xl font-bold">
                            Get Your Instant Quote
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base mt-2 text-gray-900">
                            Enter your contact details below and we’ll send you an instant
                            quotation, confirmation, and updates.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-2 md:p-6">
                        {/* Display trip info */}
                        <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-lg shadow-sm text-gray-800">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-900">Trip Details</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onEdit}
                                    className="flex items-center gap-1 text-[#257ce0] border-[#257ce0] hover:bg-[#257ce0] hover:text-white cursor-pointer"
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <p>
                                    <strong>Pickup City:</strong> {pickupCity}
                                </p>
                                <p>
                                    <strong>Duration:</strong> {duration}
                                </p>
                                <p>
                                    <strong>Pickup Date:</strong>{" "}
                                    {pickupDate ? pickupDate.toDateString() : "-"}
                                </p>
                                <p>
                                    <strong>Pickup Time:</strong> {pickupTime || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <form onSubmit={handleSubmit(onSubmit, (err) => {
                            if (err.mobile) {
                                toast.error(err.mobile.message as string);
                            } else if (err.email) {
                                toast.error(err.email.message as string);
                            }
                        })}
                            className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Contact Number *
                                </label>
                                <Input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    {...register("mobile")}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    {...register("email")}
                                    className="w-full"
                                />
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <Loader />
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#257ce0] to-[#60b2ff] hover:from-[#1f66c0] hover:to-[#4fa8ff] text-white font-semibold rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
                                >
                                    Get Details
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <CarsList />
            )}
        </div>

    );



};

export default ShareContactCard;
