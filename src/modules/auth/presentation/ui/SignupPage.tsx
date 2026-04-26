"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type SignupValues = z.infer<typeof signupSchema>;


export function SignupPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();


  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupValues) {
    setError(null);
    setLoading(true);

    try {
      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/"
      },
        {
          onSuccess: () => {
            router.push("/onboarding");
          },
          onError: ({ error }) => {
            setError(error.message);
          },
        }
      )

    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 antialiased">
      <Link href="/" className="flex items-center gap-2 text-foreground mb-10 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-lg shadow-primary-container/20">
          <Sparkles className="w-6 h-6 fill-on-primary-container" />
        </div>
        <span className="text-2xl tracking-tight font-black">ShopSpell</span>
      </Link>

      <Card className="w-full max-w-[440px] shadow-2xl border-border/40 bg-card rounded-[24px] overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-10 pb-8">
          <CardTitle className="text-3xl font-black tracking-tight">Create your store</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Step into the future of commerce. Let&apos;s craft your vision.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" className="h-12 rounded-xl bg-background border-border/60 focus:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@example.com" className="h-12 rounded-xl bg-background border-border/60 focus:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-background border-border/60 focus:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-2">
                <Button disabled={loading} type="submit" className="w-full h-12 rounded-xl hover:bg-primary-container/90 bg-primary-container text-on-primary-container font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <> Get Started <ArrowRight className="w-4 h-4" /></>}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-bold">
                    <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button variant="outline" type="button" className="w-full h-12 rounded-xl border-border/60 hover:bg-muted/50 font-bold flex items-center justify-center gap-3 transition-all">
                  <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                  Google
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="pb-10 pt-2 justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-bold hover:underline underline-offset-4">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>

      <p className="mt-8 text-center text-xs text-muted-foreground max-w-[300px] leading-relaxed opacity-60">
        By clicking continue, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>
    </div>
  );
}
