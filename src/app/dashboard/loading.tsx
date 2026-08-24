export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-7 w-48 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-40 bg-muted rounded-full"></div>
      </div>
      
      <div>
        <div className="h-6 w-32 bg-muted rounded-md mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
