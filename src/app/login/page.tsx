'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Use App Router's router

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // TODO: Implement actual login logic (API call, JWT handling)
  async function onSubmit(values: LoginFormData) {
    setIsSubmitting(true);
    console.log('Login attempt:', values);

    // Simulate API call & role-based redirect
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- Replace with actual API call ---
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(values),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Login failed');
    //   }

    //   const { token, user } = await response.json();

      // TODO: Store the JWT token securely (e.g., HttpOnly cookie or localStorage - consider security implications)
      // localStorage.setItem('authToken', token);

      // Determine redirect based on role
      // let redirectPath = '/';
      // if (user.role === 'admin') {
      //   redirectPath = '/admin';
      // } else if (user.role === 'ops') {
      //   redirectPath = '/ops';
      // } else if (user.role === 'agent') {
      //   redirectPath = '/agent';
      // }

      // toast({ title: 'Login Successful!', variant: 'default' });
      // router.push(redirectPath); // Use router.push for navigation

    // } catch (error) {
    //   console.error('Login error:', error);
    //   toast({
    //     title: 'Login Failed',
    //     description: 'Invalid email or password.',
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
     // --- End Replace ---

    // Placeholder logic: redirect based on email for demo
    let redirectPath = '/';
     if (values.email.includes('admin')) {
        redirectPath = '/admin';
     } else if (values.email.includes('ops')) {
        redirectPath = '/ops';
     } else if (values.email.includes('agent')) {
        redirectPath = '/agent';
     } else {
        // If no role indicator in email, default or show error
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password (Hint: use admin@, ops@, or agent@ for demo).',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
     }

     toast({ title: 'Login Successful!', variant: 'default' });
     router.push(redirectPath);


    // Don't reset form on failed login, allow retry
    // form.reset();
    setIsSubmitting(false); // Set back even on success if navigation doesn't unmount
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/apply" className="underline text-primary hover:text-primary/80">
              Apply now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
