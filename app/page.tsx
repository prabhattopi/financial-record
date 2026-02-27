import { getDashboardData } from "./actions"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { GlassCard } from "@/components/ui/glass-card"
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react"
import { ExportButton } from "@/components/dashboard/export-button"
import { UserButton, SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs"; // Import this
export const dynamic = "force-dynamic" // Ensure fresh data on every load

export default async function Dashboard() {
  const { monthlyStats, recentTransactions, yearlyTrends } = await getDashboardData()

  // Calculate stats safely
  const income = monthlyStats?.totalIncome || 0
  const expense = (monthlyStats?.totalPrimary || 0) + (monthlyStats?.totalSecondary || 0)
  const profit = monthlyStats?.totalProfit || 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Add User Button here for easy access */}
          <SignedIn>
            <UserButton />
          </SignedIn>

          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Financial Overview
            </h1>
            <p className="text-white/60 mt-1">Track your daily wealth efficiently.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <ExportButton data={yearlyTrends} />
          <TransactionForm />
        </div>
      </div>

      {/* 1. Summary Cards (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard gradient className="relative">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Monthly Income</p>
              <h2 className="text-3xl font-bold text-white">₹{income.toFixed(2)}</h2>
            </div>
          </div>
        </GlassCard>

        <GlassCard gradient>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-rose-500/20 text-rose-400">
              <ArrowDownRight size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Monthly Expenses</p>
              <h2 className="text-3xl font-bold text-white">₹{expense.toFixed(2)}</h2>
            </div>
          </div>
        </GlassCard>

        <GlassCard gradient>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Net Profit</p>
              <h2 className="text-3xl font-bold text-white">₹{profit.toFixed(2)}</h2>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 2. Main Content Grid (Chart + Recent List) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart (Takes up 2/3 width) */}
        <div className="lg:col-span-2">
          <TrendChart data={yearlyTrends} />
        </div>

        {/* Right Column: Recent Transactions List */}
        <GlassCard className="h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-white/80 mb-4">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {recentTransactions.length === 0 ? (
              <p className="text-white/40 text-center mt-10">No transactions yet.</p>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${tx.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div>
                      <p className="text-white font-medium text-sm">{tx.title || "Untitled"}</p>
                      <p className="text-white/40 text-xs">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-sm ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}