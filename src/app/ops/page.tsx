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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, User } from 'lucide-react';

// TODO: Replace with actual data fetching and types from backend/DB
// This data would typically come from the 'users' table after approval
interface AgentInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: Date; // Date they were approved/created in users table
  // Add other relevant fields an Ops user might need to see
}

const MOCK_AGENTS: AgentInfo[] = [
  { id: 'usr-003', name: 'Charlie Brown', email: 'charlie@comics.org', phone: '555-3333', joinDate: new Date(2023, 9, 16) },
  { id: 'usr-006', name: 'Frank Castle', email: 'frank.c@vigilante.net', joinDate: new Date(2023, 10, 5) },
  // Add more approved agents...
];


export default function OpsDashboard() {
  // TODO: Fetch agent info from API instead of mock data
  const [agents, setAgents] = React.useState<AgentInfo[]>(MOCK_AGENTS);

  const formatDate = (date?: Date): string => {
    return date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Operations Dashboard</h1>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Approved Agents</CardTitle>
          <CardDescription>View information for currently active agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Joined Date</TableHead>
                 <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {agents.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                       No approved agents found.
                    </TableCell>
                 </TableRow>
              ) : (
                  agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/>{agent.name}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{agent.phone || '-'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(agent.joinDate)}</TableCell>
                      <TableCell>
                         <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="mr-1 h-3 w-3" />Active
                         </Badge>
                      </TableCell>
                    </TableRow>
                 ))
              )}

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
