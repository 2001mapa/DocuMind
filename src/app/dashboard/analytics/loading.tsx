export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-muted rounded-md mb-2"></div>
        <div className="h-4 w-64 bg-muted rounded-md"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-xl"></div>
        ))}
      </div>
      
      <div className="h-48 bg-muted rounded-xl"></div>
    </div>
  )
}
