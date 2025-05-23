export default function Skeleton() {
  return (
    <div className="flex gap-4 w-full animate-pulse border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
    </div>
  )
}
