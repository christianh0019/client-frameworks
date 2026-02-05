import { useState } from 'react';
import { Play, FileText, CheckCircle, Search, Settings, BookOpen, Video, Home, ArrowRight, Clock } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${active
            ? 'bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 text-brand-magenta border-l-2 border-brand-magenta'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
    >
        <Icon size={20} className={active ? 'text-brand-magenta' : 'text-slate-500 group-hover:text-white transition-colors'} />
        <span className="font-medium">{label}</span>
    </div>
);

const SOPCard = ({ title, description, category }: { title: string, description: string, category: string }) => (
    <div className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-brand-purple/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-brand-purple/10 group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-brand-purple/20 transition-colors">
                <FileText size={20} className="text-brand-purple group-hover:text-brand-magenta" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                {category}
            </span>
        </div>
        <h3 className="text-lg font-serif font-semibold text-white mb-2 group-hover:text-brand-magenta transition-colors">{title}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-xs text-brand-purple font-medium group-hover:text-brand-magenta">
            <span>View Procedure</span>
            <ArrowRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);

const VideoCard = ({ title, duration, thumbnail }: { title: string, duration: string, thumbnail?: string }) => (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer hover:border-brand-magenta/50 transition-all duration-300 group">
        <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
            {thumbnail ? (
                <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-50"></div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand-magenta group-hover:scale-110 transition-all duration-300">
                    <Play size={20} className="text-white fill-white ml-1" />
                </div>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs font-medium text-white flex items-center backdrop-blur-md">
                <Clock size={10} className="mr-1" />
                {duration}
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-medium text-white group-hover:text-brand-magenta transition-colors line-clamp-1">{title}</h3>
            <div className="mt-2 flex items-center space-x-2">
                <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-brand-magenta"></div>
                </div>
                <span className="text-xs text-slate-400">Not started</span>
            </div>
        </div>
    </div>
);

const App = () => {
    const [isSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('library');

    // SOP Data
    const sops = [
        { title: "Client Onboarding", description: "Step-by-step process for welcoming new clients and setting up their accounts.", category: "Admin" },
        { title: "Project Kickoff", description: "Initial meeting agenda and checklist for starting a new construction project.", category: "Project Mgmt" },
        { title: "Change Order Process", description: "How to document, approve, and billing for changes during construction.", category: "Finance" },
        { title: "Site Inspection", description: "Standard checklist for weekly site visits and safety inspections.", category: "Field" },
        { title: "Client Communication", description: "Guidelines for updates, emails, and handling client questions.", category: "Admin" },
        { title: "Final Walkthrough", description: "Pre-handover inspection and punch list creation procedure.", category: "Project Mgmt" },
    ];

    const videos = [
        { title: "Navigating the Dashboard", duration: "4:30" },
        { title: "How to Upload Documents", duration: "2:15" },
        { title: "Understanding Billing Cycles", duration: "5:45" },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">

            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-20`}
            >
                <div className="p-4 flex items-center justify-between border-b border-slate-800/50 h-16">
                    {isSidebarOpen ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center shadow-lg shadow-brand-purple/20">
                                <span className="font-serif font-bold text-white text-lg">C</span>
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight">Client<span className="text-brand-magenta">FW</span></span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center">
                            <span className="font-serif font-bold text-white text-lg">C</span>
                        </div>
                    )}
                    {/* <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white hidden lg:block">
            <Menu size={18} />
          </button> */}
                </div>

                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2">
                    <SidebarItem icon={Home} label={isSidebarOpen ? "Dashboard" : ""} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={BookOpen} label={isSidebarOpen ? "Process Library" : ""} active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
                    <SidebarItem icon={Video} label={isSidebarOpen ? "Video Tutorials" : ""} active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} />
                    <SidebarItem icon={CheckCircle} label={isSidebarOpen ? "Checklists" : ""} active={activeTab === 'checklists'} onClick={() => setActiveTab('checklists')} />
                </div>

                <div className="p-4 border-t border-slate-800/50">
                    <SidebarItem icon={Settings} label={isSidebarOpen ? "Settings" : ""} onClick={() => { }} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-serif font-semibold text-white">Process Library</h1>
                        <p className="text-xs text-slate-400">Access all your standard operating procedures</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search procedures..."
                                className="bg-slate-800 border border-slate-700 text-sm text-white rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple w-64 transition-all"
                            />
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8">

                    {/* Welcome/Stats Section */}
                    <section className="mb-8">
                        <div className="bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 border border-brand-purple/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-serif font-bold text-white mb-2">Welcome back, Christian</h2>
                                <p className="text-slate-300 max-w-xl">You have <span className="text-brand-magenta font-semibold">2 new procedures</span> to review and <span className="text-white font-semibold">1 incomplete tutorial</span>.</p>
                            </div>
                        </div>
                    </section>

                    {/* SOP Grid */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <FileText size={18} className="mr-2 text-brand-magenta" />
                                Standard Operating Procedures
                            </h2>
                            <button className="text-xs font-medium text-brand-purple hover:text-brand-magenta transition-colors">View All</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {sops.map((sop, idx) => (
                                <SOPCard key={idx} {...sop} />
                            ))}
                        </div>
                    </section>

                    {/* Video Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <Video size={18} className="mr-2 text-brand-magenta" />
                                Latest Tutorials
                            </h2>
                            <button className="text-xs font-medium text-brand-purple hover:text-brand-magenta transition-colors">View All</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {videos.map((video, idx) => (
                                <VideoCard key={idx} {...video} />
                            ))}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default App;
