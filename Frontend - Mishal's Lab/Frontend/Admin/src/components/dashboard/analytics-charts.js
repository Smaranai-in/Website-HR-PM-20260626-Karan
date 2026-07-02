import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Activity } from "lucide-react";

const ChartCard = ({ title, icon: Icon, data, colorClass, gradientFrom, gradientTo }) => {
    const maxVal = Math.max(...data.map((d) => d.count), 4); // minimum y-axis scale of 4

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#0a1128] shadow-sm p-5 group">
            {/* Background ambient glow */}
            <div className={`absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-[0.08] dark:opacity-[0.15] blur-3xl transition-opacity group-hover:opacity-[0.15] dark:group-hover:opacity-30`} />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} bg-opacity-10 dark:bg-opacity-20`}>
                        <Icon className={`h-4 w-4 text-white`} />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">{title}</h3>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md self-start sm:self-auto">Last 14 Days</div>
            </div>

            <div className="relative h-36 w-full flex items-end justify-between gap-1 mt-4">
                {/* Y-axis grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-t border-b border-slate-100 dark:border-slate-800/50">
                    <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50" />
                    <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50" />
                </div>

                {data.map((d, i) => {
                    // Ensure a minimum height of 4% so empty days are visible as tiny blips
                    const heightPct = Math.max((d.count / maxVal) * 100, 4);
                    const isZero = d.count === 0;

                    return (
                        <div key={d.date} className="relative flex-1 min-w-0 flex flex-col items-center group/bar h-full justify-end z-10">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-20">
                                <div className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap flex flex-col items-center">
                                    <span className="text-[12px] leading-none mb-0.5">{d.count}</span>
                                    <span className="text-[8px] opacity-70 font-medium uppercase tracking-wider">{new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-100" />
                                </div>
                            </div>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${heightPct}%`, opacity: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
                                className={`w-full max-w-[12px] rounded-t-sm transition-all duration-300 ${isZero ? 'bg-slate-200 dark:bg-slate-800 group-hover/bar:bg-slate-300 dark:group-hover/bar:bg-slate-700' : `bg-gradient-to-t ${gradientFrom} ${gradientTo} shadow-sm group-hover/bar:brightness-110`}`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export function AnalyticsCharts({ created, completed, developers }) {
    return (
        <section className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard 
                    title="Tasks Created" 
                    icon={Activity} 
                    data={created} 
                    gradientFrom="from-blue-500" 
                    gradientTo="to-indigo-500" 
                />
                <ChartCard 
                    title="Tasks Completed" 
                    icon={CheckCircle2} 
                    data={completed} 
                    gradientFrom="from-emerald-400" 
                    gradientTo="to-teal-500" 
                />
            </div>

            <div>
                <div className="flex items-center gap-2 mb-4 mt-6">
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Developer Performance</h3>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {developers.map((d, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            key={d.developerId} 
                            className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#0a1128] p-5 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            {/* Glass reflection */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]" title={d.developerName}>{d.developerName}</div>
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{d.employeeId ?? "Intern"}</div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-600">{d.progress}%</div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${d.progress}%` }}
                                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
                                    >
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30 mix-blend-overlay" />
                                    </motion.div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
                                        <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Assigned</span>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{d.total}</span>
                                    </div>
                                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl px-3 py-2 border border-emerald-100/50 dark:border-emerald-800/30 flex flex-col items-center">
                                        <span className="block text-[9px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-widest mb-1">Delivered</span>
                                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{d.completed}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
