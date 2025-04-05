"use client";

import IdoAuth from "@/api/IdoAuth";
import { registerSchemaBase } from "@/lib/zod/auth";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";

type FormType = z.infer<typeof registerSchemaBase>;

export default function RegisterPage() {
  const [form, setForm] = useState<FormType>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<Partial<Record<keyof FormType | "other", string>>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const timers = useRef<Record<keyof FormType, NodeJS.Timeout | null>>({
    firstName: null,
    lastName: null,
    email: null,
    username: null,
    password: null,
    confirmPassword: null,
  });

  const validateField = (name: keyof FormType, value: string) => {
    const tempForm = { ...form, [name]: value };
    const result = registerSchemaBase.safeParse(tempForm);

    console.log(result);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === name);
      setError((prev) => ({ ...prev, [name]: fieldError?.message || "" }));
    } else {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof FormType; value: string };

    setForm((prev) => ({ ...prev, [name]: value }));

    if (timers.current[name]) {
      clearTimeout(timers.current[name]!);
    }

    timers.current[name] = setTimeout(() => {
      validateField(name, value);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchemaBase.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormType, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormType;
        fieldErrors[field] = err.message;
      });
      setError({ ...fieldErrors });
      return;
    }

    setLoading(true);
    setError({});
    try {
      const res = await IdoAuth.register(result.data);

      if (res.status === 201) {
        setSuccess(`${res.data.message || "Register successful! Verification mail's sent"} Redirecting...`);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError({ other: "Signup failed. Please try again." });
      }
    } catch (err) {
      setError({
        other:
          err instanceof AxiosError
            ? err.response?.data.message
            : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        {error.other && <p className="text-red-500 mb-2">{error.other}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <div className="flex items-start gap-x-2">
          <div className="w-full">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="border p-2 w-full mb-1"
              value={form.firstName}
              onChange={handleChange}
            />
            {error.firstName && <p className="text-red-500 text-sm">{error.firstName}</p>}
          </div>
          <div className="w-full">
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="border p-2 w-full mb-1"
              value={form.lastName}
              onChange={handleChange}
            />
            {error.lastName && <p className="text-red-500 text-sm">{error.lastName}</p>}
          </div>
        </div>

        <div className="mb-1">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-1"
            value={form.email}
            onChange={handleChange}
          />
          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        </div>

        <div className="mb-1">
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="border p-2 w-full mb-1"
            value={form.username}
            onChange={handleChange}
          />
          {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
        </div>

        <div className="flex items-start gap-x-2">
          <div className="relative w-full">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-2 w-full mb-1 pr-10"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="absolute top-3 right-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
          </div>

          <div className="relative w-full">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="border p-2 w-full mb-1 pr-10"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="absolute top-3 right-3 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
          </div>
        </div>

        <button
          className="bg-gray-500 text-white p-2 rounded-md mt-4 w-full flex items-center justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : null}
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="flex mt-4">
          Already have an account?
          <Link href="/" className="text-blue-500 hover:underline ml-1">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
