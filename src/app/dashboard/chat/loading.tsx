export default function ChatLoading() {
  return (
    <div className="flex flex-col h-full animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-48 bg-muted rounded-full"></div>
      </div>
      
      <div className="flex-1 space-y-6 mt-8">
        <div className="flex gap-4 justify-end">
          <div className="h-12 w-[60%] bg-muted rounded-2xl rounded-br-sm"></div>
          <div className="h-8 w-8 rounded-full bg-muted shrink-0"></div>
        </div>
        
        <div className="flex gap-4 justify-start">
          <div className="h-8 w-8 rounded-full bg-muted shrink-0"></div>
          <div className="h-24 w-[75%] bg-muted rounded-2xl rounded-bl-sm"></div>
        </div>
        
        <div className="flex gap-4 justify-end">
          <div className="h-16 w-[50%] bg-muted rounded-2xl rounded-br-sm"></div>
          <div className="h-8 w-8 rounded-full bg-muted shrink-0"></div>
        </div>
      </div>
    </div>
  )
}
