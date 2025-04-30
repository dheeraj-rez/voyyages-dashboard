'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Download, Eye, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

// TODO: Replace with actual data fetching and types from backend/DB
type AgentRequestStatus = 'pending' | 'approved' | 'rejected';

interface AgentRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: AgentRequestStatus;
  createdAt: Date;
  approvedAt?: Date;
  docUrls?: string[]; // Array of URLs for uploaded documents
  message?: string;
}

const MOCK_REQUESTS: AgentRequest[] = [
  { id: 'req-001', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '555-1111', status: 'pending', createdAt: new Date(2023, 10, 1), docUrls: ['/docs/alice_id.pdf'] },
  { id: 'req-002', name: 'Bob Smith', email: 'bob.s@sample.net', status: 'pending', createdAt: new Date(2023, 10, 2), message: "Eager to start!" },
  { id: 'req-003', name: 'Charlie Brown', email: 'charlie@comics.org', phone: '555-3333', status: 'approved', createdAt: new Date(2023, 9, 15), approvedAt: new Date(2023, 9, 16) },
  { id: 'req-004', name: 'Diana Prince', email: 'diana.p@themyscira.gov', status: 'rejected', createdAt: new Date(2023, 9, 10), docUrls: ['/docs/diana_resume.docx', '/docs/diana_cert.png'] },
  { id: 'req-005', name: 'Ethan Hunt', email: 'ethan.h@imf.secret', phone: '555-5555', status: 'pending', createdAt: new Date(2023, 10, 3) },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  // TODO: Fetch requests from API instead of mock data
  const [requests, setRequests] = React.useState<AgentRequest[]>(MOCK_REQUESTS);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [selectedRequest, setSelectedRequest] = React.useState<AgentRequest | null>(null);


  // TODO: Implement API calls for approve/reject actions
  const handleApprove = async (requestId: string) => {
    console.log(`Approving request: ${requestId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'approved', approvedAt: new Date() } : req));
    toast({
      title: 'Request Approved',
      description: `Agent ${requests.find(r=>r.id === requestId)?.name} has been approved. Login details sent.`,
      variant: 'default', // Use 'default' for blue
       className: 'bg-accent text-accent-foreground border-accent', // Override with green accent styles
    });
     // Send email via backend API
     // await fetch('/api/admin/approve', { method: 'POST', body: JSON.stringify({ requestId }) });
  };

  const handleReject = async () => {
     if (!selectedRequest) return;
     const requestId = selectedRequest.id;
     console.log(`Rejecting request: ${requestId} with reason: ${rejectionReason}`);
     // Simulate API call
     await new Promise(resolve => setTimeout(resolve, 500));
     setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req));
     toast({
       title: 'Request Rejected',
       description: `Agent ${selectedRequest.name} has been rejected. Rejection email sent.`,
       variant: 'destructive',
     });
     setSelectedRequest(null); // Close dialog
     setRejectionReason(''); // Clear reason
     // Send email via backend API
     // await fetch('/api/admin/reject', { method: 'POST', body: JSON.stringify({ requestId, reason: rejectionReason }) });
  };

  const getStatusBadge = (status: AgentRequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (date?: Date): string => {
    return date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Agent Onboarding Requests</CardTitle>
          <CardDescription>Review and manage pending agent applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                <TableHead className="hidden lg:table-cell">Processed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                       No pending requests found.
                    </TableCell>
                 </TableRow>
              ) : (
                 requests.map((request) => (
                 <TableRow key={request.id}>
                   <TableCell className="font-medium">{request.name}</TableCell>
                   <TableCell>
                      <a href={`mailto:${request.email}`} className="text-primary hover:underline flex items-center gap-1">
                        <Mail className="h-3 w-3"/> {request.email}
                      </a>
                    </TableCell>
                   <TableCell className="hidden md:table-cell">{request.phone || '-'}</TableCell>
                   <TableCell>{getStatusBadge(request.status)}</TableCell>
                   <TableCell className="hidden lg:table-cell">{formatDate(request.createdAt)}</TableCell>
                   <TableCell className="hidden lg:table-cell">{request.status !== 'pending' ? formatDate(request.approvedAt) : '-'}</TableCell>
                   <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                       {/* Placeholder View Details Button */}
                       <Button variant="ghost" size="icon" title="View Details">
                         <Eye className="h-4 w-4" />
                       </Button>
                       {/* Placeholder Download Documents Button */}
                       {request.docUrls && request.docUrls.length > 0 && (
                         <Button variant="ghost" size="icon" title="Download Documents">
                           <Download className="h-4 w-4" />
                         </Button>
                       )}
                       {request.status === 'pending' && (
                         <>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() => handleApprove(request.id)}
                              title="Approve"
                            >
                             <CheckCircle className="h-4 w-4" />
                           </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                   variant="ghost"
                                   size="icon"
                                   className="text-red-600 hover:bg-red-100 hover:text-red-700"
                                   onClick={() => setSelectedRequest(request)}
                                   title="Reject"
                                 >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Application for {selectedRequest?.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. An email will be sent to the agent. Add an optional reason below.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Textarea
                                    placeholder="Optional rejection reason..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="mt-2"
                                 />
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => { setSelectedRequest(null); setRejectionReason(''); }}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Confirm Rejection
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                         </>
                       )}
                     </div>
                   </TableCell>
                 </TableRow>
               ))
              )}

            </TableBody>
          </Table>
        </CardContent>
      </Card>

        {/* TODO: Add User Management Section */}
        {/* <Card className="shadow-md mt-6">
            <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>View and manage existing users (admins, ops, agents).</CardDescription>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">User management interface coming soon...</p>
             <Button disabled>Add User</Button> */}
            {/* User table here */}
            {/* </CardContent>
        </Card> */}
    </div>
  );
}
