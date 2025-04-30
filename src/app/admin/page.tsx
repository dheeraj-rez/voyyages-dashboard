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
import { CheckCircle, XCircle, Clock, Download, Eye, Mail, Users, TrendingUp, FileText, AlertCircle } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

// TODO: Replace with actual data fetching
const stats = [
  {
    title: 'Total Agents',
    value: '1,234',
    description: 'Active agents in the system',
    icon: Users,
    trend: '+12% from last month',
  },
  {
    title: 'Pending Requests',
    value: '23',
    description: 'Agent applications to review',
    icon: FileText,
    trend: '5 new today',
  },
  {
    title: 'Total Bookings',
    value: '8,456',
    description: 'Bookings this month',
    icon: TrendingUp,
    trend: '+8% from last month',
  },
  {
    title: 'Active Issues',
    value: '3',
    description: 'Requires attention',
    icon: AlertCircle,
    trend: '2 high priority',
  },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [requests, setRequests] = React.useState<AgentRequest[]>([]);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [selectedRequest, setSelectedRequest] = React.useState<AgentRequest | null>(null);
  const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
  const [stats, setStats] = React.useState({
    totalAgents: 0,
    pendingRequests: 0,
    totalBookings: 0,
    activeIssues: 0
  });

  // Fetch requests and stats on component mount
  React.useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const agents = await response.json();
      
      setStats({
        totalAgents: agents.length,
        pendingRequests: agents.filter((a: AgentRequest) => a.status === 'pending').length,
        totalBookings: agents.reduce((acc: number, agent: any) => acc + (agent.tours_count || 0), 0),
        activeIssues: 0 // This would come from a separate API endpoint
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard stats',
        variant: 'destructive',
      });
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents`);
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch agent requests',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = async (requestId: string) => {
    setIsLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) throw new Error('Failed to approve request');

      await fetchRequests(); // Refresh the list
      await fetchStats(); // Refresh stats

      toast({
        title: 'Request Approved',
        description: `Agent ${requests.find(r => r.id === requestId)?.name} has been approved.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve request',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    const requestId = selectedRequest.id;
    setIsLoading(prev => ({ ...prev, [requestId]: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason 
        }),
      });

      if (!response.ok) throw new Error('Failed to reject request');

      await fetchRequests(); // Refresh the list
      await fetchStats(); // Refresh stats

      toast({
        title: 'Request Rejected',
        description: `Agent ${selectedRequest.name} has been rejected.`,
        variant: 'destructive',
      });

      setSelectedRequest(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'review':
        router.push('/admin/applications');
        break;
      case 'reports':
        router.push('/admin/reports');
        break;
      case 'users':
        router.push('/admin/users');
        break;
      default:
        break;
    }
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
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">Active agents in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Agent applications to review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Bookings this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIssues}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-center gap-4">
                  <div className={`h-2 w-2 rounded-full ${
                    request.status === 'approved' ? 'bg-green-500' :
                    request.status === 'rejected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm font-bold">
                      {request.status === 'approved' ? 'Agent approved' :
                       request.status === 'rejected' ? 'Agent rejected' :
                       'New agent application'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button 
                onClick={() => handleQuickAction('review')}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <span>Review Pending Applications</span>
                <FileText className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleQuickAction('reports')}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <span>View System Reports</span>
                <TrendingUp className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleQuickAction('users')}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <span>Manage Users</span>
                <Users className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

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
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{request.phone || '-'}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(request.createdAt)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(request.approvedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={isLoading[request.id]}
                          >
                            {isLoading[request.id] ? 'Processing...' : 'Approve'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setSelectedRequest(request)}
                              >
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Please provide a reason for rejecting this application.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="mt-4"
                              />
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleReject}
                                  disabled={!rejectionReason.trim()}
                                >
                                  Confirm Rejection
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {request.docUrls && request.docUrls.length > 0 && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Docs
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
