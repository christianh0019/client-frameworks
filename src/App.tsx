import { useState } from 'react';
import { Search, FileText, Play, Clock, ArrowRight, LayoutGrid, List } from 'lucide-react';

// SaaS-style Components

const TabNav = ({ active, onChange }: { active: string, onChange: (val: string) => void }) => (
    <div className="flex items-center space-x-6 border-b border-saas-border mb-6">
        {['Process Library', 'Video Tutorials', 'Resources'].map((tab) => (
            <button
                key={tab}
                onClick={() => onChange(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${active === tab
                        ? 'border-saas-blue text-saas-blue'
                        : 'border-transparent text-saas-text-secondary hover:text-saas-text-primary hover:border-gray-300'
                    }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

const SOPCard = ({ title, description, category, lastUpdated }: { title: string, description: string, category: string, lastUpdated: string }) => (
    <div className="bg-white border border-saas-border rounded-lg p-5 hover:shadow-card hover:border-gray-300 transition-all cursor-pointer group flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-50 rounded text-saas-blue">
                    <FileText size={18} />
                </div>
                <span className="text-xs font-medium text-saas-text-secondary uppercase tracking-wider">{category}</span>
            </div>
        </div>
        <h3 className="text-lg font-semibold text-saas-text-primary mb-2 group-hover:text-saas-blue transition-colors line-clamp-1">{title}</h3>
        <p className="text-sm text-saas-text-secondary mb-4 line-clamp-2 flex-grow">{description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <span className="text-xs text-gray-400">Updated {lastUpdated}</span>
            <div className="flex items-center text-sm font-medium text-saas-blue opacity-0 group-hover:opacity-100 transition-opacity">
                View
                <ArrowRight size={14} className="ml-1" />
            </div>
        </div>
    </div>
);

const VideoCard = ({ title, duration, author }: { title: string, duration: string, author: string }) => (
    <div className="bg-white border border-saas-border rounded-lg overflow-hidden hover:shadow-card hover:border-gray-300 transition-all cursor-pointer group">
        <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gray-200"></div> {/* Placeholder for thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={16} className="text-saas-blue ml-0.5 fill-saas-blue" />
                </div>
            </div>
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] font-medium text-white flex items-center">
                <Clock size={10} className="mr-1" />
                {duration}
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-medium text-saas-text-primary mb-1 group-hover:text-saas-blue transition-colors line-clamp-1">{title}</h3>
            <p className="text-xs text-saas-text-secondary">By {author}</p>
        </div>
    </div>
);

const ViewToggle = ({ mode, setMode }: { mode: 'grid' | 'list', setMode: (m: 'grid' | 'list') => void }) => (
    <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
        <button
            onClick={() => setMode('grid')}
            className={`p-1.5 rounded ${mode === 'grid' ? 'bg-white shadow-sm text-saas-text-primary' : 'text-saas-text-secondary hover:text-saas-text-primary'}`}
        >
            <LayoutGrid size={16} />
        </button>
        <button
            onClick={() => setMode('list')}
            className={`p-1.5 rounded ${mode === 'list' ? 'bg-white shadow-sm text-saas-text-primary' : 'text-saas-text-secondary hover:text-saas-text-primary'}`}
        >
            <List size={16} />
        </button>
    </div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState('Process Library');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const sops = [
        { title: "New Client Onboarding", description: "Standard procedure for welcoming and setting up new clients in the system.", category: "Onboarding", lastUpdated: "2 days ago" },
        { title: "Monthly Reporting Workflow", description: "How to generate, review, and send monthly performance reports.", category: "Reporting", lastUpdated: "1 week ago" },
        { title: "Facebook Ad Campaign Setup", description: "Checklist for launching a new conversion campaign including pixel verification.", category: "Media Buying", lastUpdated: "3 weeks ago" },
        { title: "Lead Qualification Script", description: "Phone script for qualifying inbound leads before booking appointments.", category: "Sales", lastUpdated: "1 month ago" },
        { title: "CRM Pipeline Management", description: "Rules for moving opportunities between stages in the sales pipeline.", category: "Sales", lastUpdated: "2 months ago" },
        { title: "Content Calendar Template", description: "How to use the content calendar to plan social media posts.", category: "Marketing", lastUpdated: "3 months ago" },
    ];

    const videos = [
        { title: "Dashboard Overview Walkthrough", duration: "05:30", author: "Christian H." },
        { title: "How to Launch Your First Ad", duration: "12:45", author: "Sarah J." },
        { title: "Setting Up Automations", duration: "08:15", author: "Mike T." },
        { title: "Understanding Analytics", duration: "06:20", author: "Christian H." },
    ];

    return (
        <div className="min-h-screen bg-saas-bg font-sans text-saas-text-primary selection:bg-blue-100 selection:text-blue-900 p-6">

            {/* Top Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <TabNav active={activeTab} onChange={setActiveTab} />

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-saas-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-white border border-saas-border text-sm text-saas-text-primary rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:border-saas-blue focus:ring-1 focus:ring-saas-blue w-48 transition-all"
                        />
                    </div>
                    <ViewToggle mode={viewMode} setMode={setViewMode} />
                </div>
            </div>

            <main className="max-w-7xl mx-auto">
                {/* Content */}
                {activeTab === 'Process Library' && (
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                        {sops.map((sop, idx) => (
                            <SOPCard key={idx} {...sop} />
                        ))}
                    </div>
                )}

                {activeTab === 'Video Tutorials' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {videos.map((video, idx) => (
                            <VideoCard key={idx} {...video} />
                        ))}
                    </div>
                )}

                {activeTab === 'Resources' && (
                    <div className="flex flex-col items-center justify-center py-20 text-saas-text-secondary">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>No additional resources found.</p>
                    </div>
                )}

            </main>
        </div>
    );
};

export default App;
