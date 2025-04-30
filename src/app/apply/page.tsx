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
import Link from 'next/link'; // Import Link for navigation

// Define the validation schema for the agent application form
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(100, { message: 'Name cannot exceed 100 characters.'}),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number (e.g., +11234567890 or 1234567890).' }).optional().or(z.literal('')), // Optional, but validate format if provided
  // Add more specific file validation if needed (e.g., size, type)
  documents: z.instanceof(FileList).optional() // Handle FileList for file input
            .refine(files => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024, `Max file size is 5MB.`) // Example size validation
            .refine(files => !files || files.length === 0 || ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0].type),
              'Only .pdf, .jpg, .png, .docx files are accepted.'), // Example type validation
  message: z.string().max(500, { message: 'Message cannot exceed 500 characters.' }).optional(),
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
      documents: undefined, // Initialize documents field
    },
  });

  const fileRef = form.register("documents"); // Register file input

  // TODO: Implement actual form submission logic (API call)
  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    console.log('Form submitted:', values);
    console.log('Uploaded File:', values.documents?.[0]); // Log the file object

    // Prepare form data for API submission, including the file if present
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    if (values.phone) formData.append('phone', values.phone);
    if (values.message) formData.append('message', values.message);
    if (values.documents && values.documents.length > 0) {
      formData.append('document', values.documents[0]); // Append the actual file
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // --- Replace with actual API call to backend ---
    // try {
    //   const response = await fetch('/api/agent-requests', { // Example API endpoint
    //     method: 'POST',
    //     body: formData, // Use FormData for multipart/form-data (needed for files)
    //     // No 'Content-Type' header needed when using FormData, browser sets it automatically
    //   });

    //   if (!response.ok) {
    //      let errorMsg = 'Submission failed';
    //      try {
    //        const errorData = await response.json();
    //        errorMsg = errorData.message || `Server error: ${response.status}`;
    //      } catch (parseError) {
    //         errorMsg = `Server error: ${response.status}`;
    //      }
    //     throw new Error(errorMsg);
    //   }

    //   // const result = await response.json(); // Process success response if needed

    //   toast({
    //     title: 'Application Submitted!',
    //     description: 'We have received your application and will review it shortly.',
    //     variant: 'default', // Use 'default' which maps to the blue primary color
    //   });
    //   form.reset(); // Reset form fields on successful submission
    // } catch (error: any) {
    //   console.error('Submission error:', error);
    //   toast({
    //     title: 'Submission Failed',
    //     description: error.message || 'Something went wrong. Please try again.',
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
    // --- End Replace ---

    // Placeholder success (remove when implementing actual API call)
    toast({
      title: 'Application Submitted!',
      description: 'We have received your application and will review it shortly.',
       variant: 'default', // Use 'default' which maps to the blue primary color
    });
    form.reset(); // Reset form fields
    setIsSubmitting(false);
  }

  return (
     // Use a Card for better structure and presentation
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
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
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
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., +11234567890 (Optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="documents"
              render={({ field }) => ( // Destructure field here, but use fileRef for the input itself
                <FormItem>
                  <FormLabel>Upload Document</FormLabel>
                  <FormControl>
                    {/* Use the registered ref here */}
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.docx" // Specify accepted file types
                      {...fileRef} // Spread the ref properties
                      onChange={(e) => field.onChange(e.target.files)} // Update RHF state on change
                     />
                  </FormControl>
                  <FormDescription>
                    Optional: Upload ID, Resume, etc. (PDF, JPG, PNG, DOCX). Max 5MB.
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Anything else you'd like to add? (Optional, max 500 chars)" {...field} />
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
             <div className="mt-4 text-center text-sm text-muted-foreground">
                 Already have an account or applied?{" "}
                <Button variant="link" asChild className="p-0 h-auto font-normal">
                    <Link href="/login">Login Here</Link>
                </Button>
             </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
