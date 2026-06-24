import { useQuery } from '@tanstack/react-query';
import { MerchantAPI } from '../services/api';

export default function Settings() {
  const { data: merchantInfo } = useQuery({
    queryKey: ['merchant-info'],
    queryFn: () => MerchantAPI.getMerchantInfo('demo_001'),
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>

      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Merchant Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Merchant ID</p>
              <p className="font-medium text-gray-900">{merchantInfo?.merchant_id || 'demo_001'}</p>
            </div>
            <div>
              <p className="text-gray-500">Network</p>
              <p className="font-medium text-gray-900">{merchantInfo?.network || 'Stellar Testnet'}</p>
            </div>
            <div>
              <p className="text-gray-500">USDC Balance</p>
              <p className="font-medium text-gray-900">{merchantInfo?.balance || '$1,234.56'}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium text-green-600">Active ✓</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Privacy Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Private payments enabled</p>
                <p className="text-sm text-gray-500">All transactions are private by default</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">ON</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Compliance reporting</p>
                <p className="text-sm text-gray-500">Automatic audit trail generation</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">ACTIVE</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Export Data</h3>
          <div className="flex flex-wrap gap-3">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">
              📥 Export Transactions
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">
              🔑 Export Viewing Key
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition cursor-pointer">
              🗑️ Clear History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
