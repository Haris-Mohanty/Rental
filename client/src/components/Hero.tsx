"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import heroCar from "../../public/images/hero.png";
import SearchForm from "./SearchForm";

const Hero = () => {
    return (
        <div className="relative">
            {/* Hero Background with Car Image */}
            <div className="relative h-[70vh] sm:h-[80vh] w-full">
                <Image
                    src={heroCar}
                    alt="Car Hero"
                    fill
                    priority
                    className="object-cover object-center"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center md:ml-12">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-xl"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Search, Book & <br />
                            <span className="text-blue-400">Rent A Car Easily</span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                            className="text-base sm:text-lg text-white/90 leading-relaxed mb-8"
                        >
                            Take your best car rental service with all new facilities and a
                            very easy way. We provide the best services in the town.
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            {/* Search Form - Overlapping Hero */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="relative z-20 container mx-auto px-4
                   -mt-36 sm:-mt-24 md:-mt-32 lg:-mt-36"
            >
                <SearchForm />
            </motion.div>
        </div>
    );
};

export default Hero;
