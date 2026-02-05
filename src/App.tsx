import { useState } from 'react';
import { Search, FileText, Play, Clock, ArrowRight, LayoutGrid, List, ArrowLeft, ChevronRight, CheckSquare } from 'lucide-react';

// Types
type ViewState = 'library' | 'sop-detail' | 'video-detail';

interface SOP {
    title: string;
    description: string;
    category: string;
    content?: string[]; // Mock content for the detail view
}

interface Video {
    title: string;
    duration: string;
    category: string;
    src?: string; // Placeholder for video source
}

// Components

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

const SOPCard = ({ sop, onClick }: { sop: SOP, onClick: () => void }) => (
    <div onClick={onClick} className="bg-white border border-saas-border rounded-lg p-5 hover:shadow-card hover:border-gray-300 transition-all cursor-pointer group flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-50 rounded text-saas-blue">
                    <FileText size={18} />
                </div>
                <span className="text-xs font-medium text-saas-text-secondary uppercase tracking-wider">{sop.category}</span>
            </div>
        </div>
        <h3 className="text-lg font-semibold text-saas-text-primary mb-2 group-hover:text-saas-blue transition-colors line-clamp-1">{sop.title}</h3>
        <p className="text-sm text-saas-text-secondary mb-4 flex-grow whitespace-pre-line line-clamp-3">{sop.description}</p>

        <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center text-sm font-medium text-saas-blue opacity-0 group-hover:opacity-100 transition-opacity">
                Read SOP
                <ArrowRight size={14} className="ml-1" />
            </div>
        </div>
    </div>
);

const VideoCard = ({ video, onClick }: { video: Video, onClick: () => void }) => (
    <div onClick={onClick} className="bg-white border border-saas-border rounded-lg overflow-hidden hover:shadow-card hover:border-gray-300 transition-all cursor-pointer group">
        <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gray-200"></div> {/* Placeholder for thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={16} className="text-saas-blue ml-0.5 fill-saas-blue" />
                </div>
            </div>
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] font-medium text-white flex items-center">
                <Clock size={10} className="mr-1" />
                {video.duration}
            </div>
        </div>
        <div className="p-4">
            <div className="flex items-center mb-1">
                <span className="text-[10px] font-medium text-saas-text-secondary uppercase tracking-wider border border-gray-200 px-1 rounded">{video.category}</span>
            </div>
            <h3 className="font-medium text-saas-text-primary group-hover:text-saas-blue transition-colors line-clamp-2">{video.title}</h3>
        </div>
    </div>
);

// Detail Views

