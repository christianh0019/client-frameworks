import { useState, useEffect } from 'react';
import { Search, FileText, Play, Clock, ArrowRight, LayoutGrid, List, ArrowLeft, ChevronRight, CheckSquare } from 'lucide-react';

// Types
type ViewState = 'library' | 'sop-detail' | 'video-detail';

interface SOP {
    title: string;
    description: string;
    category: string;
    content?: string[]; // Mock content for the detail view
    detailedContent?: string; // Full text content for the detail view
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
        {['Process Library', 'Video Tutorials', 'Tree', 'Resources'].map((tab) => (
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12">
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
                                <span>Updated recently</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-saas-blue">
                        {sop.detailedContent ? (
                            <div className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base">
                                {sop.detailedContent.split('\n').map((line, i) => {
                                    const trimmed = line.trim();
                                    if (!trimmed) return <div key={i} className="h-4"></div>;

                                    // Headers (Markdown style ###)
                                    if (trimmed.startsWith('### ')) {
                                        return <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">{trimmed.replace(/^###\s+/, '')}</h3>;
                                    }

                                    // Sub-headers / Keys
                                    if (trimmed.endsWith(':') || (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.includes(' ') && !trimmed.startsWith('[['))) {
                                        return <strong key={i} className="block mt-4 mb-2 text-gray-900">{line}</strong>
                                    }

                                    // Link Detection [[LINK:SOP Title]]
                                    const linkMatch = line.match(/\[\[LINK:(.*?)\]\]/);
                                    if (linkMatch) {
                                        const targetSop = linkMatch[1];
                                        const parts = line.split(linkMatch[0]);
                                        return (
                                            <div key={i} className="my-2">
                                                {parts[0]}
                                                <button
                                                    onClick={() => {
                                                        const event = new CustomEvent('navigate-sop', { detail: targetSop });
                                                        window.dispatchEvent(event);
                                                    }}
                                                    className="inline-flex items-center text-saas-blue font-medium hover:underline cursor-pointer"
                                                >
                                                    <FileText size={14} className="mr-1" />
                                                    {targetSop}
                                                </button>
                                                {parts[1]}
                                            </div>
                                        );
                                    }

                                    return <div key={i}>{line}</div>
                                })}
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
};

const VideoDetail = ({ video, onBack }: { video: Video, onBack: () => void }) => (
    <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col pb-12">
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
            <div className="aspect-video bg-gray-100 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gray-200/50"></div>
                {/* Mock Player UI */}
                <div className="text-center z-10">
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer border border-gray-100">
                        <Play size={40} className="text-saas-blue ml-2 fill-saas-blue" />
                    </div>
                </div>

                {/* Mock Controls */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/10 to-transparent p-6 flex items-end">
                    <div className="w-full flex items-center space-x-4">
                        <button className="text-saas-blue transition-colors">
                            <Play size={24} className="fill-current" />
                        </button>
                        <div className="h-1.5 bg-gray-300 flex-1 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all">
                            <div className="h-full w-1/3 bg-saas-blue"></div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium font-mono">{video.duration}</span>
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

// Tree Visualization
interface ProcessStage {
    id: string;
    name: string;
    sopId: string; // Title of the SOP to link to
    description?: string;
}

const SalesProcessTree = ({ onSelectSOP }: { onSelectSOP: (sopTitle: string) => void }) => {
    const stages: ProcessStage[] = [
        { id: '1', name: 'New Lead', sopId: 'Handling New Lead Stage', description: 'Manual qualification only' },
        { id: '2', name: 'Qualified Lead', sopId: 'Handling Qualified Lead Stage', description: 'Eligible for discovery' },
        { id: '3', name: 'Discovery Call Booked', sopId: 'Handling Discovery Call Booked Stage', description: 'Discovery scheduled' },
        { id: '4', name: 'Discovery Call Completed', sopId: 'Handling Discovery Call Completed Stage', description: 'Discovery done' },
        { id: '5', name: 'Not Booked Follow Ups', sopId: 'Handling Not Booked Follow Ups Stage', description: 'Booking recovery' },
        { id: '6', name: 'In-Person Meeting Booked', sopId: 'Handling In-Person Meeting Booked Stage', description: 'High-intent next step' },
        { id: '7', name: 'In-Person Meeting Completed', sopId: 'Handling In-Person Meeting Completed Stage', description: 'Trust + alignment' },
        { id: '8', name: 'Not Closed Follow Ups', sopId: 'Handling Not Closed Follow Ups Stage', description: 'Long-cycle nurture' },
        { id: '9', name: 'Agreements Signed', sopId: 'Handling Agreements Signed Stage', description: 'Revenue progression' },
    ];

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="relative border-l-2 border-gray-200 ml-4 space-y-12">
                {stages.map((stage) => (
                    <div key={stage.id} className="relative pl-8 group">
                        {/* Dot on the line */}
                        <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${'bg-white border-saas-blue group-hover:scale-125 group-hover:bg-blue-50'
                            }`}></div>

                        {/* Connection Line Highlight (Optional) */}
                        <div className="absolute left-[-2px] top-6 bottom-[-48px] w-[2px] bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        {/* Content Card */}
                        <div
                            onClick={() => onSelectSOP(stage.sopId)}
                            className="bg-white p-5 rounded-lg border border-saas-border hover:shadow-md hover:border-saas-blue/50 cursor-pointer transition-all relative"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-semibold text-saas-text-primary group-hover:text-saas-blue transition-colors">
                                    {stage.name}
                                </h3>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-saas-blue transform group-hover:translate-x-1 transition-all" />
                            </div>
                            {stage.description && <p className="text-sm text-saas-text-secondary">{stage.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('Process Library');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeView, setActiveView] = useState<ViewState>('library');
    const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);


    const sops: SOP[] = [
        {
            title: "Handling New Lead Stage",
            description: "Contact every new lead quickly, qualify seriousness, and secure the next step within 7 days.",
            category: "Sales",
            detailedContent: `### Where to Find This
Desktop & Mobile CRM > Opportunities > "New Lead" Stage.

### Definition
"New Leads" are generated via lead magnets. These contacts have exchanged their information for a valuable guide or tool effectively but have NOT yet been qualified.

### Goal
Qualify or disqualify as fast as possible.

### Important Rule: 5-Minute Response
All leads should be contacted in under 5 minutes.
Why? Conversion rates increase by 300% when this is done.

### Notifications
• You will be notified via text message for all new leads.
• The lead receives an automated text message 2-3 minutes after they enter the system (designed to feel human).
• Example: "Hey I just saw you downloaded our [Asset Name]! Is this John?"

### Action Plan
1. Call them immediately (immediately after the automated text triggers).
2. If they answer: [[LINK:Qualification Call Script]]

### If No Answer (Follow-Up Cadence)
Call once every day for the next 4 days.

If they don't answer the call:
• Send a quick text.
• Leave a voicemail.
• Suggested Text: "Just tried to give you a ring John. Did you have a moment?" (Keep it friendly, do not annoy them).

### If They Answer
Follow the Qualification Script: [[LINK:Qualification Call Script]]

Goal: Determine if they are Qualified or Unqualified.

Qualified: Move to "Qualified Lead" pipeline stage.
Disqualified: Move to "Lost" stage and add "Disqualified" reason.

### Special Circumstances Note
Sometimes you can proceed with a discovery call immediately during the qualification call, but this is RARE.

Only proceed if:
• All decision makers are present.
• They are in a quiet, isolated environment.
• Everybody has time to talk.

If these conditions are not met, schedule the Discovery Call for a later time.

If you DO proceed immediately, use the [[LINK:Discovery Call Script]].`
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

    // Placeholder SOPs for Tree Stages
    const stageSops: SOP[] = [
        {
            title: "Handling Qualified Lead Stage",
            description: "Process for handling the Qualified Lead stage.",
            category: "Sales",
            detailedContent: `### Definition
"Qualified Leads" have either:
1. Been called and qualified manually.
2. Filled out an application on our website that automatically qualified them (ASK: The application and qualification call ask the same things).

### Goal
Book a Discovery Call.

### Timeline
**Max Time in Stage: 3-5 Days.**
We should have either booked a discovery call or marked them as uninterested by day 5.

### Action Plan
Reach out mainly via **Text Message** or **Phone Call**.
Script/Approach: "Would you like to set up a time to talk so we can learn more about your project?"

### Outcome 1: Not Interested
Move to "Lost" stage.
Select Reason: "Uninterested".

### Outcome 2: Interested (Booking)
1. Click on **Appointments**.
2. Schedule a "Discovery Call".
3. **Automatic:** Once booked, the system will move them to the "Discovery Call Booked" stage automatically.`
        },
        {
            title: "Handling Discovery Call Booked Stage",
            description: "Process for handling the Discovery Call Booked stage.",
            category: "Sales",
            detailedContent: `### Definition
This is an **Automated Pipeline Stage** that tracks all leads with a scheduled Discovery Call.

### Goal
Monitor upcoming appointments and prepare for the calls.

### Where to View
You can view these appointments in this pipeline stage or in the **Calendars** tab.
(Shows how many people are booked and their specific times).

### Automation Rules
*   **Entry:** Leads are automatically entered into this stage when a "Discovery Call" is booked.
*   **Exit:** Leads are automatically moved to the "Discovery Call Completed" stage when the appointment is marked as "Completed" (or the time passes, depending on settings).

### Important Note: CRM Calling
**ALWAYS call through the CRM.**
*   It records the call.
*   It transcribes the conversation.
*   It summarizes the discussion (found in the "Notes" section of the Opportunity).`
        },
        {
            title: "Handling Discovery Call Completed Stage",
            description: "Process for handling the Discovery Call Completed stage.",
            category: "Sales",
            detailedContent: `### Definition
This stage indicates that a scheduled call has passed and requires **Outcome Feedback**.

### Action Item: Update Call Outcome
Go to the **Calendars** tab or the appointment on the pipeline card and update the outcome:

#### Option A: No Show
*   Select **"No Show"**.
*   **Automation:** An automated sequence will immediately follow up to reschedule.

#### Option B: Showed
*   Select **"Showed"**.
*   Then, determine the next step based on the conversation:

**1. Uninterested / Disqualified:**
*   Move to **"Lost"**.
*   Select Reason: "Uninterested" or "Disqualified".

**2. Good Conversation (But No Booking):**
*   Move to **"Not Booked Follow Ups"** stage.
*   Use this for leads who are interested but couldn't commit to an in-person meeting yet.

**3. In-Person Meeting Booked:**
*   Schedule the meeting in the system.
*   **Automation:** They will automatically move to the **"In-Person Meeting Booked"** stage.`
        },
        {
            title: "Handling Not Booked Follow Ups Stage",
            description: "Process for handling the Not Booked Follow Ups stage.",
            category: "Sales",
            detailedContent: "### Process for Not Booked Follow Ups Stage\n\nComing soon..."
        },
        {
            title: "Handling In-Person Meeting Booked Stage",
            description: "Process for handling the In-Person Meeting Booked stage.",
            category: "Sales",
            detailedContent: "### Process for In-Person Meeting Booked Stage\n\nComing soon..."
        },
        {
            title: "Handling In-Person Meeting Completed Stage",
            description: "Process for handling the In-Person Meeting Completed stage.",
            category: "Sales",
            detailedContent: "### Process for In-Person Meeting Completed Stage\n\nComing soon..."
        },
        {
            title: "Handling Not Closed Follow Ups Stage",
            description: "Process for handling the Not Closed Follow Ups stage.",
            category: "Sales",
            detailedContent: "### Process for Not Closed Follow Ups Stage\n\nComing soon..."
        },
        {
            title: "Handling Agreements Signed Stage",
            description: "Process for handling the Agreements Signed stage.",
            category: "Sales",
            detailedContent: "### Process for Agreements Signed Stage\n\nComing soon..."
        },
    ];

    const scripts: SOP[] = [
        {
            title: "Qualification Call Script",
            description: "Initial script to qualify new leads in under 5 minutes.",
            category: "Script",
            detailedContent: `### Introduction
"Hi [Name], this is [Your Name] with [Company]. I saw you downloaded our [Asset Name] and wanted to see if you had any questions?"

### Qualification Questions
1. **Current Situation:** "Where are you currently at in your home building journey?"
2. **Land:** "Do you already own a lot, or are you looking for one?"
3. **Timeline:** "When are you hoping to be moved in?"
4. **Budget:** "Do you have a rough budget range in mind for the project?"

### Conclusion
**If Qualified:** "It sounds like we might be a good fit. I'd love to schedule a Discovery Call to dive deeper. Does [Time] work?"
**If Unqualified:** "It sounds like you're still early in the process. I'll send you some more resources to help you plan. Have a great day!"`
        },
        {
            title: "Discovery Call Script",
            description: "Detailed script for the 30-45 minute discovery session.",
            category: "Script",
            detailedContent: `### Agenda Setting
"The goal of this call is to understand your vision, review your budget, and see if we are the right team to build your home. By the end, we'll decide if it makes sense to move to a Design Agreement."

### Vision & Goals
*   "Tell me about your dream home. What are the must-haves?"
*   "Why are you looking to build right now?"

### Budget & Finance
*   "Have you spoken with a lender yet?"
*   "You mentioned a budget of [Amount]. Is that for the build only, or all-in (including land/soft costs)?"

### Process Overview
Briefly explain your 3-step process: Design -> Pre-Construction -> Build.

### Closing / Next Steps
**If Moving Forward:** "I think we can help you build this. The next step is our Design Agreement. It costs [Amount] and gets you [Deliverable]. Shall we get that started?"`
        }
    ];

    const allSops = [...sops, ...stageSops, ...scripts];

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

    // Helper to find SOP by title and open it
    const handleTreeSelection = (sopTitle: string) => {
        const foundSOP = allSops.find(s => s.title === sopTitle);
        if (foundSOP) {
            handleSOPClick(foundSOP);
        } else {
            // Fallback or alert if SOP not found (optional)
            console.warn(`SOP not found: ${sopTitle}`);
        }
    };

    useEffect(() => {
        const handleNavigation = (e: Event) => {
            const customEvent = e as CustomEvent;
            handleTreeSelection(customEvent.detail);
        };
        window.addEventListener('navigate-sop', handleNavigation);
        return () => window.removeEventListener('navigate-sop', handleNavigation);
    }, [allSops]);

    return (
        <div className="min-h-screen bg-saas-bg font-sans text-saas-text-primary selection:bg-blue-100 selection:text-blue-900 p-6">

            {/* Dynamic Content */}
            <div className="max-w-7xl mx-auto">

                {activeView === 'library' ? (
                    <>
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

                        {/* Content Grids */}
                        {activeTab === 'Process Library' && (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                                {allSops.map((sop, idx) => (
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

                        {activeTab === 'Tree' && (
                            <SalesProcessTree onSelectSOP={handleTreeSelection} />
                        )}

                        {activeTab === 'Resources' && (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                                {scripts.map((script, idx) => (
                                    <SOPCard key={idx} sop={script} onClick={() => handleSOPClick(script)} />
                                ))}
                            </div>
                        )}
                    </>
                ) : null}

                {activeView === 'sop-detail' && selectedSOP && (
                    <SOPDetail sop={selectedSOP} onBack={goBack} />
                )}

                {activeView === 'video-detail' && selectedVideo && (
                    <VideoDetail video={selectedVideo} onBack={goBack} />
                )}

            </div>
        </div>
    );
};
export default App;
