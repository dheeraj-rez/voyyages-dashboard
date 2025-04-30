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
    //      // Attempt to parse error message from backend if available
    //      let errorMsg = 'Login failed';
    //      try {
    //        const errorData = await response.json();
    //        errorMsg = errorData.message || errorMsg;
    //      } catch (parseError) {
    //         // Ignore if response is not JSON
    //      }
    //      throw new Error(errorMsg);
    //   }

    //   const { token, user } = await response.json();

      // TODO: Store the JWT token securely (e.g., HttpOnly cookie set by the server)
      // The server should set the HttpOnly cookie upon successful login.
      // document.cookie = `authToken=${token}; path=/; max-age=...; HttpOnly; Secure; SameSite=Strict`; // Client-side setting is NOT recommended for HttpOnly

      // Determine redirect based on role fetched from backend
    //   let redirectPath = '/'; // Default redirect path
    //   if (user && user.role) { // Check if user and role exist
    //      switch (user.role) {
    //        case 'admin':
    //          redirectPath = '/admin';
    //          break;
    //        case 'ops':
    //          redirectPath = '/ops';
    //          break;
    //        case 'agent':
    //          redirectPath = '/agent';
    //          break;
    //        default:
    //          console.warn("Unknown user role:", user.role);
    //          // Redirect to a default authenticated user page or home
    //          redirectPath = '/agent'; // Example: default to agent dashboard if role unknown
    //      }
    //   } else {
    //       console.error("User role not found in login response");
    //       // Handle case where role is missing, maybe redirect to a generic profile page or show error
    //       toast({
    //         title: 'Login Error',
    //         description: 'Could not determine user role. Please contact support.',
    //         variant: 'destructive',
    //       });
    //       setIsSubmitting(false);
    //       return;
    //   }


    //   toast({ title: 'Login Successful!', variant: 'default' });
    //   router.push(redirectPath); // Use router.push for navigation

    // } catch (error: any) { // Catch any error type
    //   console.error('Login error:', error);
    //   toast({
    //     title: 'Login Failed',
    //     description: error.message || 'Invalid email or password.', // Display backend error or generic message
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
     // --- End Replace ---

    // Placeholder logic: redirect based on email for demo
    let redirectPath = '/';
     if (values.email.includes('admin')) {
        redirectPath = '/admin'; // Correctly redirects admin users
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
    // Setting isSubmitting back to false happens in the finally block in the real implementation
    // For the placeholder, we need to do it here if navigation doesn't unmount immediately
    // setIsSubmitting(false); // Keep this commented out if navigation happens quickly
  }

  return (
    // Removed min-h-[calc(100vh-10rem)] to let the AuthLayout handle centering
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
  );
}
