import { LogOut, Layout } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
    const { signOut, session } = useAuth()

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                <Layout className="w-6 h-6" />
                <span>TaskFlow</span>
            </div>
            <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-500 hidden sm:block">
                    {session?.user.email}
                </span>
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-lg"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </nav>
    )
}
