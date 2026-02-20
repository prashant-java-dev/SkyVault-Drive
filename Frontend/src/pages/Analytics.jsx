
import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend
} from 'recharts';
import { TrendingUp, FileText, Globe, Zap, DownloadCloud } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data simulation locally to avoid missing backend endpoints
        const mockData = {
            fileTypeDistribution: [
                { name: 'Images', value: 400 },
                { name: 'Documents', value: 300 },
                { name: 'Videos', value: 300 },
                { name: 'Audio', value: 200 },
                { name: 'Archives', value: 100 }
            ],
            uploadHistory: [
                { date: 'Mon', count: 12 },
                { date: 'Tue', count: 19 },
                { date: 'Wed', count: 3 },
                { date: 'Thu', count: 5 },
                { date: 'Fri', count: 2 },
                { date: 'Sat', count: 20 },
                { date: 'Sun', count: 15 }
            ]
        };

        setTimeout(() => {
            setData(mockData);
            setLoading(false);
        }, 500);
    }, []);

    const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 p-8">
            <div>
                <h1 className="text-3xl font-black dark:text-white tracking-tight">Storage <span className="text-red-600">Statistics</span></h1>
                <p className="text-slate-500 font-medium mt-2">See how much space you are using and what files you have.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="text-red-600" />
                        <h3 className="text-lg font-black dark:text-white">Upload History</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.uploadHistory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f033" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#ef444411' }} contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid #7f1d1d' }} />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {data?.uploadHistory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === data.uploadHistory.length - 1 ? '#ef4444' : '#ef444444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Zap className="text-blue-500" />
                        <h3 className="text-lg font-black dark:text-white">File Type Breakdown</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.fileTypeDistribution}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={10}
                                    dataKey="value"
                                >
                                    {data?.fileTypeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-red-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-red-600/30">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="p-8 bg-white/10 rounded-[2rem] border border-white/20">
                        <DownloadCloud size={80} strokeWidth={1} />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <h2 className="text-3xl font-black leading-tight">Syncing is Fast</h2>
                        <p className="text-red-100 font-medium text-lg">Your current average upload speed is <span className="font-bold underline">45 MB/s</span>. Everything is running smoothly.</p>
                        <button className="px-8 py-3 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Run Checkup</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
