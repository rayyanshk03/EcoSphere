import { AppLayout } from '@/components/layout/AppLayout';
import { useEcoSphere } from '@/store/EcoSphereContext';
import { motion } from 'framer-motion';
import {
  Building2, Bell, Shield, Database, Plus, Mail,
  Zap, Cpu, Wrench, CheckCircle2, Info, Percent, AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings() {
  const { activeDepartments, state, dispatch } = useEcoSphere();
  const { autoEmissionCalculation, envWeight, socWeight, govWeight, goalAtRiskAlerts, weeklyDigest, newComplianceIssues, gamificationApprovals, evidenceRequirement } = state.settings || {};

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  // Rebalances the other two weights when one is shifted so that sum is always 100
  const handleWeightChange = (key: 'envWeight' | 'socWeight' | 'govWeight', val: number) => {
    const targetVal = Math.max(0, Math.min(100, val));
    const diff = 100 - targetVal;
    
    const otherKeys = (['envWeight', 'socWeight', 'govWeight'] as const).filter(k => k !== key);
    const weight1 = (state.settings || {})[otherKeys[0]] || 0;
    const weight2 = (state.settings || {})[otherKeys[1]] || 0;
    const otherSum = weight1 + weight2;

    let val1 = 0;
    let val2 = 0;
    if (otherSum > 0) {
      val1 = Math.round((weight1 / otherSum) * diff);
      val2 = diff - val1;
    } else {
      val1 = Math.round(diff / 2);
      val2 = diff - val1;
    }

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        [key]: targetVal,
        [otherKeys[0]]: val1,
        [otherKeys[1]]: val2,
      },
    });
  };

  return (
    <AppLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Configure application defaults, organizational structure, and integrations.</p>
        </div>

        <Tabs defaultValue="departments" className="w-full flex flex-col md:flex-row gap-8">
          {/* Sidebar nav */}
          <TabsList className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-2 flex flex-col h-auto gap-1 items-stretch w-full md:w-64 shrink-0 border border-gray-100">
            <TabsTrigger value="departments" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Building2 className="w-4 h-4 mr-3" /> Departments
            </TabsTrigger>
            <TabsTrigger value="emission-calc" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Zap className="w-4 h-4 mr-3" /> Emission Calculation
            </TabsTrigger>
            <TabsTrigger value="esg-weights" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Percent className="w-4 h-4 mr-3" /> ESG Configuration
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Bell className="w-4 h-4 mr-3" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Shield className="w-4 h-4 mr-3" /> Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Database className="w-4 h-4 mr-3" /> Integrations
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">

            {/* ── Departments ──────────────────────────────────────────── */}
            <TabsContent value="departments" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Organizational Structure</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage departments and heads for accurate ESG reporting.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0">
                    <Plus className="w-4 h-4" /> Add Dept
                  </button>
                </div>
                <div className="overflow-x-auto p-6">
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-4">Name</th>
                          <th className="px-5 py-4">Code</th>
                          <th className="px-5 py-4">Head</th>
                          <th className="px-5 py-4">Parent Dept</th>
                          <th className="px-5 py-4 text-right">Employees</th>
                          <th className="px-5 py-4 text-right">ESG Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {activeDepartments.map((dept: any) => (
                          <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 font-bold text-gray-900">{dept.name}</td>
                            <td className="px-5 py-4 font-mono font-medium text-gray-500 text-xs">{dept.code}</td>
                            <td className="px-5 py-4 text-gray-600 font-medium">{dept.head}</td>
                            <td className="px-5 py-4 text-gray-400 text-xs">{dept.parentDeptId ?? '—'}</td>
                            <td className="px-5 py-4 text-right text-gray-600 font-medium">{dept.employeeCount}</td>
                            <td className="px-5 py-4 text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                {dept.esgOverall} / 100
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Emission Calculation ─────────────────────────────────── */}
            <TabsContent value="emission-calc" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Emission Calculation Mode</h3>
                  <p className="text-sm text-gray-500 mt-1">Control how carbon transactions are generated across the platform.</p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-6 p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="flex gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${autoEmissionCalculation ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-400'}`}>
                        {autoEmissionCalculation ? <Cpu className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Auto Emission Calculation</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          When enabled, Carbon Transactions are automatically generated from linked
                          Purchase, Manufacturing, Expense, and Fleet records by multiplying
                          <span className="font-semibold text-gray-700"> quantity × Emission Factor</span>.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-2">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={autoEmissionCalculation}
                        onChange={() => dispatch({ type: 'TOGGLE_AUTO_EMISSION' })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                    </label>
                  </div>

                  {autoEmissionCalculation ? (
                    <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
                      <div className="flex items-start gap-3">
                        <Cpu className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-violet-900">Auto-calculation is ON</p>
                          <p className="text-sm text-violet-700 mt-1 leading-relaxed">
                            The system will automatically create Carbon Transactions from raw connected events.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900">Manual Entry Mode</p>
                          <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                            Transactions must be generated manually via Environmental → Transactions → Add Record.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ── ESG Configuration (Section 5 / Prompt 13) ────────────── */}
            <TabsContent value="esg-weights" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">ESG Score Weights</h3>
                  <p className="text-sm text-gray-500 mt-1">Configure weights for dynamic rolling up of Department ESG scores (must sum to 100%).</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Environmental Weight */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                      <span>Environmental (E) Weight</span>
                      <span className="text-[#166534]">{envWeight}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100"
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#166534]"
                      value={envWeight}
                      onChange={(e) => handleWeightChange('envWeight', parseInt(e.target.value))}
                    />
                  </div>

                  {/* Social Weight */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                      <span>Social (S) Weight</span>
                      <span className="text-[#be185d]">{socWeight}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100"
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#be185d]"
                      value={socWeight}
                      onChange={(e) => handleWeightChange('socWeight', parseInt(e.target.value))}
                    />
                  </div>

                  {/* Governance Weight */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                      <span>Governance (G) Weight</span>
                      <span className="text-[#b45309]">{govWeight}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100"
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#b45309]"
                      value={govWeight}
                      onChange={(e) => handleWeightChange('govWeight', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="bg-[#f6f8f4] border border-[#e8ede6] rounded-xl p-4 flex gap-3 text-xs text-green-800 items-start">
                    <Info className="w-4.5 h-4.5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Dynamic Balancing Enabled</span>
                      Shifting any slider dynamically adjusts the other parameters proportionally so that they always sum to exactly 100%. Recalculation applies immediately.
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Notifications ────────────────────────────────────────── */}
            <TabsContent value="notifications" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Alert Preferences</h3>
                  <p className="text-sm text-gray-500 mt-1">Configure warning alert channels for the ESG Platform.</p>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    { key: 'goalAtRiskAlerts', title: 'Carbon & Goal Warning Alerts', desc: 'Trigger warnings when transactions hit At Risk or Overdue, or Goal deadlines approach.', val: goalAtRiskAlerts },
                    { key: 'weeklyDigest', title: 'Weekly ESG Digest', desc: 'Summary of company performance every Monday morning.', val: weeklyDigest },
                    { key: 'newComplianceIssues', title: 'New Compliance Issues', desc: 'Alert when high-severity compliance issues are logged.', val: newComplianceIssues },
                    { key: 'gamificationApprovals', title: 'Gamification Approvals', desc: 'Daily digest of pending employee CSR proofs.', val: gamificationApprovals },
                    { key: 'evidenceRequirement', title: 'CSR Evidence Requirement Rule', desc: 'Enforce proof of participation files for all employee challenge points approvals.', val: evidenceRequirement },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-start justify-between gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{setting.title}</p>
                          <p className="text-sm font-medium text-gray-500 mt-1 leading-relaxed">{setting.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-2">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={setting.val}
                          onChange={() => dispatch({
                            type: 'UPDATE_SETTINGS',
                            payload: { [setting.key]: !setting.val }
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ── Security ─────────────────────────────────────────────── */}
            <TabsContent value="security" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-64 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                  <Shield className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">SSO Managed Access</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">Access control mappings are administered via your primary identity provider.</p>
              </div>
            </TabsContent>

            {/* ── Integrations ─────────────────────────────────────────── */}
            <TabsContent value="integrations" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-64 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                  <Database className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Automated Integrations</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">Manage links to Salesforce Net Zero, fleet logbooks, and utility feeds.</p>
              </div>
            </TabsContent>

          </div>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}