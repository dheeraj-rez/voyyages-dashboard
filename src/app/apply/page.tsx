'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }).optional(),
  // Optional: Add file validation if needed
  documents: z.any().optional(), // Placeholder for file upload
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ApplyPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  // TODO: Implement actual form submission logic (API call)
  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    console.log('Form submitted:', values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Replace with actual API call to backend
    // try {
    //   const formData = new FormData();
    //   formData.append('name', values.name);
    //   formData.append('email', values.email);
    //   if (values.phone) formData.append('phone', values.phone);
    //   if (values.message) formData.append('message', values.message);
    //   // Handle file upload: append the file if it exists
    //   // if (values.documents && values.documents.length > 0) {
    //   //   formData.append('document', values.documents[0]);
    //   // }

    //   // const response = await fetch('/api/agent-requests', {
    //   //   method: 'POST',
    //   //   body: formData, // Use FormData for file uploads
    //   // });

    //   // if (!response.ok) {
    //   //   throw new Error('Submission failed');
    //   // }

    //   toast({
    //     title: 'Application Submitted!',
    //     description: 'We have received your application and will review it shortly.',
    //     variant: 'default', // Use 'default' which maps to the blue primary color
    //   });
    //   form.reset();
    // } catch (error) {
    //   console.error('Submission error:', error);
    //   toast({
    //     title: 'Submission Failed',
    //     description: 'Something went wrong. Please try again.',
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }

    // Placeholder success
    toast({
      title: 'Application Submitted!',
      description: 'We have received your application and will review it shortly.',
       variant: 'default', // Use 'default' which maps to the blue primary color
    });
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Agent Onboarding Application</CardTitle>
          <CardDescription>Fill out the form below to apply to become an agent.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                     <FormDescription>
                      We'll send your login details here if approved.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Documents (Optional)</FormLabel>
                    <FormControl>
                      {/* Basic file input, enhance with better UI/library if needed */}
                      <Input type="file" {...form.register('documents')} />
                    </FormControl>
                    <FormDescription>
                      Upload relevant documents (e.g., ID, Resume). Max 5MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Anything else you'd like to add?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                 {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
