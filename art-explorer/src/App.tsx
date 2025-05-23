import Header from './components/Header'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-300 dark:bg-slate-950 p-4">
      <Header />
      <main className="flex-1 py-6">
        <AppRoutes />
      </main>
    </div>
  )
}
