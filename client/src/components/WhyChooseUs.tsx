'use client';

import { Phone, Tag, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
};

const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Heading */}
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Why Choose Us
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        We go beyond just car rentals — delivering comfort, safety, and unbeatable value to make every ride special.
                    </p>
                </motion.div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

                    {/* Car Image */}
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <Image
                            src="/images/WhyChooseUs.png"
                            alt="Luxury Car"
                            width={600}
                            height={350}
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        className="space-y-6"
                        initial="hidden"
                        whileInView="visible"
                        variants={staggerContainer}
                        viewport={{ once: true }}
                    >
                        {[
                            { icon: <Phone className="w-8 h-8 text-blue-600" />, title: "Customer Support", desc: "We provide 24/7 support for all your booking needs." },
                            { icon: <Tag className="w-8 h-8 text-blue-600" />, title: "Best Price Guaranteed", desc: "Enjoy competitive rates with no hidden fees." },
                            { icon: <MapPin className="w-8 h-8 text-blue-600" />, title: "Many Locations", desc: "Access our wide range of pick-up and drop-off points." },
                            { icon: <Users className="w-8 h-8 text-blue-600" />, title: "Experienced Drivers", desc: "Travel with our professional and skilled drivers." },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start space-x-4"
                                variants={fadeUp}
                            >
                                {feature.icon}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
