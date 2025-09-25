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
import Loader from "../../components/Loader";
import { useUser } from "../context/UserContext";

// ✅ Validation Schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(18),
  role: z.enum(["user", "admin"], { message: "Please select a role." }),
});

// ✅ Infer Type
type SignInFormValues = z.infer<typeof formSchema>;

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useUser();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  // ✅ Connect with Backend
  const onSubmit = async (values: SignInFormValues) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signin",
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Signed in successfully!");
        await refreshUser();
        router.push("/");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("SignIn Error:", error);
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
        {/* Background Images */}
        <Image
          src={signMob}
          alt="SignIn Background Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 z-0 md:hidden"
        />
        <Image
          src={signupDesk}
          alt="SignIn Background Desktop"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 z-0 hidden md:block"
        />
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Form Card */}
        <motion.div
          className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-[#257ce0]">
            Welcome Back!
          </h1>
          <p className="text-sm md:text-lg font-semibold text-center mb-4 md:mb-6 text-[#524f53]">
            Login to your account
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

              {/* Role Radio */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role*</FormLabel>
                    <FormControl>
                      <div className="flex gap-6">
                        <label htmlFor="user" className="flex items-center space-x-1 cursor-pointer">
                          <input
                            id="user"
                            type="radio"
                            value="user"
                            checked={field.value === "user"}
                            onChange={() => field.onChange("user")}
                          />
                          <span>User</span>
                        </label>
                        <label htmlFor="admin" className="flex items-center space-x-1 cursor-pointer">
                          <input
                            id="admin"
                            type="radio"
                            value="admin"
                            checked={field.value === "admin"}
                            onChange={() => field.onChange("admin")}
                          />
                          <span>Admin</span>
                        </label>
                      </div>
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* Redirect */}
          <p className="mt-6 text-center text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SignInPage;
