export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total AUM</p>
          <p className="text-2xl font-bold text-navy">$0.00</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Active Investors</p>
          <p className="text-2xl font-bold text-navy">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Pending KYC</p>
          <p className="text-2xl font-bold text-gold">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Pending Subscriptions</p>
          <p className="text-2xl font-bold text-gold">0</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm">No activity yet. Audit log entries will appear here.</p>
      </div>
    </div>
  );
}
