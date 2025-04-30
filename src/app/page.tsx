import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to AgentFlow</CardTitle>
          <CardDescription>Your streamlined agent onboarding solution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Navigate to the section relevant to you:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default">
              <Link href="/apply">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/login">
                Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            (Demo links: <Link href="/admin" className="underline">Admin</Link>, <Link href="/ops" className="underline">Ops</Link>, <Link href="/agent" className="underline">Agent</Link>)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
