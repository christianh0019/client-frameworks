import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

const SOPDetail = ({ sop, onBack, onSOPClick }: { sop: SOP, onBack: () => void, onSOPClick?: (sopTitle: string) => void }) => {

    // Helper to process internal links for Markdown
    const processContent = (content: string) => {
        let processed = content;

        // 1. Handle Lists: Ensure bullets have enough spacing to be recognized as lists
        // Replace "•" with "*" for consistency
        processed = processed.replace(/•/g, '*');
        // Ensure newlines before bullets (Markdown requires a blank line before a list usually, or at least a newline)
        processed = processed.replace(/\n\*/g, '\n\n*');

        // 2. Handle Links
        // Replace [[LINK:Title with Spaces]] with [Title with Spaces](#sop-Title%20with%20Spaces)
        processed = processed.replace(/\[\[LINK:(.*?)\]\]/g, (_, title) => {
            const encodedTitle = encodeURIComponent(title);
            return `[${title}](#sop-${encodedTitle})`;
        });

        return processed;
    };

    return (
        <div className="flex flex-col h-full bg-saas-bg animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex-1 overflow-y-auto">
                {/* Document Content */}
                <div className="max-w-4xl mx-auto bg-white min-h-[calc(100vh-4rem)] shadow-sm border-x border-saas-border overflow-hidden relative">
                    {/* Back Button - Absolute Top Left */}
                    <button
                        onClick={onBack}
                        className="absolute top-6 left-6 z-20 flex items-center px-3 py-1.5 bg-white/80 hover:bg-white backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all"
                    >
                        <ArrowLeft size={16} className="mr-1.5" />
                        Back to Library
                    </button>

                    {/* Header Banner - Notion Style */}
                    <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 relative group">
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                    </div>

                    <article className="px-12 py-10 relative">
                        {/* Icon - Overlapping Banner */}
                        <div className="-mt-20 mb-8 relative z-10">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 text-saas-blue">
                                <FileText size={48} strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Title & Meta */}
                        <div className="mb-12 border-b border-gray-100 pb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                    {sop.category}
                                </span>
                                <span className="text-xs text-saas-text-secondary flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    Updated recently
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">{sop.title}</h1>
                        </div>

                        {/* Main Markdown Content */}
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-strong:text-slate-900 prose-li:marker:text-gray-400">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({ node, ...props }) => {
                                        const href = props.href || '';
                                        if (href.startsWith('#sop-')) {
                                            return (
                                                <a
                                                    {...props}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Decode the title back from the URL
                                                        const title = decodeURIComponent(href.replace('#sop-', ''));
                                                        if (onSOPClick) {
                                                            onSOPClick(title);
                                                        }
                                                    }}
                                                    className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors cursor-pointer bg-indigo-50 px-1 py-0.5 rounded hover:bg-indigo-100 no-underline"
                                                >
                                                    <span className="inline-flex items-center">
                                                        <FileText size={14} className="mr-1" />
                                                        {props.children}
                                                    </span>
                                                </a>
                                            );
                                        }
                                        return <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{props.children}</a>;
                                    }
                                }}
                            >
                                {processContent(sop.detailedContent || '')}
                            </ReactMarkdown>
                        </div>
                    </article>
                </div>
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

### Pre-Call Automations (What the Lead Sees)
Leading up to the call, the system automatically sends:
*   **Reminders:** Automated text and email notifications to prevent no-shows.
*   **Company Info:** Helpful content to build trust and educate them about us before we talk.

### Execution: Taking the Call
When it's time for the appointment:
1.  **Dial via CRM:** Always call using the CRM dialer so the call is recorded, transcribed, and summarized.
2.  **Use the Script:** Follow the [[LINK:Discovery Call Script]] to guide the conversation.

### Automation Rules
*   **Entry:** Leads are automatically entered into this stage when a "Discovery Call" is booked.
*   **Exit:** Leads are automatically moved to the "Discovery Call Completed" stage when the appointment is marked as "Completed".`
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
            detailedContent: `### Definition
This stage is for **Qualified Leads** who engaged with us but for some reason could not book an In-Person Meeting immediately.

