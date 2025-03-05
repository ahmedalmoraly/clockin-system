"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useGoogleSheetsContext } from "@/app/providers"
import type { Employee } from "@/lib/types"
import { ChevronLeft } from "lucide-react"

export default function QuickSignIn() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { getUniqueEmployees, accessToken } = useGoogleSheetsContext()

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!accessToken) {
        console.error("No access token available")
        router.push("/")
        return
      }

      try {
        const employeeList = await getUniqueEmployees()
        setEmployees(employeeList)
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [getUniqueEmployees, accessToken, router])

  const handleSignIn = (employee: Employee) => {
    localStorage.setItem("currentUser", JSON.stringify(employee))
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Employee Sign In">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </Header>
      <main className="flex-1 container py-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Employee Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {employees.map((employee) => (
                <Button
                  key={employee.id}
                  onClick={() => handleSignIn(employee)}
                  className="h-auto py-6 flex flex-col items-center justify-center text-center"
                  variant="outline"
                >
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-2">
                    {employee.name.charAt(0)}
                  </div>
                  <span>{employee.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

