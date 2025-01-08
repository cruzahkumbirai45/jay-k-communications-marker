import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function AuthError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem with the authentication process.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try logging in again. If the problem persists, contact support.</p>
        </CardContent>
        <CardFooter>
          <Link href="/login" passHref>
            <Button className="w-full">Back to Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

