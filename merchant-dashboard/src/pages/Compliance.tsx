import { useQuery, useMutation } from '@tanstack/react-query';
import { MerchantAPI } from '../services/api';
import { formatDate } from '../utils/format';

export default function Compliance() {
  const { data: report, refetch } = useQuery({
    queryKey: ['compliance-report'],
    queryFn: MerchantAPI.generateComplianceReport,
  });

  const exportMutation = useMutation({
    mutationFn: MerchantAPI.exportTransactions,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const viewingKeyMutation = useMutation({
    mutationFn: MerchantAPI.generateViewingKey,
    onSuccess: (key) => {
      navigator.clipboard.writeText(key);
      alert('Viewing key copied to clipboard!');
    },
  });

  if (!report) {
    return <div className="text-center text-gray-500">Loading report...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Report</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{report.total_transactions}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900">{report.total_volume_usd}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Average Transaction</p>
            <p className="text-2xl font-bold text-gray-900">{report.average_transaction_usd}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-sm mb-6">
          <p>
            <span className="font-medium">Period:</span> {report.period_start} to {report.period_end}
          </p>
          <p>
            <span className="font-medium">Merchant ID:</span> {report.merchant_id}
          </p>
          <p>
            <span className="font-medium">Generated:</span> {formatDate(report.generated_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => refetch()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            🔄 Refresh Report
          </button>
          <button
            onClick={() => exportMutation.mutate()}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition cursor-pointer disabled:opacity-50"
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? 'Exporting...' : '📥 Export CSV'}
          </button>
          <button
            onClick={() => viewingKeyMutation.mutate()}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition cursor-pointer disabled:opacity-50"
            disabled={viewingKeyMutation.isPending}
          >
            {viewingKeyMutation.isPending ? 'Generating...' : '🔑 Generate Viewing Key'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Compliance Features</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ All transactions are auditable with viewing key</li>
          <li>✅ AML/KYC ready for transactions &gt; $10,000</li>
          <li>✅ GDPR compliant - data only decrypted with consent</li>
          <li>✅ Exportable reports for tax authorities</li>
          <li>✅ Real-time compliance monitoring</li>
        </ul>
      </div>
    </div>
  );
}