Common reasons include:
*   Vacation / Scheduling conflicts.
*   Waiting for a work promotion or financial event.
*   Finalizing land purchase.
*   Spouse/Partner needs to be consulted.

### Importance: High Priority
These are your **most important follow-ups**.
*   They are already **Qualified**.
*   They have already **Engaged** (Discovery Call).
*   They are "low hanging fruit" that just need nurturing.

### Rules of Engagement
**1. 100% Manual & Personalized**
*   Do NOT use automated blasts here.
*   **Always** review the Contact Notes, Opportunity Notes, and the Discovery Call Recording before reaching out.
*   Reference specific details: "Hey John, hope the vacation in Hawaii was great..." or "Did you end up closing on that lot yet?"

**2. Follow-Up Cadence**
*   **Specific Date:** If they asked you to call back on a specific date, set a Task and call on that exact day.
*   **General:** If no date was set, follow up **every 1-2 weeks**.

### Goal
**Book an In-Person Meeting.**
We need to get them face-to-face to build rapport, establish trust, and pitch our service.

### Exit Criteria
*   **Success:** They typically move to the **"In-Person Meeting Booked"** stage.
*   **Failure:** If they ghost you for a couple of months despite consistent follow-up, move them to **"Lost"** (Reason: Abandoned/Ghosted).`
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
            detailedContent: `### Standard Operating Procedure

#### When To Conduct Qualification Calls:
**When you receive a new lead**, meaning somebody you haven’t spoken to before puts in their contact information via your website, paid ads, social media, or even calls you directly.

**You should be calling them within 5 minutes** of them becoming a new lead.
*   Studies show that engaging a lead within 1 minute of them becoming a lead increases conversions by up to **391%**.
*   Shockingly, only **7%** of companies consistently follow-up within 5 minutes.

#### How To Prepare For Qualification Calls:
1.  **Review their form submission:** If they answered extra questions (e.g., land ownership, location), use that info to show professionalism.
    *   *Example:* If they said they own land, don't ask "Do you own land?", ask "Where is your lot located?"
2.  **Cross-reference CRM:** Check if they have reached out before. Use past notes to build instant rapport.

#### How To Qualify / Disqualify Leads:
The goal isn't to sell—it's to determine **fit**.
*   **Motivation:** Are they genuinely interested or just browsing?
*   **Location:** Is it in our service area?
*   **Land Ownership:** Do they have land? (If not, disqualify or nurture).
*   **Project Type:** Is it a custom home/renovation we actually do?
*   **Design Stage:** Are they early (good) or just price shopping with finished plans (bad)?
*   **Timeline:** 12-24 months is ideal. 3-4 years is too far out (nurture).
*   **Decision Makers:** Are partners/spouses involved? (Get them on the Discovery Call).

#### What To Do After Qualification Calls:
*   **Record:** Take notes or record the call/texts in the CRM.
*   **Document:** Long sales cycles mean you might not talk for months. Detailed notes save you from starting over.

---

### Qualification Call Script

#### Connection Questions:
"Hey **[Prospect Name]**, it’s **[Your Name]** with **[Business Name]**… It looks like you just **[Action they took]** to possibly learn more about getting started with your custom home project, does that ring a bell?" *(Curious/Concerned tone)*

"Great. This will only take a second but I’m just calling to see if there’s anything we could possibly do for you… and if there is… I could maybe get you booked for a phone call with our planning team. Would that… help you if I did that?"

#### Situational Questions:

**1. "So tell me [Name], what caught your eye or made you want to reach out to us?"**

**2. "Do you have an idea of where you’re looking to build?"**

| If In Service Area | If Outside Service Area |
| :--- | :--- |
| **Continue on ↓** | "I’m not sure we’d be able to serve you there, I’m sorry. Unfortunately, I don’t have anyone I can recommend to you right now, however, I wish you the best with your project. Is there anything else I can help you with today?"<br><br>**End the call ✗** |

**3. "Have you decided on a piece of land yet or purchased one?"**

