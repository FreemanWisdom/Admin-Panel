"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const MOCK_LOGIN = {
  email: "admin@example.com",
  password: "admin123",
};

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: MOCK_LOGIN.email,
      password: MOCK_LOGIN.password,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));

      const email = values.email.trim().toLowerCase();
      const isMockLogin =
        email === MOCK_LOGIN.email && values.password === MOCK_LOGIN.password;

      if (!isMockLogin) {
        setFormError("Invalid login details. Use the mock credentials.");
        pushToast({
          title: "Invalid login",
          description: `Use ${MOCK_LOGIN.email} / ${MOCK_LOGIN.password}`,
          variant: "warning",
        });
        return;
      }

      localStorage.setItem("admin_token", "mock-admin-token");
      pushToast({
        title: "Logged in",
        description: "Mock login accepted. Redirecting to dashboard.",
        variant: "success",
      });
      router.push("/dashboard");
    } catch {
      setFormError("Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to access the admin dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-danger" role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-danger" role="alert">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {formError ? (
            <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
              {formError}
            </p>
          ) : null}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="focus-ring rounded text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
            <span className="text-muted-foreground">Frontend mock auth</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
