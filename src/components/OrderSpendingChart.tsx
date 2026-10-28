import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { Order } from '../lib/types';
import { Language } from '../lib/translations';

interface OrderSpendingChartProps {
  orders: Order[];
  lang: Language;
}

export const OrderSpendingChart: React.FC<OrderSpendingChartProps> = ({ orders, lang }) => {
  // Aggregate spending by day
  const { chartData, totalSpent, avgOrder, orderCount } = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { chartData: [], totalSpent: 0, avgOrder: 0, orderCount: 0 };
    }

    // Sort orders chronologically
    const sorted = [...orders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group spending by date
    const groupedMap = new Map<string, { date: string; displayDate: string; amount: number; count: number }>();

    sorted.forEach((order) => {
      const d = new Date(order.createdAt);
      // Format as YYYY-MM-DD for grouping
      const key = isNaN(d.getTime()) 
        ? 'Recent' 
        : d.toISOString().split('T')[0];

      // Format as DD/MM for display
      const displayDate = isNaN(d.getTime())
        ? 'Now'
        : `${d.getDate()}/${d.getMonth() + 1}`;

      const existing = groupedMap.get(key);
      if (existing) {
        existing.amount += order.total;
        existing.count += 1;
      } else {
        groupedMap.set(key, {
          date: key,
          displayDate,
          amount: order.total,
          count: 1,
        });
      }
    });

    const data = Array.from(groupedMap.values());
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const count = orders.length;
    const avg = count > 0 ? Math.round(total / count) : 0;

    return {
      chartData: data,
      totalSpent: total,
      avgOrder: avg,
      orderCount: count,
    };
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
          {lang === 'th' ? 'สถิติการสั่งซื้อ (ยอดใช้จ่าย)' : 'Order Spending Overview'}
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 italic max-w-xs mx-auto">
          {lang === 'th' 
            ? 'สั่งซื้อสินค้าเพื่อเริ่มติดตามแนวโน้มยอดการใช้จ่ายของคุณ' 
            : 'Place your first order to see spending trends visualized over time.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-5 transition-all">
      {/* Header and Summary Stat Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
              {lang === 'th' ? 'วิเคราะห์ยอดการสั่งซื้อ' : 'Order Spending Over Time'}
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {lang === 'th' ? 'สถิติสะสมจากออเดอร์ทั้งหมดของคุณ' : 'Visualized spending trends from recent orders'}
            </p>
          </div>
        </div>

        {/* Quick Badge */}
        <span className="self-start sm:self-auto text-[10px] font-black px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full">
          {orderCount} {lang === 'th' ? 'คำสั่งซื้อ' : 'Orders'}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
            <DollarSign className="w-3 h-3 text-rose-500" />
            <span>{lang === 'th' ? 'ยอดรวม' : 'Total'}</span>
          </div>
          <div className="text-sm font-black text-rose-500 mt-0.5">
            ฿{totalSpent}
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
            <ShoppingBag className="w-3 h-3 text-sky-500" />
            <span>{lang === 'th' ? 'เฉลี่ย/บิล' : 'Avg/Order'}</span>
          </div>
          <div className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
            ฿{avgOrder}
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
            <Calendar className="w-3 h-3 text-emerald-500" />
            <span>{lang === 'th' ? 'ช่วงเวลา' : 'Timeline'}</span>
          </div>
          <div className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
            {chartData.length} {lang === 'th' ? 'วัน' : 'Days'}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-52 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="orderSpendingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.15} />
            <XAxis 
              dataKey="displayDate" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickFormatter={(v) => `฿${v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium">{item.date}</div>
                      <div className="font-black text-rose-400 text-sm mt-0.5">
                        ฿{item.amount}
                      </div>
                      <div className="text-[10px] text-slate-300">
                        {item.count} {lang === 'th' ? 'ออเดอร์' : 'orders'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#f43f5e" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#orderSpendingGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