| If They Own Land Or Are Actively Purchasing Land | If They Don’t Have Land |
| :--- | :--- |
| "Ok and do you have the address of the lot so that I can double check that?"<br><br>"Are there any slopes or additional dwellings or anything the team should be aware of?"<br><br>**Continue on ↓** | "Oh ok that’s alright. I don’t think we’d be able to do very much for you at this moment because you’d need a plot of land for us to help you get started."<br><br>*(Potentially recommend them to somebody who can help them find a lot or bring up any lots that your business owns)*<br><br>"Is there anything else I can help you with today?"<br><br>**End the call ✗** |

**4. "Ok and what type of home are you looking to build?"**

| If Within Your Niche | If It Isn’t Within Your Niche |
| :--- | :--- |
| **Continue on ↓** | "I’m not sure we’d be able to help you with that, I’m sorry. **[Their project]** is not something we typically do. Unfortunately, I don’t have anyone I can recommend to you right now, however, I wish you the best with your project. Is there anything else I can help you with today?"<br><br>**End the call ✗** |

**5. "Do you have any designs or sketches drawn up yet?"**

| If No Designs Yet | If They Have Designs |
| :--- | :--- |
| **Continue on ↓** | "Oh ok. Have you reached out to any other builders for a bid or are you just researching the best builder?" |

*(If they have designs...)*

| Looking For Best Builder | Looking For Multiple Bids |
| :--- | :--- |
| **Continue on ↓** | "Got it. I’m sorry but we typically don’t do competitive bidding. Unfortunately, I don’t have anyone I can recommend to you right now, however, I wish you the best with your project. Is there anything else I can help you with today?"<br><br>**End the call ✗** |

**6. "Ok and when would you potentially be looking to move in?"**

| If Within Next 1-2 Years | If Further Out Than 2 Years |
| :--- | :--- |
| **Continue on ↓** | "Ok that makes sense. Unfortunately there’s not much we can do at the very moment considering any next steps. That date is pretty far out, but what I can do is send you some information on the process and what to expect so that you’re more prepared. I’ll make a note to follow up with you when that gets closer… would that help you?"<br><br>"Is there anything else I can help you with today?"<br><br>**End the call ✗** |

**7. "Are there any partners or spouses that would be involved in the process?"**

| If Yes | If No |
| :--- | :--- |
| "Ok can I have (his/her/their) name so that I can make a note of that?"<br><br>**Continue on ↓** | **Continue on ↓** |

---

### Book The Discovery Call:

"From what you’ve gone over… it sounds like we could potentially help you out."

"If you would like… I could get you on a phone call with **[Business Owner/ Sales Rep]**… over the next few days depending on our availability… where you’d talk a bit more about your potential project… and then some possible… next steps… would that help you?"

"Ok, I’m pulling up his calendar now to see what times he may have available for you. Does tomorrow (morning/ afternoon) work for you (and partner/spouse name if applicable)?"

**CONFIRM THE TIME AND BOOK IN-PERSON MEETING**

"One more thing before I confirm that phone call, if you need to reschedule—please let him know in advance. I’m sure you would anyways *(playful tone)*… but he wants me to say that because he’s very busy and doesn’t take too many calls. Is that ok with you?"

"Great—**[Business Owner/ Sales Rep]** will give you a call at **[Time and Date]**."

"Have a good rest of your day!"`
        },
        {
            title: "Discovery Call Script",
            description: "Detailed script for the 30-45 minute discovery session.",
            category: "Script",
            detailedContent: `### Agenda Setting
"The goal of this call is to understand your vision, review your budget, and see if we are the right team to build your home. By the end, we'll decide if it makes sense to move to a Design Agreement."

### Vision & Goals
* "Tell me about your dream home. What are the must-haves?"
* "Why are you looking to build right now?"

### Budget & Finance
* "Have you spoken with a lender yet?"
* "You mentioned a budget of [Amount]. Is that for the build only, or all-in (including land/soft costs)?"

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
                    <SOPDetail
                        sop={selectedSOP}
                        onBack={goBack}
                        onSOPClick={(title) => {
                            const found = allSops.find(s => s.title === title);
                            if (found) handleSOPClick(found);
                        }}
                    />
                )}

                {activeView === 'video-detail' && selectedVideo && (
                    <VideoDetail video={selectedVideo} onBack={goBack} />
                )}

            </div>
        </div>
    );
};
export default App;
