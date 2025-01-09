import Link from 'next/link'
import LoginForm from './components/LoginForm'
import Logo from './components/Logo'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <Logo />
        <h1 className="text-3xl font-bold text-center text-gray-900">JayK Communications</h1>
        <h2 className="text-xl text-center text-gray-600">Marketing Team Login</h2>
        <LoginForm />
        <div className="text-center mt-4">
          <Link href="/admin/login" className="text-sm text-blue-600 hover:underline">
            Admin Login
          </Link>
        </div>
      </div>
    </main>
  )
}

