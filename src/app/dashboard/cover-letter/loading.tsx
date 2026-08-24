export default function CoverLetterLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-7 w-64 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-muted rounded-md"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px] bg-muted rounded-xl"></div>
        <div className="h-[400px] bg-muted rounded-xl"></div>
      </div>
    </div>
  )
}
