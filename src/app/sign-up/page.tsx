"use client";

import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import signMob from "../../../public/images/signup-mob.png";
import signupDesk from "../../../public/images/signup-desk.png";
import { toast } from "sonner";
import Loader from "../../components/Loader"

// ✅ Validation Schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }).max(40),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(18),
  phoneNumber: z.string().regex(/^\+91\d{10}$/, {
    message: "Phone number must be a valid 10-digit Indian number starting with +91.",
  }),
});

// ✅ Infer Type
type SignUpFormValues = z.infer<typeof formSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "+91",
    },
  });

  // Connect with Backend
  const onSubmit = async (values: SignUpFormValues) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          name: values.name,
          email: values.email,
          password: values.password,
          mobile: values.phoneNumber.replace("+91", ""),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Account created successfully!");
        setTimeout(() => router.push("/sign-in"), 1500);
      } else {
        toast.error(`${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (


    <>
      {loading && <Loader />}

      <motion.div
        className="relative min-h-screen flex items-center justify-center mt-2 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Backgrounds */}
        <Image
          src={signMob}
          alt="Signup Background Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 z-0 md:hidden"
        />
        <Image
          src={signupDesk}
          alt="Signup Background Desktop"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 z-0 hidden md:block"
        />
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Form */}
        <motion.div
          className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-[#257ce0]">
            Create Your Account
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+911234567890"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\s+/g, "");
                          if (!value.startsWith("+91")) {
                            value = "+91" + value.replace(/^\+?91/, "");
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                className="w-full bg-[#257ce0] hover:bg-[#60b2ff] text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          {/* Redirect */}
          <p className="mt-6 text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-cyan-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SignUpPage;
