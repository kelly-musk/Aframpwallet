import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  HomeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheckIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-navy-900">Aframp</span>
                  <span className="text-xs text-gray-400 ml-1">Console</span>
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/dashboard'}
                    className={({ isActive }) =>
                      `inline-flex items-center px-2 py-1 text-sm font-medium border-b-2 ${
                        isActive
                          ? 'border-navy-700 text-navy-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 mr-1.5" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400">Testnet</span>
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
