'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

// TODO: Replace with actual data fetching
const MOCK_PERMISSIONS = [
  {
    id: 'perm-001',
    name: 'View Dashboard',
    description: 'Can view the admin dashboard',
    roles: {
      admin: true,
      manager: true,
      support: true,
    },
  },
  {
    id: 'perm-002',
    name: 'Manage Agents',
    description: 'Can approve/reject agent applications',
    roles: {
      admin: true,
      manager: true,
      support: false,
    },
  },
  {
    id: 'perm-003',
    name: 'Manage Tours',
    description: 'Can create and manage tours',
    roles: {
      admin: true,
      manager: true,
      support: false,
    },
  },
  {
    id: 'perm-004',
    name: 'Manage Users',
    description: 'Can create and manage system users',
    roles: {
      admin: true,
      manager: false,
      support: false,
    },
  },
  {
    id: 'perm-005',
    name: 'Manage Roles',
    description: 'Can create and manage roles and permissions',
    roles: {
      admin: true,
      manager: false,
      support: false,
    },
  },
];

const ROLES = ['admin', 'manager', 'support'];

export default function RoleAccessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Role Access</h1>
        <p className="text-muted-foreground">Configure detailed permissions for each role</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>View and manage role-based access control settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Description</TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role} className="text-center">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PERMISSIONS.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  {ROLES.map((role) => (
                    <TableCell key={role} className="text-center">
                      {permission.roles[role as keyof typeof permission.roles] ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          Allowed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <X className="mr-1 h-3 w-3" />
                          Denied
                        </Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
} 