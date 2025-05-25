import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
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
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-4">
            {/* Lista de mensajes */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />

              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>

            {/* Detalle del mensaje */}
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </main>
    </div>
  )
}
