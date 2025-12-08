import { LogOut, Layout, Moon, Sun } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

export default function Navbar() {
    const { signOut, session } = useAuth()
    const { theme, toggleTheme } = useTheme()

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
                <Layout className="w-6 h-6" />
                <span>TaskFlow</span>
            </div>
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Toggle Theme"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                    {session?.user.email}
                </span>
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </nav>
    )
}
