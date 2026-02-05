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

const SOPCard = ({ title, description, category }: { title: string, description: string, category: string }) => (
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
        <p className="text-sm text-saas-text-secondary mb-4 flex-grow whitespace-pre-line">{description}</p>

        <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center text-sm font-medium text-saas-blue opacity-0 group-hover:opacity-100 transition-opacity">
                View
                <ArrowRight size={14} className="ml-1" />
            </div>
        </div>
    </div>
);

const VideoCard = ({ title, duration, category }: { title: string, duration: string, category: string }) => (
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
            <div className="flex items-center mb-1">
                <span className="text-[10px] font-medium text-saas-text-secondary uppercase tracking-wider border border-gray-200 px-1 rounded">{category}</span>
            </div>
            <h3 className="font-medium text-saas-text-primary group-hover:text-saas-blue transition-colors line-clamp-2">{title}</h3>
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
        {
            title: "Lead Response & Speed-to-Lead SOP",
            description: "How new leads are contacted within minutes\n• Call + text flow\n• Missed call logic\n• First 24 hour cadence",
            category: "Sales"
        },
        {
            title: "Qualification & Discovery SOP",
            description: "Budget filters\n• Timeline filters\n• Decision maker logic\n• Serious buyer signals\n• When to disqualify",
            category: "Sales"
        },
        {
            title: "Sales Pipeline Management SOP",
            description: "Pipeline stages explained\n• What “next action” always means\n• Forecasting future work\n• How nothing falls through cracks",
            category: "Sales"
        },
        {
            title: "Long-Cycle Follow-Up & Nurture SOP",
            description: "90 day cadence\n• 6–12 month nurture rhythm\n• Reactivation process\n• How automation + human touches combine",
            category: "Nurture"
        },
        {
            title: "Early Monetization SOP",
            description: "Paid consultations\n• Design agreements\n• Pre-construction packages\n• How to pitch and price them",
            category: "Finance"
        },
        {
            title: "CRM Daily Operations SOP",
            description: "Morning routine\n• Lead check process\n• Pipeline update rules\n• Task management",
            category: "Operations"
        },
        {
            title: "Weekly Growth Review SOP",
            description: "KPIs to review\n• Pipeline health\n• Lead quality checks\n• Bottleneck identification",
            category: "Management"
        },
        {
            title: "Lead Quality Feedback Loop SOP",
            description: "How to flag bad leads\n• Adjust targeting\n• Improve campaigns\n• Tighten qualification over time",
            category: "Marketing"
        },
        {
            title: "First Hire Playbook SOP",
            description: "When to hire\n• Who to hire first\n• Role responsibilities\n• Hand-off process from owner",
            category: "HR"
        },
        {
            title: "Capacity & Scaling SOP",
            description: "How many leads per month you can handle\n• When to increase spend\n• When to add team\n• How to avoid overbooking",
            category: "Growth"
        },
    ];

    const videos = [
        // Core System Walkthroughs
        { title: "How the Growth System Works (big picture)", duration: "05:00", category: "Core System" },
        { title: "How New Leads Flow Through the CRM", duration: "05:00", category: "Core System" },
        { title: "How Automations Handle Follow-Up", duration: "05:00", category: "Core System" },
        { title: "How to Update Pipeline Stages Properly", duration: "05:00", category: "Core System" },

        // Daily & Weekly Operations
        { title: "Daily Lead Management Routine", duration: "05:00", category: "Operations" },
        { title: "Weekly Pipeline Review Process", duration: "05:00", category: "Operations" },
        { title: "How to Qualify Leads Correctly", duration: "05:00", category: "Operations" },

        // Revenue & Scaling
        { title: "How to Pitch Design Agreements & Pre-Con", duration: "05:00", category: "Revenue" },
        { title: "When to Increase Lead Volume", duration: "05:00", category: "Revenue" },
        { title: "When & How to Hire Your First Sales Help", duration: "05:00", category: "Revenue" },
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
