import './App.css'
import Hero from './components/custom/Hero'
import { ToastProvider } from './components/ui/toast'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <main className="w-full">
          <Hero />
        </main>
      </div>
    </ToastProvider>
  )
}
export default App