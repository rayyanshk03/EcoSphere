import { AppLayout } from '@/components/layout/AppLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Leaf, Users, ShieldCheck, TrendingUp, Plus, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEcoSphere } from '@/store/EcoSphereContext';
import { getOrgESGSummary } from '@/services/scoringService';
import { useState } from 'react';
import { useLocation } from 'wouter';

// Import reused modals (Prompt 10)
import { AddTransactionModal } from './Environmental';
import { CreateCampaignModal } from './Social';
import { ReportIssueModal } from './Governance';

export default function Dashboard() {
  const { activeDepartments, activeHistory, activeTransactions, state } = useEcoSphere();
  const [, setLocation] = useLocation();

  // Modal toggle states
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showCreateCsrModal, setShowCreateCsrModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);

  // Compute dynamic summary metrics based on active weights (Prompt 2)
  const esgSummary = getOrgESGSummary(activeDepartments, activeHistory, state.settings);

  // Dynamic greeting based on server local time (Prompt 4)
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';
  const firstName = 'Jane'; // Jane Doe from sidebar

  // Formatted date subtitle (Prompt 4)
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (esgSummary.overall.score / 100) * circumference;

  const renderChangeBadge = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
        isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
      }`}>
        {isPositive ? (
          <ArrowUpRight className="w-3 h-3 mr-0.5 text-green-600" />
        ) : (
          <ArrowDownRight className="w-3 h-3 mr-0.5 text-red-600" />
        )}
        {isPositive ? `+${change}%` : `${change}%`}
      </div>
    );
  };

  // Sort and filter the 4 most recent Carbon Transactions (Prompt 8)
  const recentTransactions = [...activeTransactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  return (
    <AppLayout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-6"
      >
        {/* HERO BANNER */}
        <motion.div variants={item} className="bg-gradient-to-r from-[#F0FBF4] to-[#E8F5EE] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">{greeting}, {firstName}</h1>
            <p className="text-gray-500">Here is your ESG performance summary for {formattedDate}.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Background ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="40" stroke="#E8EDE6" strokeWidth="8" fill="none" />
                <circle 
                  cx="64" cy="64" r="40" 
                  stroke="#166534" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  style={{ strokeDasharray: circumference, strokeDashoffset }}
                />
              </svg>
              <div className="text-center z-10 flex items-baseline">
                <span className="text-3xl font-bold text-[#166534]">{esgSummary.overall.score}</span>
                <span className="text-gray-400 font-medium">/100</span>
              </div>
            </div>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-2">OVERALL ESG</span>
          </div>
        </motion.div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Environmental */}
          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#16a34a]/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#16a34a]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Environmental</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#16a34a]">{esgSummary.environmental.score}</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#16a34a] rounded-full" style={{ width: `${esgSummary.environmental.score}%` }}></div>
                </div>
                {renderChangeBadge(esgSummary.environmental.change)}
              </div>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#be185d]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#be185d]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Social</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#be185d]">{esgSummary.social.score}</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#be185d] rounded-full" style={{ width: `${esgSummary.social.score}%` }}></div>
                </div>
                {renderChangeBadge(esgSummary.social.change)}
              </div>
            </div>
          </motion.div>

          {/* Governance */}
          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#b45309]/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#b45309]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Governance</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#b45309]">{esgSummary.governance.score}</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#b45309] rounded-full" style={{ width: `${esgSummary.governance.score}%` }}></div>
                </div>
                {renderChangeBadge(esgSummary.governance.change)}
              </div>
            </div>
          </motion.div>

          {/* Overall */}
          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#166534]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#166534]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Overall</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#166534]">{esgSummary.overall.score}</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#166534] rounded-full" style={{ width: `${esgSummary.overall.score}%` }}></div>
                </div>
                {renderChangeBadge(esgSummary.overall.change)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts & Department panel Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Area trend chart mapping (Prompt 6) */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full flex flex-col p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827]">ESG Score Trend</h3>
                <p className="text-sm text-gray-500 mt-1">Company-wide aggregated score progression over 12 months</p>
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeHistory} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="esgGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="transparent" 
                      tick={{ fill: '#9ca3af', fontSize: 11 }} 
                      tickFormatter={(tick) => {
                        const [year, month] = tick.split('-');
                        const d = new Date(parseInt(year), parseInt(month) - 1, 1);
                        return d.toLocaleDateString('en-US', { month: 'short' });
                      }}
                    />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #E8EDE6', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                      itemStyle={{ color: '#111827', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="overallScore" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#esgGradient)" activeDot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Department ESG rollups (Prompt 7) */}
          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full flex flex-col p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#111827]">Department ESG</h3>
                <p className="text-sm text-gray-500 mt-1">Click a department code to inspect logs and transactions</p>
              </div>
              
              <div className="space-y-4 flex-grow flex flex-col justify-center">
                {activeDepartments.map((dept: any) => {
                  const score = dept.esgOverall ?? 75;
                  const colorClass = score >= 75 ? 'bg-green-600' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
                  return (
                    <button 
                      key={dept.id}
                      onClick={() => setLocation(`/environmental?tab=transactions&departmentId=${dept.id}`)}
                      className="w-full text-left flex items-center gap-4 group p-2 hover:bg-green-50/50 rounded-xl transition"
                    >
                      <span className="w-10 font-bold text-gray-400 group-hover:text-green-700 transition-colors text-sm uppercase">{dept.code}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                        <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${score}%` }} />
                      </div>
                      <span className="w-10 text-right font-bold text-gray-700 text-sm">{score}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Transactions (Prompts 8 & 9) */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#111827]">Recent Carbon Transactions</h3>
                <button 
                  onClick={() => setLocation('/environmental?tab=transactions')}
                  className="text-xs font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 transition"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Fuel Type</th>
                      <th className="px-6 py-4 font-medium">Department</th>
                      <th className="px-6 py-4 font-medium">Usage</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentTransactions.map((tx) => {
                      const progColor = tx.progress > 100 ? 'bg-red-500' : tx.progress >= 90 ? 'bg-amber-500' : 'bg-green-600';
                      return (
                        <tr key={tx.id} className="bg-white hover:bg-green-50/40 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-900">{tx.fuelType}</td>
                          <td className="px-6 py-4 text-gray-500 font-medium">{tx.department}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${progColor}`} 
                                  style={{ width: `${Math.min(tx.progress, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-500">{tx.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              tx.status === 'On Track' ? 'bg-green-50 text-green-700 border-green-200' :
                              tx.status === 'At Risk' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Quick Actions Panel (Prompt 10) */}
          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full flex flex-col p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827]">Quick Actions</h3>
                <p className="text-sm text-gray-500 mt-1">Shortcuts to launch workflows across all active modules</p>
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {/* Action 1: Add Carbon Transaction */}
                <button 
                  onClick={() => setShowAddTxModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-800 transition-colors">Add Carbon Transaction</h4>
                      <p className="text-xs text-gray-400">Log manual fuel usage data</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-700 group-hover:translate-x-0.5 transition" />
                </button>

                {/* Action 2: New CSR Activity */}
                <button 
                  onClick={() => setShowCreateCsrModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">New CSR Activity</h4>
                      <p className="text-xs text-gray-400">Launch a community campaign</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition" />
                </button>

                {/* Action 3: Log Compliance Issue */}
                <button 
                  onClick={() => setShowReportIssueModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-800 transition-colors">Log Compliance Issue</h4>
                      <p className="text-xs text-gray-400">Report audit safety exception</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-700 group-hover:translate-x-0.5 transition" />
                </button>

                {/* Action 4: View Latest Report */}
                <button 
                  onClick={() => setLocation('/reports')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">View Latest Report</h4>
                      <p className="text-xs text-gray-400">Access annual ESG disclosures</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Render Reused Modals inline */}
      {showAddTxModal && (
        <AddTransactionModal onClose={() => setShowAddTxModal(false)} />
      )}
      {showCreateCsrModal && (
        <CreateCampaignModal onClose={() => setShowCreateCsrModal(false)} />
      )}
      {showReportIssueModal && (
        <ReportIssueModal onClose={() => setShowReportIssueModal(false)} />
      )}
    </AppLayout>
  );
}