const SOPDetail = ({ sop, onBack }: { sop: SOP, onBack: () => void }) => {
    // Parse description bullets to create mock "content"
    const contentPoints = sop.description.split('\n').map(l => l.replace('• ', '').trim()).filter(Boolean);

    return (
        <div className="min-h-[calc(100vh-48px)] animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12">
            {/* Breadcrumb / Nav */}
            <div className="max-w-5xl mx-auto py-6 flex items-center text-sm text-saas-text-secondary">
                <button onClick={onBack} className="hover:text-saas-text-primary flex items-center transition-colors">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Library
                </button>
                <ChevronRight size={14} className="mx-2 text-gray-300" />
                <span className="text-saas-text-primary font-medium truncate">{sop.title}</span>
            </div>

            {/* Document Content */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-saas-border overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100"></div>

                <article className="px-12 py-10 -mt-12 relative">
                    <div className="mb-8">
                        <div className="inline-flex items-center space-x-2 mb-4 bg-white p-1 pr-3 rounded-full shadow-sm border border-gray-100">
                            <div className="p-1 bg-blue-100 rounded-full text-saas-blue">
                                <FileText size={14} />
                            </div>
                            <span className="text-xs font-semibold text-saas-text-secondary uppercase tracking-wide">
                                {sop.category}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">{sop.title}</h1>

                        <div className="flex items-center space-x-6 text-sm text-gray-500 border-b border-gray-100 pb-6">
                            <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-2">S</div>
                                <span className="font-medium text-gray-700">System Admin</span>
                            </div>
                            <div className="flex items-center">
                                <Clock size={14} className="mr-1.5" />
                                <span>Updated 2 days ago</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-saas-blue">
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            This Standard Operating Procedure outlines the verified process for <strong>{sop.title}</strong>.
                            Follow the steps below to ensure consistency and quality.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                                <CheckSquare size={16} className="mr-2 text-saas-blue" />
                                Key Objectives
                            </h3>
                            <ul className="space-y-3 m-0 p-0 list-none">
                                {contentPoints.map((point, i) => (
                                    <li key={i} className="flex items-start p-0 m-0">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-saas-blue mr-3 flex-shrink-0"></div>
                                        <span className="text-gray-700">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <h3>Procedure Steps</h3>
                        <ol className="space-y-4">
                            <li><strong>Preparation:</strong> Ensure you have all necessary access and tools ready before beginning this workflow.</li>
                            <li><strong>Execution:</strong> Follow the checklist items above in sequential order.</li>
                            <li><strong>Verification:</strong> Double-check your work against the quality standards defined in the {sop.category} guidelines.</li>
                            <li><strong>Documentation:</strong> Log any variations or issues in the CRM notes field.</li>
                        </ol>

                        <div className="mt-10 p-5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900 flex items-start">
                            <div className="mr-3 mt-0.5 text-blue-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>
                            <div>
                                <strong className="block mb-1 text-blue-700">Important Note</strong>
                                This process is critical for maintaining our operational standards. If you encounter any blockers, escalate to your manager immediately.
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

const VideoDetail = ({ video, onBack }: { video: Video, onBack: () => void }) => (
    <div className="min-h-[calc(100vh-48px)] animate-in fade-in zoom-in-95 duration-300 flex flex-col pb-12">
        {/* Breadcrumb / Nav */}
        <div className="max-w-6xl mx-auto w-full py-6 flex items-center text-sm text-saas-text-secondary">
            <button onClick={onBack} className="hover:text-saas-text-primary flex items-center transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to Tutorials
            </button>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            <span className="text-saas-text-primary font-medium truncate">{video.title}</span>
        </div>

        <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-sm border border-saas-border overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center relative group">
                {/* Mock Player UI */}
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer border border-white/20 shadow-xl">
                        <Play size={40} className="text-white fill-white ml-2" />
                    </div>
                </div>

                {/* Mock Controls */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/90 to-transparent p-6 flex items-end">
                    <div className="w-full flex items-center space-x-4">
                        <button className="text-white hover:text-saas-blue transition-colors">
                            <Play size={24} className="fill-current" />
                        </button>
                        <div className="h-1.5 bg-gray-600/50 flex-1 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all">
                            <div className="h-full w-1/3 bg-saas-blue"></div>
                        </div>
                        <span className="text-sm text-white font-medium font-mono">{video.duration}</span>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wide">
                                {video.category}
                            </span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-500 text-xs font-medium">Updated recently</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">{video.title}</h1>
                        <p className="text-gray-600 max-w-2xl">
                            In this tutorial, we visualize the core concepts of the <strong>{video.category}</strong> workflow.
                            Watch this to understand the practical application of our SOPs.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <button className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">
                            <CheckSquare size={16} className="mr-2 text-gray-500" />
                            Mark as Watched
                        </button>
                    </div>
                </div>
            </div>
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
    const [activeView, setActiveView] = useState<ViewState>('library');
    const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const sops: SOP[] = [
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

    const videos: Video[] = [
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

    // Logic to handle view switching
    const handleSOPClick = (sop: SOP) => {
        setSelectedSOP(sop);
        setActiveView('sop-detail');
    };

    const handleVideoClick = (video: Video) => {
        setSelectedVideo(video);
        setActiveView('video-detail');
    };

    const goBack = () => {
        setActiveView('library');
        setSelectedSOP(null);
        setSelectedVideo(null);
    };

    // Render Logic
    if (activeView === 'sop-detail' && selectedSOP) {
        return <SOPDetail sop={selectedSOP} onBack={goBack} />;
    }

    if (activeView === 'video-detail' && selectedVideo) {
        return <VideoDetail video={selectedVideo} onBack={goBack} />;
    }

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
                            <SOPCard key={idx} sop={sop} onClick={() => handleSOPClick(sop)} />
                        ))}
                    </div>
                )}

                {activeTab === 'Video Tutorials' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {videos.map((video, idx) => (
                            <VideoCard key={idx} video={video} onClick={() => handleVideoClick(video)} />
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
