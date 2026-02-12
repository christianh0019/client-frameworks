import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Search, FileText, Play, Clock, ArrowRight, LayoutGrid, List, ArrowLeft, ChevronRight, CheckSquare, MessageSquare } from 'lucide-react';

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

                        {/* Main Content Area */}
                        {(() => {
                            switch (sop.title) {
                                case "Qualification Call Script":
                                    return <QualificationScriptView />;
                                case "Discovery Call Script":
                                    return <DiscoveryScriptView />;
                                case "Handling New Lead Stage":
                                    return <HandlingNewLeadView onLinkClick={onSOPClick} />;
                                case "Handling Qualified Lead Stage":
                                    return <HandlingQualifiedLeadView />;
                                case "Handling Discovery Call Booked Stage":
                                    return <HandlingDiscoveryBookedView onLinkClick={onSOPClick} />;
                                case "Handling Discovery Call Completed Stage":
                                    return <HandlingDiscoveryCompletedView />;
                                case "Handling Not Booked Follow Ups Stage":
                                    return <HandlingNotBookedFollowUpsView />;
                                default:
                                    return (
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
                                    );
                            }
                        })()}
                    </article>
                </div>
            </div>
        </div>
    );
};

// 1. Handling New Lead View
const HandlingNewLeadView = ({ onLinkClick }: { onLinkClick?: (title: string) => void }) => (
    <div className="space-y-8 font-sans text-gray-800">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Where to Find This</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        <p>Desktop & Mobile CRM &gt; Opportunities &gt; <strong>"New Lead" Stage</strong></p>
                    </div>
                </div>
            </div>
        </div>

        <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Goal</h3>
            <p className="text-lg">Qualify or disqualify as fast as possible.</p>
        </section>

        <section className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold text-red-900">Important Rule: 5-Minute Response</h3>
                    <p className="mt-2 text-red-800">
                        All leads should be contacted in <strong>under 5 minutes</strong>.
                        Why? Conversion rates increase by <strong>300%</strong> when this is done.
                    </p>
                </div>
            </div>
        </section>

        <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Action Plan</h3>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <strong>Call them immediately</strong> (immediately after the automated text triggers).
                </li>
                <li className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    If they answer:
                    <button
                        onClick={() => onLinkClick && onLinkClick("Qualification Call Script")}
                        className="ml-2 inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                    >
                        Use Qualification Call Script <ArrowRight size={14} className="ml-1" />
                    </button>
                </li>
            </ol>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">If No Answer</h3>
                <p className="text-sm text-gray-500 mb-4">Cadence: Call once every day for 4 days.</p>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckSquare size={14} className="mr-2 text-blue-500" /> Send a quick text</li>
                    <li className="flex items-center"><CheckSquare size={14} className="mr-2 text-blue-500" /> Leave a voicemail</li>
                    <li className="bg-gray-50 p-3 rounded text-gray-600 italic mt-2">
                        "Just tried to give you a ring John. Did you have a moment?"
                    </li>
                </ul>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">If They Answer</h3>
                <p className="mb-4">Follow the <button onClick={() => onLinkClick && onLinkClick("Qualification Call Script")} className="text-indigo-600 font-medium hover:underline">Qualification Call Script</button></p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
                        <span className="font-medium text-green-800">Qualified</span>
                        <ArrowRight size={14} className="text-green-600" />
                        <span className="text-sm">Move to "Qualified Lead"</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
                        <span className="font-medium text-red-800">Disqualified</span>
                        <ArrowRight size={14} className="text-red-600" />
                        <span className="text-sm">Move to "Lost"</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

// 2. Handling Qualified Lead View
const HandlingQualifiedLeadView = () => (
    <div className="space-y-8 font-sans text-gray-800">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Goal</h3>
            <p className="text-blue-800 text-lg">Book a Discovery Call.</p>
        </div>

        <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Timeline</h3>
            <div className="flex items-center space-x-2 text-gray-600">
                <Clock size={20} />
                <span>Max Time in Stage: <strong>3-5 Days</strong></span>
            </div>
        </section>

        <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Action Plan</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <p className="mb-4">Reach out mainly via <strong>Text Message</strong> or <strong>Phone Call</strong>.</p>
                <div className="bg-gray-100 p-4 rounded-lg italic text-gray-700 border-l-4 border-gray-400">
                    "Would you like to set up a time to talk so we can learn more about your project?"
                </div>
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-red-900 mb-2">Outcome 1: Not Interested</h3>
                <ol className="list-decimal list-inside space-y-2 text-red-800">
                    <li>Move to "Lost" stage.</li>
                    <li>Select Reason: "Uninterested".</li>
                </ol>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-green-900 mb-2">Outcome 2: Interested (Booking)</h3>
                <ol className="list-decimal list-inside space-y-2 text-green-800">
                    <li>Click on <strong>Appointments</strong>.</li>
                    <li>Schedule a "Discovery Call".</li>
                    <li className="text-sm mt-2 font-normal italic">System automatically moves them to "Discovery Call Booked".</li>
                </ol>
            </div>
        </section>
    </div>
);

// 3. Handling Discovery Call Booked View
const HandlingDiscoveryBookedView = ({ onLinkClick }: { onLinkClick?: (title: string) => void }) => (
    <div className="space-y-8 font-sans text-gray-800">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                <Clock size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Automated Pipeline Stage</h3>
            <p className="text-indigo-700">Tracks all leads with a scheduled Discovery Call.</p>
        </div>

        <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pre-Call Automations (Lead Perspective)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Reminders</h4>
                    <p className="text-sm text-gray-600">Automated text/email notifications to prevent no-shows.</p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Company Info</h4>
                    <p className="text-sm text-gray-600">Helpful content to build trust before the call.</p>
                </div>
            </div>
        </section>

        <section className="bg-gray-900 text-white rounded-xl p-8">
            <h3 className="text-xl font-bold mb-6">Execution: Taking the Call</h3>
            <div className="space-y-6">
                <div className="flex items-start">
                    <div className="bg-gray-700 p-2 rounded mr-4">1</div>
                    <div>
                        <h4 className="font-bold">Dial via CRM</h4>
                        <p className="text-gray-400 text-sm">Always call using the CRM dialer so it's recorded and transcribed.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="bg-gray-700 p-2 rounded mr-4">2</div>
                    <div>
                        <h4 className="font-bold">Use the Script</h4>
                        <button onClick={() => onLinkClick && onLinkClick("Discovery Call Script")} className="text-blue-300 hover:text-white underline text-sm mt-1">
                            Open Discovery Call Script
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

// 4. Handling Discovery Call Completed View
const HandlingDiscoveryCompletedView = () => (
    <div className="space-y-8 font-sans text-gray-800">
        <section className="text-center py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Call Completed. What happened?</h3>
            <p className="text-gray-500 mt-2">Update the appointment outcome in the CRM.</p>
        </section>

        <section className="grid grid-cols-1 gap-6">
            {/* Option A */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 opacity-75 hover:opacity-100 transition-opacity">
                <h3 className="text-lg font-bold text-gray-700 mb-2">Option A: No Show</h3>
                <p className="text-sm text-gray-600">Select "No Show". Automation will follow up to reschedule.</p>
            </div>

            {/* Option B */}
            <div className="border-2 border-blue-100 bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-6">Option B: Showed</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                        <div>
                            <span className="font-bold text-red-900 block">1. Uninterested / Disqualified</span>
                            <span className="text-xs text-red-700">Move to "Lost"</span>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div>
                            <span className="font-bold text-yellow-900 block">2. Good Conversation (No Booking)</span>
                            <span className="text-xs text-yellow-700">Move to "Not Booked Follow Ups"</span>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm">
                        <div>
                            <span className="font-bold text-green-900 block">3. In-Person Meeting Booked</span>
                            <span className="text-xs text-green-700">Schedule Meeting &rarr; Moves to "Booked" Stage</span>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

// 5. Handling Not Booked Follow Ups View
const HandlingNotBookedFollowUpsView = () => (
    <div className="space-y-8 font-sans text-gray-800">
        <section className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center">
                <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded mr-2">HIGH PRIORITY</span>
                Low Hanging Fruit
            </h3>
            <p className="text-orange-800 mb-4">
                Qualified leads who engaged but couldn't book immediately (scheduling, spouse, land, etc.).
            </p>
        </section>

        <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rules of Engagement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold mb-4">1</div>
                    <h4 className="font-bold text-lg mb-2">100% Manual & Personalized</h4>
                    <p className="text-gray-600 text-sm">
                        Do NOT use automated blasts. Reference specific details from their previous call ("How was Hawaii?", "Did you close on the lot?").
                    </p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold mb-4">2</div>
                    <h4 className="font-bold text-lg mb-2">Follow-Up Cadence</h4>
                    <ul className="text-gray-600 text-sm space-y-2">
                        <li><strong>Specific Date:</strong> If set, call then.</li>
                        <li><strong>General:</strong> Every 1-2 weeks.</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="bg-gray-100 rounded-xl p-6 flex justify-between items-center px-10">
            <div className="text-center">
                <div className="font-bold text-2xl text-green-600 mb-1">Success</div>
                <div className="text-sm text-gray-500">Book In-Person Meeting</div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
                <div className="font-bold text-2xl text-red-600 mb-1">Failure</div>
                <div className="text-sm text-gray-500">Ghosted (Move to Lost)</div>
            </div>
        </section>
    </div>
);

// Custom View for Qualification Script
const QualificationScriptView = () => (
    <div className="space-y-10 font-sans text-gray-800">

        {/* Introduction Section */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm">00</span>
                Introduction
            </h3>
            <div className="space-y-4">
                <p className="italic text-gray-600 border-l-4 border-blue-400 pl-4 py-1 bg-white rounded-r-md">
                    "Hi <strong>[Name]</strong>, this is <strong>[Your Name]</strong> with <strong>[Company]</strong>. I saw you downloaded our <strong>[Asset Name]</strong> and wanted to see if you had any questions?"
                </p>
            </div>
        </section>

        {/* Connection Question */}
        <div className="bg-white rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Connection Question</h3>
            <p className="italic text-gray-600 border-l-4 border-gray-300 pl-4 py-1">
                "Great. This will only take a second but I’m just calling to see if there’s anything we could possibly do for you… and if there is… I could maybe get you booked for a phone call with our planning team. Would that… help you if I did that?"
            </p>
        </div>

        {/* Q1 Motivation */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. Motivation</h3>
            <p className="font-medium text-gray-800 text-lg">"So tell me [Name], what caught your eye or made you want to reach out to us?"</p>
        </div>

        {/* Q2 Location */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">2. Location</h3>
            <p className="font-medium text-gray-800 text-lg mb-6">"Do you have an idea of where you’re looking to build?"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">If In Service Area</div>
                    <div className="flex items-center text-green-800 font-bold">
                        Continue on <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>
                {/* Path B */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-5 relative overflow-hidden">
                    <div className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">If Outside Service Area</div>
                    <p className="italic text-red-900 text-sm mb-4">
                        "I’m not sure we’d be able to serve you there, I’m sorry. Unfortunately, I don’t have anyone I can recommend to you right now, however, I wish you the best with your project..."
                    </p>
                    <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">
                        End the Call ✗
                    </div>
                </div>
            </div>
        </div>

        {/* Q3 Land */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">3. Land Ownership</h3>
            <p className="font-medium text-gray-800 text-lg mb-6">"Have you decided on a piece of land yet or purchased one?"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Owns Land / Buying</div>
                    <p className="italic text-green-900 text-sm mb-4">
                        "Ok and do you have the address of the lot so that I can double check that? Are there any slopes or additional dwellings..."
                    </p>
                    <div className="flex items-center text-green-800 font-bold">
                        Continue on <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>
                {/* Path B */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">No Land</div>
                    <p className="italic text-red-900 text-sm mb-4">
                        "Oh ok that’s alright. I don’t think we’d be able to do very much for you at this moment because you’d need a plot of land for us to help you get started..."
                    </p>
                    <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">
                        End the Call ✗
                    </div>
                </div>
            </div>
        </div>

        {/* Q4 Project Type */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">4. Project Type</h3>
            <p className="font-medium text-gray-800 text-lg mb-6">"Ok and what type of home are you looking to build?"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Within your niche</div>
                    <div className="flex items-center text-green-800 font-bold">
                        Continue on <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>
                {/* Path B */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">Not in niche</div>
                    <p className="italic text-red-900 text-sm mb-4">
                        "I’m not sure we’d be able to help you with that, I’m sorry. [Their project] is not something we typically do..."
                    </p>
                    <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">
                        End the Call ✗
                    </div>
                </div>
            </div>
        </div>

        {/* Q5 Designs */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">5. Design Stage</h3>
            <p className="font-medium text-gray-800 text-lg mb-6">"Do you have any designs or sketches drawn up yet?"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">No Designs Yet</div>
                    <div className="flex items-center text-green-800 font-bold">
                        Continue on <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>
                {/* Path B */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">Has Designs</div>
                    <p className="italic text-yellow-900 text-sm mb-2">
                        "Oh ok. Have you reached out to any other builders for a bid or are you just researching the best builder?"
                    </p>
                </div>
            </div>

            {/* Sub-question for Path B */}
            <div className="mt-4 ml-0 md:ml-8 border-l-2 border-dashed border-gray-300 pl-6 py-4">
                <p className="text-sm font-semibold text-gray-500 mb-4 uppercase">If they have designs...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Looking for Best Builder</div>
                        <div className="flex items-center text-green-800 font-bold">
                            Continue on <ArrowRight size={16} className="ml-2" />
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                        <div className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">Looking for Multiple Bids</div>
                        <p className="italic text-red-900 text-sm mb-4">
                            "Got it. I’m sorry but we typically don’t do competitive bidding..."
                        </p>
                        <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">
                            End the Call ✗
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Q6 Timeline */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">6. Timeline</h3>
            <p className="font-medium text-gray-800 text-lg mb-6">"Ok and when would you potentially be looking to move in?"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Within Next 1-2 Years</div>
                    <div className="flex items-center text-green-800 font-bold">
                        Continue on <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>
                {/* Path B */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">Further out than 2 years</div>
                    <p className="italic text-red-900 text-sm mb-4">
                        "Ok that makes sense. Unfortunately there’s not much we can do at the very moment... I’ll make a note to follow up with you..."
                    </p>
                    <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase">
                        End the Call ✗
                    </div>
                </div>
            </div>
        </div>

        {/* Q7 Partners */}
        <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">7. Partners</h3>
            <p className="font-medium text-gray-800 text-lg mb-6">"Are there any partners or spouses that would be involved in the process?"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Path A */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">Yes</div>
                    <p className="italic text-green-900 text-sm mb-2">
                        "Ok can I have (his/her/their) name so that I can make a note of that?"
                    </p>
                </div>
                {/* Path B */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">No</div>
                    <div className="flex items-center text-green-800 font-bold">
                        Continue on <ArrowRight size={16} className="ml-2" />
                    </div>
                </div>
            </div>
        </div>

        {/* Closing */}
        <div className="border-t border-gray-100 pt-8 pb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Book The Discovery Call</h3>
                <div className="space-y-4 text-blue-900/80">
                    <p>"From what you’ve gone over… it sounds like we could potentially help you out."</p>
                    <p>"If you would like… I could get you on a phone call with <strong>[Business Owner/ Sales Rep]</strong>… over the next few days depending on our availability..."</p>
                    <p>"Ok, I’m pulling up his calendar now to see what times he may have available for you. Does tomorrow (morning/ afternoon) work for you?"</p>

                    <div className="py-4 font-bold text-blue-900 uppercase tracking-widest text-sm text-center border-y border-blue-200 my-4">
                        Confirm Time & Book Meeting
                    </div>

                    <p>"One more thing before I confirm that phone call, if you need to reschedule—please let him know in advance. I’m sure you would anyways (playful tone)..."</p>
                    <p className="font-bold">"Have a good rest of your day!"</p>
                </div>
            </div>
        </div>

    </div>
);

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

// Custom View for Discovery Script
// Custom View for Discovery Script
// Custom View for Discovery Script
const DiscoveryScriptView = () => {
    // Standard Styles for the "Document" look
    const s = {
        container: "space-y-8 font-sans text-gray-800 pb-20 max-w-4xl mx-auto",
        paper: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden",
        header: "p-6 bg-gray-50 border-b border-gray-200",
        headerTitle: "font-bold text-gray-900 flex items-center",
        body: "p-8 md:p-12 max-w-none space-y-8",
        sectionTitle: "text-xl font-bold text-indigo-700",
        p: "text-base text-gray-800 leading-relaxed",
        list: "list-decimal list-inside space-y-2 text-base text-gray-800 leading-relaxed ml-2",
        bulletList: "list-disc list-inside space-y-2 text-base text-gray-800 leading-relaxed ml-2",
        callout: "bg-gray-50 p-4 border-l-4 border-gray-300 text-gray-700 italic"
    };

    return (
        <div className={s.container}>

            {/* Part 1: SOP / Guidelines */}
            <section className={s.paper}>
                <div className={s.header}>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                {/* Document Body */}
                <div className={s.body}>

                    {/* 1. When To Conduct */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>When To Conduct Discovery Calls:</h4>
                        <p className={s.p}>
                            Discovery Calls are only for qualified leads who’ve already completed a Qualification Call and meet the basic criteria: they’re in your service area, own or are purchasing land, have a realistic timeline and budget, and fit your niche.
                        </p>
                        <p className={s.p}>
                            This is the salesperson’s call — it’s meant for the business owner, sales rep, or whoever will be making the actual sale. The goal here isn’t to “close” the deal yet, but to collect deep insight into the client’s situation, motivations, pain points, and goals. You’re building emotional context that will later drive your in-person presentation or proposal.
                        </p>
                    </div>

                    {/* 2. How To Prepare */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Prepare For Discovery Calls:</h4>
                        <p className={s.p}>
                            Before each Discovery Call, review all notes from the Qualification Call and CRM record. Know their land details, project type, and any prior communications so you can skip the surface-level questions and sound informed.
                        </p>
                        <p className={s.p}>
                            Have their form submission or call notes open during the conversation. You should be able to reference past answers naturally.
                        </p>
                        <p className={s.p}>
                            Always take this call in a quiet, private setting where you can focus 100%. These conversations often reveal financial details, family plans, and emotional motivations — so you need to listen carefully and take notes.
                        </p>
                    </div>

                    {/* 3. Purpose */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Purpose Of The Discovery Call:</h4>
                        <p className={s.p}>
                            The Discovery Call has two purposes:
                        </p>
                        <ol className={s.list}>
                            <li>
                                <strong>Data Collection</strong> — to understand their situation, goals, obstacles, and timeline so you can prepare an informed proposal or in-person meeting.
                            </li>
                            <li>
                                <strong>Emotional Discovery</strong> — to help them surface and relive the frustrations or fears behind their current situation, then visualize how much better life will be when they solve it with your help.
                            </li>
                        </ol>
                    </div>

                    {/* 4. How To Conduct */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Conduct:</h4>
                        <p className={s.p}>
                            Start with casual rapport and tone-setting — you want them relaxed and conversational.
                        </p>
                        <ol className={s.list}>
                            <li><strong>Connection Questions:</strong> Warm up, set context, reinforce authority. Confirm alignment and if spouse is present.</li>
                            <li><strong>Situation Questions:</strong> Gather hard data. Establish facts and uncover the "gap". Tone: Curious and slightly skeptical.</li>
                            <li><strong>Problem Awareness:</strong> Sales psychology. Help them feel the problem. Trigger self-reflection.</li>
                            <li><strong>Booking The Meeting:</strong> Invite serious prospects to the in-person meeting. Book on the spot. Send Pre-Meeting Page.</li>
                        </ol>
                        <p className="text-base text-red-700 font-bold mt-2">
                            WARNING: NEVER give into the temptation to “just send them an email”. You will lose the sale 99% of the time.
                        </p>
                    </div>

                    {/* 5. Post-Call */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>What To Do After:</h4>
                        <ul className={s.bulletList}>
                            <li><strong>Log Detailed Notes:</strong> Log every frustration, goal, and quote-worthy line in your CRM.</li>
                            <li><strong>Confirm Meeting:</strong> Send a quick text/email within 10 mins to lock it in.</li>
                            <li><strong>Follow Up:</strong> If they didn't commit, follow up within 24 hours.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Part 2: The Script */}
            <section className={s.paper}>
                <div className={s.header}>
                    <h3 className={s.headerTitle}>
                        <MessageSquare size={18} className="mr-2 text-gray-500" />
                        Discovery Call Script
                    </h3>
                </div>

                <div className={s.body}>

                    {/* 1. Connection Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Connection Questions</h4>
                        <p className={s.p}>
                            "Hey <strong>(Prospect First Name)</strong>, it’s <strong>(Your First Name)</strong>… <strong>(Your Full Name)</strong> with <strong>(Business Name)</strong>… It looks like you talked to <strong>(Team Member Name)</strong> and booked a time with me to explore how we might be able to help you with your custom home idea.. does that sound right?"
                        </p>
                        <p className={s.callout}>
                            Tone: Curious / Concerned
                        </p>

                        <p className={s.p}><strong>Decision Maker Check:</strong></p>
                        <ul className={s.bulletList}>
                            <li>
                                <strong>All Decision Makers Present:</strong> Great, continue on.
                            </li>
                            <li>
                                <strong>Missing A Decision Maker:</strong> "Before we get started, (Team Member) mentioned (Partner Name). Are they able to make it?"
                            </li>
                        </ul>
                        <p className={s.p}>
                            <em>If No:</em> "I'd recommend we reschedule to a time that works for both of you so we're all on the same page. When are you both 100% available?" &rarr; <strong>End Call.</strong>
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Opening & Frame */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Opening & Frame</h4>
                        <p className={s.p}>
                            "What really stood out to you that caused you to want to reach out today?"
                        </p>
                        <p className={s.callout}>
                            Tone: Curious / Engaging
                        </p>
                        <p className={s.p}>
                            "Oh ok… These first calls are pretty basic… It’s really more for us to understand where you’re at now… how far you’ve gotten in the process… compared to what you have in mind for your finished home … to see what the gap looks like... And then towards the end… if you feel like this… might be… what you’re looking for, and we think we can help, then we can talk about possible next steps. Would that be appropriate?"
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Situation Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Situation Questions</h4>
                        <p className={s.p}>
                            "So I know <strong>(Team Member Name)</strong> already went over some of the basics — things like your land, where you’re building, general timing — I won’t make you repeat all that again. What I’d love to understand though… is more about why you’re doing this because that’s really important to us here."
                        </p>

                        <ul className="space-y-4 py-2">
                            <li>
                                <p className={s.p}>"So how long have you been thinking about building a home?"</p>
                            </li>
                            <li>
                                <p className={s.p}>"Ok… and what made you decide you wanted to build rather than just buy something that’s already out there?"</p>
                            </li>
                            <li>
                                <p className={s.p}>"And what have you really done so far in the process except for you know… buy land?"</p>
                                <p className="text-gray-500 italic text-sm mt-1">"Just (whatever they mention)? Or anything else you’ve tried?"</p>
                            </li>
                            <li>
                                <p className={s.p}>"Got it. And when you think about it… what’s the main goal behind this? Like… what’s the big picture for you? Is this more of a forever home, an investment, a lifestyle change?"</p>
                            </li>
                            <li>
                                <p className={s.p}>"When you picture the home being finished… what would make you feel like… “Yeah… this was completely worth it”?"</p>
                            </li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Probing / Clarifying */}
                    <div className="space-y-6">
                        <h4 className={s.sectionTitle}>4. Probing / Clarifying Questions</h4>

                        <div>
                            <strong className="block mb-2 text-gray-900">Digging Deeper:</strong>
                            <ul className={s.bulletList}>
                                <li>"How long has that been going on for?"</li>
                                <li>"Has that had an impact on you?"</li>
                                <li>"Well, in what way?"</li>
                                <li>"What bothers you the most about this?"</li>
                                <li>"Okay, well, why now though?"</li>
                                <li>"Why is that so important to you now… why not just push it down the road?"</li>
                            </ul>
                        </div>

                        <div>
                            <strong className="block mb-2 text-gray-900">Understanding Nuance:</strong>
                            <ul className={s.bulletList}>
                                <li>"Can I ask why you said (blank)?"</li>
                                <li>"Can I ask what you meant when you said (blank)?"</li>
                                <li>"How do you mean by (blank)?"</li>
                                <li>"Can you walk me through how (blank) happened exactly?"</li>
                                <li>"When you say (blank), what did you mean by that exactly?"</li>
                                <li>"How did you feel when (blank) happened?"</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Problem Awareness */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Problem Awareness Questions</h4>
                        <p className={s.p}>
                            "Ok so, besides (Insert any problems you’re aware of if applicable), from what you’ve told me about your project so far (insert situation), which seems like a fairly decent starting point… but if you don’t mind me asking though… are you… 100%... satisfied with how things are progressing so far?"
                        </p>
                        <ul className="space-y-4 py-2">
                            <li><p className={s.p}>"Why haven’t you actually (blank) yet?"</p></li>
                            <li><p className={s.p}>"So what is it do you think about (blank) that’s causing you to not hit, say (ideal outcome)?"</p></li>
                            <li><p className={s.p}>"Just so I can understand the rationale behind why you might be looking, besides just wanting to build your dream home… because everybody says that… what's the main reason you’re looking for outside help rather than (what they’re already doing)?"</p></li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Book The Meeting */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Book The In-Person Meeting</h4>
                        <p className={s.p}>
                            "Based on what you’ve shared with me so far … what we do here could work for you …"
                        </p>
                        <p className={s.p}>
                            "What I can do from here if you’d like … is let you (and your partner/spouse if applicable) book a more formal meeting with me at my office… over the next few days depending on our availability … where we’d talk a bit more about what you might be looking for … and then some possible … next steps … would that help you?"
                        </p>
                        <p className={s.p}>
                            "Ok, I’m pulling up my calendar now to see what times I may have available for you. Does tomorrow (morning/ afternoon) work for you?"
                        </p>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded text-center my-4">
                            <strong className="text-blue-900 block">ACTION: Confirm Time & Book Meeting</strong>
                        </div>

                        <p className={s.p}>
                            "Now just real quick… and I’m sure this isn’t you … however sometimes people ask us to help them with their project, we let them book some more time with us and then they don’t show up … you know those kinds of people … I’m sure that isn’t you … right?"
                        </p>
                        <p className={s.p}>
                            "Great… I also wanted to bring up real quick about our pre-meeting page. It has a couple different things to make sure you know everything that we do... Would it help if I sent that page over to you?"
                        </p>
                        <p className={s.p}>
                            "Awesome, I’ll ask you about it at our meeting at (Time and Date of Sales Call). Anything else for me before I go?"
                        </p>
                    </div>

                </div>
            </section>
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
