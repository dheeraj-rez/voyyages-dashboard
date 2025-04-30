'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone, UserPlus } from 'lucide-react';
import Link from 'next/link';

// TODO: Replace with actual data fetching
const MOCK_AGENTS = [
  {
    id: 'agent-001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1 555-0123',
    status: 'active',
    toursCount: 15,
    joinedDate: '2024-01-15',
  },
  {
    id: 'agent-002',
    name: 'Bob Wilson',
    email: 'bob.w@example.com',
    phone: '+1 555-0124',
    status: 'active',
    toursCount: 8,
    joinedDate: '2024-02-01',
  },
  {
    id: 'agent-003',
    name: 'Charlie Davis',
    email: 'charlie.d@example.com',
    phone: '+1 555-0125',
    status: 'inactive',
    toursCount: 3,
    joinedDate: '2024-02-15',
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">Manage your travel agents</p>
        </div>
        <Link href="/admin/agents/requests">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Agent Requests
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Agents</CardTitle>
          <CardDescription>View and manage all active travel agents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tours</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AGENTS.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${agent.email}`} className="text-primary hover:underline">
                          {agent.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="text-muted-foreground">{agent.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={agent.status === 'active' ? 'secondary' : 'outline'}
                      className={agent.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.toursCount}</TableCell>
                  <TableCell>{agent.joinedDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
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