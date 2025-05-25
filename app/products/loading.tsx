import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black grid-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex md:hidden items-center">
              <Button variant="outline" size="sm" className="border-gray-800">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
