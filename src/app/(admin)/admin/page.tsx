import { createServerClient } from '@/lib/supabase/server';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default async function AdminDashboard() {
  const supabase = createServerClient();
  
  // Get dashboard metrics (30 days by default)
  const { data: metrics } = await supabase
    .rpc('get_admin_dashboard_metrics', { p_days: 30 });
  
  const dashboardData = metrics?.[0] || {
    total_users: 0,
    new_users_period: 0,
    active_users_today: 0,
    total_revenue_cents: 0,
    total_costs_cents: 0,
    profit_cents: 0,
    profit_margin: 0,
    total_calls: 0,
    total_minutes: 0,
    avg_call_duration: 0,
    open_complaints: 0,
    critical_complaints: 0,
  };
  
  // Get recent complaints
  const { data: recentComplaints } = await supabase
    .from('complaints')
    .select('*')
    .order('reported_at', { ascending: false })
    .limit(5);
  
  // Get today's revenue breakdown
  const { data: todayRevenue } = await supabase
    .from('revenue_transactions')
    .select('*')
    .gte('transaction_date', new Date().toISOString().split('T')[0])
    .order('transaction_date', { ascending: false });
  
  // Get today's costs breakdown
  const { data: todayCosts } = await supabase
    .from('cost_tracking')
    .select('*')
    .gte('cost_date', new Date().toISOString().split('T')[0])
    .order('cost_date', { ascending: false });
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble des 30 derniers jours</p>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(Number(dashboardData.total_users))}
              </p>
              <p className="text-sm text-green-600 mt-2">
                +{formatNumber(Number(dashboardData.new_users_period))} ce mois
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Revenue (CA) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CA (30 jours)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(Number(dashboardData.total_revenue_cents) / 100)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Marge: {Number(dashboardData.profit_margin).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Costs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coûts (30 jours)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(Number(dashboardData.total_costs_cents) / 100)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Profit: {formatCurrency(Number(dashboardData.profit_cents) / 100)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Complaints */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plaintes Ouvertes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(Number(dashboardData.open_complaints))}
              </p>
              <p className="text-sm text-red-600 mt-2">
                {formatNumber(Number(dashboardData.critical_complaints))} critiques
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Calls */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Appels</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(Number(dashboardData.total_calls))}</p>
          <p className="text-sm text-gray-600 mt-1">
            {formatNumber(Number(dashboardData.total_minutes))} minutes totales
          </p>
        </div>
        
        {/* Active Users Today */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Actifs Aujourd'hui</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(Number(dashboardData.active_users_today))}</p>
          <p className="text-sm text-gray-600 mt-1">
            {((Number(dashboardData.active_users_today) / Number(dashboardData.total_users)) * 100).toFixed(1)}% de la base
          </p>
        </div>
        
        {/* Average Call Duration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Durée Moyenne</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{Number(dashboardData.avg_call_duration).toFixed(1)} min</p>
          <p className="text-sm text-gray-600 mt-1">Par appel</p>
        </div>
      </div>
      
      {/* Recent Complaints Table */}
      <div className="bg-white rounded-xl border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Plaintes Récentes (Agents IA)</h2>
            <a href="/admin/complaints" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir tout →
            </a>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sévérité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentComplaints && recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {complaint.detected_by_ai && (
                          <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 7H7v6h6V7z" />
                            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                          </svg>
                        )}
                        <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 capitalize">{complaint.complaint_type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        complaint.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        complaint.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        complaint.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {complaint.detected_by_ai ? `IA (${(complaint.ai_confidence_score * 100).toFixed(0)}%)` : 'Utilisateur'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        complaint.status === 'escalated' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(complaint.reported_at).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/admin/complaints/${complaint.id}`} className="text-blue-600 hover:text-blue-900">
                        Voir →
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-sm font-medium">Aucune plainte</p>
                      <p className="text-gray-400 text-xs mt-1">Les plaintes apparaîtront ici</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Revenue & Costs Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Revenue */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Revenus du Jour</h2>
          </div>
          <div className="p-6">
            {todayRevenue && todayRevenue.length > 0 ? (
              <div className="space-y-3">
                {todayRevenue.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{transaction.plan_type || transaction.transaction_type}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.transaction_date).toLocaleTimeString('fr-FR')}</p>
                    </div>
                    <span className={`text-sm font-semibold ${
                      transaction.transaction_type === 'refund' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.transaction_type === 'refund' ? '-' : '+'}
                      {formatCurrency(transaction.amount_cents / 100, transaction.currency)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Aucune transaction aujourd'hui</p>
            )}
          </div>
        </div>
        
        {/* Today's Costs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Coûts du Jour</h2>
          </div>
          <div className="p-6">
            {todayCosts && todayCosts.length > 0 ? (
              <div className="space-y-3">
                {todayCosts.slice(0, 5).map((cost) => (
                  <div key={cost.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{cost.provider} - {cost.cost_type}</p>
                      <p className="text-xs text-gray-500">
                        {cost.quantity && cost.unit ? `${cost.quantity} ${cost.unit}` : new Date(cost.cost_date).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      -{formatCurrency(cost.amount_cents / 100, cost.currency)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Aucun coût aujourd'hui</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
