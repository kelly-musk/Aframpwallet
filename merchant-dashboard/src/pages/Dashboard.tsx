import { useQuery } from '@tanstack/react-query';
import { MerchantAPI } from '../services/api';

export default function Dashboard() {
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: MerchantAPI.getDashboardStats,
  });

  const stats = [
    { label: 'Total Revenue', value: statsData?.balance || '$12,432.00', icon: '💰' },
    { label: 'Transactions', value: String(statsData?.transaction_count ?? '847'), icon: '📊' },
    { label: 'Active Customers', value: '128', icon: '👥' },
    { label: 'Avg. Transaction', value: statsData?.average_transaction || '$14.68', icon: '📈' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Overview of your merchant activity</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          System Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-green-500/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/transactions"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-green-500/30 hover:bg-gray-800 transition-all text-sm text-gray-300 hover:text-white"
          >
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Transactions
          </a>
          <a
            href="/compliance"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-green-500/30 hover:bg-gray-800 transition-all text-sm text-gray-300 hover:text-white"
          >
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Compliance Report
          </a>
          <a
            href="/distribution"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-green-500/30 hover:bg-gray-800 transition-all text-sm text-gray-300 hover:text-white"
          >
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
            Distribution
          </a>
          <a
            href="/pay"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-green-500/30 hover:bg-gray-800 transition-all text-sm text-gray-300 hover:text-white"
          >
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
            Payment Demo
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'Payment received', amount: '$42.00', time: '2 min ago', status: 'confirmed' },
            { action: 'Payment received', amount: '$156.00', time: '15 min ago', status: 'confirmed' },
            { action: 'Viewing key generated', amount: '', time: '1 hour ago', status: 'info' },
            { action: 'Compliance report exported', amount: '', time: '3 hours ago', status: 'info' },
            { action: 'Payment received', amount: '$89.50', time: '5 hours ago', status: 'confirmed' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800/30 border border-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'confirmed' ? 'bg-green-400' : 'bg-gray-500'
                }`} />
                <span className="text-sm text-gray-300">{item.action}</span>
              </div>
              <div className="flex items-center gap-4">
                {item.amount && (
                  <span className="text-sm font-medium text-white">{item.amount}</span>
                )}
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
