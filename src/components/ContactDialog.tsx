"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

type ContactDialogProps = {
    category: string;
    name: string;
    passengers: number;
    luggage: number;
    ac: boolean;
    specialPrice: string | number;
};

const ContactDialog: React.FC<ContactDialogProps> = ({
    category,
    name,
    passengers,
    luggage,
    ac,
    specialPrice,
}) => {
    // Fixed owner info
    const ownerName = "Manoj Kumar Sahoo";
    const phoneNumber = "+919937376969";
    const businessEmail = "service@banajatravels.com";
    const personalEmail = "manojkumar5122001@gmail.com";
    const address = "Bhubaneswar, Odisha";

    const whatsappMessage = encodeURIComponent(
        `Hello, I am interested in booking this car.\n\nCar Details:\n- Category: ${category}\n- Name: ${name}\n- Passengers: ${passengers}\n- Luggage: ${luggage}\n- AC: ${ac ? "Yes" : "No"}\n- Special Price: ${specialPrice}\n\nPlease share availability and further booking details.`
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex-1 bg-gradient-to-r from-[#257ce0] to-[#60b2ff] hover:from-[#1f66c0] hover:to-[#4fa8ff] text-white py-2 cursor-pointer">
                    More Details
                </Button>
            </DialogTrigger>

            <DialogContent
                className="max-w-md"
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-3"
                >
                    <DialogHeader className="p-0">
                        <DialogTitle className="text-xl font-bold text-center text-[#257ce0]">
                            Owner Details
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600 text-center">
                            Contact information of the car owner
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50 text-sm space-y-2">
                        <p className="text-gray-800"><span className="font-semibold">Name:</span> {ownerName}</p>
                        <p className="text-gray-800"><span className="font-semibold">Mob No:</span> {phoneNumber}</p>
                        <p className="text-gray-800"><span className="font-semibold">Business Email:</span> {businessEmail}</p>
                        <p className="text-gray-800"><span className="font-semibold">Personal Email:</span> {personalEmail}</p>
                        <p className="text-gray-800"><span className="font-semibold">Address:</span> {address}</p>
                    </div>

                    <DialogFooter className="flex flex-row gap-3 w-full mt-2">
                        <a href={`tel:${phoneNumber}`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-[#257ce0] to-[#60b2ff] hover:from-[#1f66c0] hover:to-[#4fa8ff] text-white flex items-center justify-center gap-2 rounded-lg">
                                <Phone className="w-4 h-4" /> Call
                            </Button>
                        </a>
                        <a
                            href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button className="w-full bg-gradient-to-r from-[#25D366] to-[#1ebe5d] hover:from-[#1ebe5d] hover:to-[#25D366] text-white flex items-center justify-center gap-2 rounded-lg">
                                <MessageCircle className="w-4 h-4" /> Whatsapp
                            </Button>
                        </a>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default ContactDialog;
