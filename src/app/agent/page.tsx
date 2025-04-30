'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// TODO: Replace with actual data fetching and types from backend/DB (likely from JWT payload or separate API call)
interface AgentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: Date;
  documents?: { name: string, url: string }[]; // Example structure for documents
}

// Simulate fetching data
const useAgentProfile = () => {
  const [profile, setProfile] = React.useState<AgentProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    const fetchProfile = async () => {
       setLoading(true);
       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
       // TODO: Fetch data based on authenticated user (e.g., from JWT)
       const mockProfile: AgentProfile = {
         id: 'usr-003', // Example ID
         name: 'Charlie Brown',
         email: 'charlie@comics.org',
         phone: '555-3333',
         joinDate: new Date(2023, 9, 16),
         documents: [
             { name: "Identification.pdf", url: "/docs/charlie_id.pdf"},
             { name: "Contract.docx", url: "/docs/charlie_contract.docx"}
         ]
       };
       setProfile(mockProfile);
       setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading };
};

export default function AgentDashboard() {
  const { profile, loading } = useAgentProfile();

  const formatDate = (date?: Date): string => {
    return date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Agent Dashboard</h1>

      <Card className="shadow-md w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>View your onboarding information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-full mt-4" />
            </>
          ) : profile ? (
            <>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span>{profile.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{profile.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Joined Date:</span>
                <span>{formatDate(profile.joinDate)}</span>
              </div>

              {profile.documents && profile.documents.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Your Documents</h3>
                  <ul className="space-y-2">
                    {profile.documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-secondary/50">
                         <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground"/>
                            <span>{doc.name}</span>
                         </div>
                        {/* TODO: Replace with actual download links/logic */}
                        <Button variant="outline" size="sm" asChild>
                           <a href={doc.url} target="_blank" rel="noopener noreferrer">Download</a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Placeholder for future actions */}
              {/* <div className="pt-4 border-t">
                 <Button variant="outline" disabled>Edit Profile (Coming Soon)</Button>
              </div> */}
            </>
          ) : (
            <p className="text-destructive">Could not load profile information.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
