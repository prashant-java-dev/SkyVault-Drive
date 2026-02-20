
import React, { useState } from 'react';
import { Cloud, Github, Link2, Monitor, Database } from 'lucide-react';

const Settings = () => {
    const [integrations, setIntegrations] = useState([
        { name: 'Google Drive', icon: <Cloud className="text-blue-500" />, connected: true, email: 'user@gmail.com' },
        { name: 'GitHub Sync', icon: <Github className="text-slate-900 dark:text-white" />, connected: false, email: null },
        { name: 'OneDrive Enterprise', icon: <Link2 className="text-blue-600" />, connected: true, email: 'corp@outlook.com' },
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black dark:text-white tracking-tight">System <span className="text-red-600">Settings</span></h1>
                <p className="text-slate-500 font-medium mt-2">Manage your cloud connections and application preferences.</p>
            </div>

            <div className="space-y-8">
                <section className="bg-white dark:bg-[#121212] p-10 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm">
                    <h3 className="text-xl font-black dark:text-white mb-10 flex items-center gap-4">
                        <Link2 className="text-red-600" size={24} />
                        Cloud Integrations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map((item, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-red-600/30 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                                        {item.icon}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                        {item.connected ? 'Connected' : 'Setup'}
                                    </div>
                                </div>
                                <h4 className="font-black dark:text-white mb-1">{item.name}</h4>
                                <p className="text-xs text-slate-500 font-medium mb-6">{item.email || 'No account linked'}</p>
                                <button className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${item.connected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-900 text-white dark:bg-white dark:text-black'}`}>
                                    {item.connected ? 'Disconnect' : 'Connect Account'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm">
                        <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-3">
                            <Monitor className="text-red-600" size={20} />
                            Interface Config
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Compact Sidebar', enabled: false },
                                { label: 'High Contrast Mode', enabled: true },
                                { label: 'Animation Smoothness', enabled: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-bold dark:text-white">{item.label}</span>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.enabled ? 'bg-red-600' : 'bg-slate-200 dark:bg-white/10'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm">
                        <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-3">
                            <Database className="text-red-600" size={20} />
                            Storage Preferences
                        </h3>
                        <div className="space-y-4">
                            <p className="text-xs text-slate-500 font-medium">Auto-cleanup old versions after:</p>
                            <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold p-4 dark:text-white outline-none">
                                <option>30 Days</option>
                                <option>90 Days</option>
                                <option>Never (Always Versioned)</option>
                            </select>
                            <div className="pt-4 flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5 accent-red-600 rounded" defaultChecked />
                                <span className="text-sm font-bold dark:text-white">Enable End-to-End Encryption</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
