"use client"

import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { GlassCard } from "@/components/ui/glass-card"

export function TrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <GlassCard className="h-[400px] w-full p-6 flex flex-col items-center justify-center text-white/40">
        <h3 className="text-lg font-semibold mb-2">Yearly Financial Trends</h3>
        <p>No data available to display chart.</p>
      </GlassCard>
    )
  }

  const chartData = data.map(item => ({
    name: new Date(0, item.month - 1).toLocaleString('default', { month: 'short' }),
    Income: item.totalIncome,
    Expense: item.totalPrimary + item.totalSecondary,
    Profit: item.totalProfit
  }))

  return (
    <GlassCard className="h-[400px] w-full p-6 flex flex-col">
      <h3 className="mb-6 text-lg font-semibold text-white/80">Yearly Financial Trends</h3>
      
      {/* FIX: We replaced flex-1 with a specific height (h-[300px]). 
         This forces the container to exist immediately, preventing the width(-1) error.
      */}
      <div className="w-full h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, "Amount"]}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
            <Area type="monotone" dataKey="Expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}