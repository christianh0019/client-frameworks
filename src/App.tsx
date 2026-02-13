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
        {["Sales Process", "SOP's", 'Resources'].map((tab) => (
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
                                case "In-Person Meeting Script":
                                    return <InPersonMeetingScriptView />;
                                case "Presentation Pillar Examples":
                                    return <PresentationPillarExamplesView />;
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
                                case "Handling In-Person Meeting Booked Stage":
                                    return <HandlingInPersonMeetingBookedView onLinkClick={onSOPClick} />;
                                case "Handling In-Person Meeting Completed Stage":
                                    return <HandlingInPersonMeetingCompletedView />;
                                case "Handling Not Closed Follow Ups Stage":
                                    return <HandlingNotClosedFollowUpsView />;
                                case "Handling Agreements Signed Stage":
                                    return <HandlingAgreementsSignedView />;
                                case "Sales Representative Role & Performance Standards":
                                    return <SalesRepPerformanceStandardsView />;
                                case "CRM Data Integrity & Pipeline Governance":
                                    return <CRMDataIntegrityView />;
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
const HandlingNewLeadView = ({ onLinkClick }: { onLinkClick?: (title: string) => void }) => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: New Lead</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the “New Lead” stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage in the CRM by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; New Lead</p>
                        <p className={s.p}>This stage is accessible on both the desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Purpose */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Purpose of the New Lead Stage</h4>
                        <p className={s.p}>The New Lead stage contains contacts generated through Lead Magnets.</p>
                        <p className={s.p}>A Lead Magnet is any opt-in where a prospect provides basic contact information (name, phone number, email) in exchange for access to a resource such as:</p>
                        <ul className={s.bulletList}>
                            <li>A guide</li>
                            <li>A checklist</li>
                            <li>A downloadable tool</li>
                            <li>A QR code offer</li>
                            <li>A general inquiry form</li>
                        </ul>
                        <p className={s.p}>These contacts have not completed an application and have not provided detailed project information such as budget, scope, or timeline.</p>
                        <p className={s.p}>The purpose of this stage is to determine, as quickly as possible, whether the lead meets the minimum qualification criteria to proceed to the next step in the sales process.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Performance Standard */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Performance Standard</h4>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-bold text-red-900">All New Leads must be contacted within 5 minutes of entering the pipeline.</p>
                        </div>
                        <p className={s.p}>Research shows that contacting a lead within 5 minutes can increase conversion rates by up to 300%. Prompt response is a mandatory standard, not a recommendation.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Automated Actions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Automated Actions</h4>
                        <p className={s.p}>When a new lead enters this stage, the following occurs automatically:</p>
                        <ul className={s.bulletList}>
                            <li>The assigned sales representative receives an immediate text notification.</li>
                            <li>The lead receives an automated text message approximately 2–3 minutes after opting in.</li>
                        </ul>
                        <p className={s.p}>The automated message will be similar to:</p>
                        <p className={s.callout}>“Hey, I just saw you downloaded our [Lead Magnet Name]. Is this John?”</p>
                        <p className={s.p}>This message is designed to create a natural transition into live contact.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Immediate Action Required */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Immediate Action Required</h4>
                        <p className={s.p}>Upon receiving the notification:</p>
                        <ul className={s.bulletList}>
                            <li>Open the contact record in the CRM.</li>
                            <li>Call the lead immediately.</li>
                            <li>Document the call attempt in the CRM.</li>
                        </ul>
                        <p className={s.p}>Speed of response is critical at this stage.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. If the Lead Does Not Answer */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. If the Lead Does Not Answer</h4>
                        <p className={s.p}>Follow the required follow-up cadence:</p>

                        <div className="pl-4 border-l-2 border-indigo-100">
                            <h5 className="font-bold text-gray-900 mb-2">Days 1–4:</h5>
                            <ul className={s.bulletList}>
                                <li>Place one call per day.</li>
                            </ul>
                            <p className={s.p + " mt-2"}>If there is no answer:</p>
                            <ul className={s.bulletList}>
                                <li>Leave a voicemail.</li>
                                <li>Send a brief, professional text message.</li>
                            </ul>
                        </div>

                        <p className={s.p}>Example text message:</p>
                        <p className={s.callout}>“I just tried calling you. Please let me know if you have a moment to connect.”</p>

                        <p className={s.p}>Messages should be concise and professional. Avoid excessive messaging or repeated contact within the same day.</p>
                        <p className={s.p}>If there is no response after four consecutive days of attempts, follow internal guidelines for continued nurture or status update.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. If the Lead Answers */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. If the Lead Answers</h4>
                        <p className={s.p}>If contact is made, conduct the Qualification Call.</p>
                        <p className={s.p}>You must follow the official <button onClick={() => onLinkClick && onLinkClick("Qualification Call Script")} className="text-indigo-600 underline font-medium hover:text-indigo-800">Qualification Call Script</button> located in the Resources section of the SOP library. Do not deviate from the required qualification criteria.</p>
                        <p className={s.p}>The purpose of this call is to determine whether the lead meets the minimum standards to proceed in the sales process.</p>
                        <p className={s.p}>This is not a discovery call and is not intended for detailed project discussions or pricing presentations.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Qualification Outcome */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Qualification Outcome</h4>
                        <p className={s.p}>At the conclusion of the call, there are only two acceptable outcomes:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                <h5 className="font-bold text-green-800 text-lg mb-2">A. Qualified</h5>
                                <p className="text-sm text-green-700 mb-2">If the lead meets all minimum qualification criteria:</p>
                                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                    <li>Complete all required CRM fields.</li>
                                    <li>Add clear summary notes.</li>
                                    <li>Move the opportunity to the <strong>Qualified Lead</strong> stage.</li>
                                </ul>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                                <h5 className="font-bold text-red-800 text-lg mb-2">B. Disqualified</h5>
                                <p className="text-sm text-red-700 mb-2">If the lead does not meet qualification criteria:</p>
                                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                    <li>Move the opportunity to <strong>Lost</strong>.</li>
                                    <li>Select the appropriate Disqualified Reason.</li>
                                    <li>Add a brief explanatory note.</li>
                                </ul>
                            </div>
                        </div>
                        <p className={s.p + " mt-4"}>Accurate categorization is essential for reporting, marketing optimization, and sales forecasting.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Special Circumstances */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Special Circumstances</h4>
                        <p className={s.p}>In limited situations, it may be appropriate to proceed directly into a Discovery Call during the Qualification Call.</p>
                        <p className={s.p}>This is only acceptable if:</p>
                        <ul className={s.bulletList}>
                            <li>All decision makers are present.</li>
                            <li>The environment is quiet and free of distractions.</li>
                            <li>Adequate time is available for a full discussion.</li>
                            <li>The lead clearly meets all qualification criteria.</li>
                        </ul>
                        <p className={s.p}>In most cases, best practice is to schedule a dedicated Discovery Call to ensure proper preparation and stakeholder participation.</p>
                        <p className={s.p}>If proceeding directly to Discovery:</p>
                        <ul className={s.bulletList}>
                            <li>Follow the full Discovery Call structure.</li>
                            <li>Update the opportunity stage accordingly.</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 10. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>10. Completion Criteria</h4>
                        <p className={s.p}>A lead should not remain in the New Lead stage without active follow-up.</p>
                        <p className={s.p}>The New Lead stage is considered complete when:</p>
                        <ul className={s.bulletList}>
                            <li>Contact attempts have been made according to the required cadence, and</li>
                            <li>The opportunity has been moved to either:</li>
                        </ul>
                        <ul className="list-disc list-inside ml-8 mt-1 text-base text-gray-800 leading-relaxed">
                            <li>Qualified Lead, or</li>
                            <li>Lost (with a documented Disqualified Reason).</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 11. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>11. Accountability</h4>
                        <p className={s.p}>This stage directly impacts:</p>
                        <ul className={s.bulletList}>
                            <li>Show rates</li>
                            <li>Close rates</li>
                            <li>Marketing return on investment</li>
                            <li>Overall revenue performance</li>
                        </ul>
                        <p className={s.p}>Strict adherence to this procedure is required to maintain system integrity and predictable sales performance.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};


// 2. Handling Qualified Lead View
const HandlingQualifiedLeadView = () => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: Qualified Lead</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the “Qualified Lead” stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage in the CRM by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; Qualified Lead</p>
                        <p className={s.p}>This stage is accessible on both the desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of a Qualified Lead */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of a Qualified Lead</h4>
                        <p className={s.p}>A lead is placed in the Qualified Lead stage when they have met all minimum qualification criteria through one of the following methods:</p>
                        <ul className={s.bulletList}>
                            <li><strong>Manual Qualification Call:</strong> The sales representative completed a Qualification Call and confirmed the lead meets required standards.</li>
                            <li><strong>Website Application:</strong> The lead completed an application form and met the automated qualification criteria.</li>
                        </ul>
                        <p className={s.p}>Both the Qualification Call and the Application Form evaluate the same core criteria (project type, location, budget, timeline, and decision-making authority).</p>
                        <p className={s.p}>At this stage, the lead has been verified as eligible to proceed to the next step in the sales process.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Purpose of the Qualified Lead Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Purpose of the Qualified Lead Stage</h4>
                        <p className={s.p}>The sole purpose of this stage is to:</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900 text-lg">Book a Discovery Call.</p>
                        </div>
                        <p className={s.p}>This stage is not for ongoing nurturing, extended conversations, or repeated re-qualification.</p>
                        <p className={s.p}>Qualified leads should not remain in this stage longer than <strong>3–5 days</strong>.</p>
                        <p className={s.p}>Within that timeframe, the outcome must be one of the following:</p>
                        <ul className={s.bulletList}>
                            <li>A Discovery Call is booked, or</li>
                            <li>The lead is marked as Lost (Uninterested).</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Required Outreach Activity */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Required Outreach Activity</h4>
                        <p className={s.p}>Primary outreach methods at this stage:</p>
                        <ul className={s.bulletList}>
                            <li>Text message</li>
                            <li>Phone call</li>
                        </ul>
                        <p className={s.p}>The objective of outreach is simple and direct: Determine whether the lead would like to schedule a time to discuss their project in more detail.</p>
                        <p className={s.p}>Messaging should be concise and professional.</p>

                        <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h5 className="font-bold text-gray-900 mb-2">Example Approach:</h5>
                            <ul className={s.bulletList}>
                                <li>Confirm interest in moving forward.</li>
                                <li>Offer to schedule a time to discuss their project in more depth.</li>
                                <li>Provide availability or guide them toward booking.</li>
                            </ul>
                        </div>
                        <p className={s.p + " mt-4"}>Avoid long back-and-forth conversations at this stage. The objective is to secure a scheduled Discovery Call.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Decision Outcomes */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Decision Outcomes</h4>
                        <p className={s.p}>There are only two acceptable outcomes in the Qualified Lead stage.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                <h5 className="font-bold text-green-800 text-lg mb-2">A. Lead Is Interested</h5>
                                <p className="text-sm text-green-700 mb-2">If the lead confirms they would like to move forward:</p>
                                <ol className="list-decimal list-inside text-sm text-green-700 space-y-1">
                                    <li>Navigate to the contact record.</li>
                                    <li>Click on Appointments.</li>
                                    <li>Schedule a “Discovery Call.”</li>
                                </ol>
                                <p className="text-xs text-green-600 mt-2 italic">Once booked, opportunity automatically moves to Discovery Call Booked stage.</p>
                                <div className="mt-3 pt-3 border-t border-green-200">
                                    <p className="font-bold text-green-800 text-xs uppercase mb-1">Confirm:</p>
                                    <ul className="list-disc list-inside text-xs text-green-700">
                                        <li>Date and time</li>
                                        <li>Correct contact information</li>
                                        <li>All relevant notes are documented</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                                <h5 className="font-bold text-red-800 text-lg mb-2">B. Lead Is Not Interested</h5>
                                <p className="text-sm text-red-700 mb-2">If the lead explicitly states they are not interested in proceeding:</p>
                                <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
                                    <li>Move the opportunity to <strong>Lost</strong>.</li>
                                    <li>Select the reason: <strong>Uninterested</strong>.</li>
                                    <li>Add a brief note summarizing the interaction.</li>
                                </ol>
                                <p className="text-xs text-red-600 mt-2 italic">This ensures accurate reporting and prevents unnecessary follow-up.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Time-in-Stage Standard */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Time-in-Stage Standard</h4>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="font-bold text-yellow-900">No Qualified Lead should remain in this stage beyond 3–5 days without active engagement.</p>
                        </div>
                        <p className={s.p}>If no response is received after reasonable outreach attempts:</p>
                        <ul className={s.bulletList}>
                            <li>Continue short-term follow-up according to team standards.</li>
                            <li>If interest is clearly absent, move to Lost with appropriate documentation.</li>
                        </ul>
                        <p className={s.p}>Allowing leads to sit indefinitely in this stage disrupts forecasting and pipeline clarity.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Completion Criteria</h4>
                        <p className={s.p}>The Qualified Lead stage is complete when:</p>
                        <ul className={s.bulletList}>
                            <li>A Discovery Call has been scheduled, or</li>
                            <li>The opportunity has been moved to Lost with reason “Uninterested.”</li>
                        </ul>
                        <p className={s.p}>There should be no ambiguity in status.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Accountability</h4>
                        <p className={s.p}>This stage directly impacts:</p>
                        <ul className={s.bulletList}>
                            <li>Show rates</li>
                            <li>Sales cycle length</li>
                            <li>Close rates</li>
                            <li>Revenue predictability</li>
                        </ul>
                        <p className={s.p}>Timely booking of Discovery Calls is essential to maintaining pipeline velocity and operational alignment.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};


// 3. Handling Discovery Call Booked View
const HandlingDiscoveryBookedView = ({ onLinkClick }: { onLinkClick?: (title: string) => void }) => {
    // Standard Styles
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
            <section className={s.paper}>
                {/* Header */}
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: Discovery Call Booked</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the “Discovery Call Booked” stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; Discovery Call Booked</p>
                        <p className={s.p}>Appointments can also be viewed in:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Calendars &rarr; Appointments</p>
                        <p className={s.p}>This stage is accessible on both desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of This Stage</h4>
                        <p className={s.p}>A lead enters the Discovery Call Booked stage automatically when a Discovery Call appointment is scheduled.</p>
                        <p className={s.p}>No manual stage movement is required.</p>
                        <p className={s.p}>When the Discovery Call is completed and properly marked in the CRM, the opportunity will automatically move to the Discovery Call Completed stage.</p>
                        <p className={s.p}>This stage serves primarily as:</p>
                        <ul className={s.bulletList}>
                            <li>A visibility dashboard of scheduled Discovery Calls</li>
                            <li>A tracking stage for upcoming sales conversations</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Purpose of the Discovery Call Booked Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Purpose of the Discovery Call Booked Stage</h4>
                        <p className={s.p}>The purpose of this stage is to:</p>
                        <ul className={s.bulletList}>
                            <li>Monitor scheduled Discovery Calls</li>
                            <li>Ensure proper preparation before each appointment</li>
                            <li>Maintain visibility into pipeline activity</li>
                        </ul>
                        <p className={s.p}>This stage is not for qualification or extended follow-up. It is a holding stage for confirmed Discovery appointments.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Required Preparation Before the Call */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Required Preparation Before the Call</h4>
                        <p className={s.p}>Prior to each Discovery Call:</p>
                        <ol className={s.list}>
                            <li>Open the opportunity record.</li>
                            <li>Review all existing notes, including:
                                <ul className="list-disc list-inside ml-4 mt-1">
                                    <li>Qualification Call notes (if applicable)</li>
                                    <li>Application responses (if applicable)</li>
                                </ul>
                            </li>
                            <li>Confirm:
                                <ul className="list-disc list-inside ml-4 mt-1">
                                    <li>All decision makers are expected to attend.</li>
                                    <li>The scheduled time is accurate.</li>
                                    <li>Contact details are correct.</li>
                                </ul>
                            </li>
                        </ol>
                        <p className={s.p}>Preparation is mandatory to ensure a structured and productive conversation.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Required Call Procedure */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Required Call Procedure</h4>
                        <p className={s.p}>All Discovery Calls must be conducted through the CRM dialing system.</p>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-bold text-red-900">Do not place calls using a personal mobile device or external calling platform.</p>
                        </div>
                        <p className={s.p}>Calling through the CRM ensures:</p>
                        <ul className={s.bulletList}>
                            <li>The call is recorded.</li>
                            <li>The call is transcribed.</li>
                            <li>An AI-generated summary is created.</li>
                            <li>All documentation is stored in the opportunity record.</li>
                        </ul>

                        <h5 className="font-bold text-gray-900 mt-4 text-lg">Discovery Call Script</h5>
                        <p className={s.p}>The Discovery Call must follow the standardized Discovery Call Script.</p>
                        <p className={s.p}>
                            <button onClick={() => onLinkClick && onLinkClick("Discovery Call Script")} className="text-indigo-600 underline font-medium hover:text-indigo-800 flex items-center">
                                Open Discovery Call Script <ArrowRight size={16} className="ml-1" />
                            </button>
                        </p>
                        <p className={s.p}>Sales representatives are required to follow the script structure to ensure:</p>
                        <ul className={s.bulletList}>
                            <li>Consistent questioning</li>
                            <li>Proper budget and scope clarification</li>
                            <li>Accurate next-step alignment</li>
                            <li>Uniform sales execution across the team</li>
                        </ul>
                        <p className={s.p}>Do not improvise or skip required sections of the script.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Accessing Recordings, Transcripts, and Summaries */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Accessing Recordings, Transcripts, and Summaries</h4>
                        <p className={s.p}>After the call:</p>
                        <ol className={s.list}>
                            <li>Open the opportunity record.</li>
                            <li>Navigate to the Notes section.</li>
                            <li>Review:
                                <ul className="list-disc list-inside ml-4 mt-1">
                                    <li>The call recording</li>
                                    <li>The transcript</li>
                                    <li>The AI-generated summary</li>
                                </ul>
                            </li>
                        </ol>
                        <p className={s.p}>These records must be reviewed before progressing the opportunity to ensure accuracy and completeness.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Stage Automation */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Stage Automation</h4>
                        <p className={s.p}>Stage movement is automated:</p>
                        <ul className={s.bulletList}>
                            <li>When a Discovery Call is scheduled &rarr; the opportunity automatically moves to <strong>Discovery Call Booked</strong>.</li>
                            <li>When the Discovery Call is marked as completed &rarr; the opportunity automatically moves to <strong>Discovery Call Completed</strong>.</li>
                        </ul>
                        <p className={s.p}>Manual movement should not be necessary.</p>
                        <p className={s.p}>If automation does not function properly, notify the system administrator immediately.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Completion Criteria</h4>
                        <p className={s.p}>An opportunity remains in this stage until:</p>
                        <ul className={s.bulletList}>
                            <li>The Discovery Call has been completed and properly logged in the CRM.</li>
                        </ul>
                        <p className={s.p}>If the prospect cancels or fails to attend, follow the designated No-Show or Reschedule procedure.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Accountability</h4>
                        <p className={s.p}>Using the CRM calling system is mandatory.</p>
                        <p className={s.p}>Failure to call through the CRM results in:</p>
                        <ul className={s.bulletList}>
                            <li>No call recording</li>
                            <li>No transcript</li>
                            <li>No AI summary</li>
                            <li>Reduced coaching visibility</li>
                            <li>Incomplete documentation</li>
                        </ul>
                        <p className={s.p}>System adherence ensures process integrity, performance visibility, and operational consistency.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};


// 4. Handling Discovery Call Completed View
const HandlingDiscoveryCompletedView = () => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: Discovery Call Completed</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the "Discovery Call Completed" stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; Discovery Call Completed</p>
                        <p className={s.p}>This stage is accessible on both desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of This Stage</h4>
                        <p className={s.p}>An opportunity automatically moves to Discovery Call Completed once a scheduled Discovery Call has been marked complete in the CRM.</p>
                        <p className={s.p}>This stage serves two primary purposes:</p>
                        <ul className={s.bulletList}>
                            <li>To confirm the call outcome has been properly recorded.</li>
                            <li>To determine and execute the correct next step in the sales process.</li>
                        </ul>
                        <p className={s.p}>No opportunity should remain in this stage without a clearly defined next action.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Required Immediate Action: Update Call Outcome */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Required Immediate Action: Update Call Outcome</h4>
                        <p className={s.p}>Immediately after the scheduled call time, you must update the call status in the Calendar.</p>
                        <p className={s.p}>Navigate to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Calendars &rarr; Appointments &rarr; Select the Appointment</p>
                        <p className={s.p}>You must select one of the following outcomes:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                                <p className="font-bold text-green-800 text-lg">Showed</p>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                                <p className="font-bold text-red-800 text-lg">No Show</p>
                            </div>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-3">
                            <p className="font-bold text-red-900">Updating this field is mandatory.</p>
                        </div>
                        <p className={s.p}>Failure to update the appointment outcome will disrupt reporting, automation, and follow-up sequences.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. If the Prospect Is a No Show */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. If the Prospect Is a No Show</h4>
                        <p className={s.p}>If the prospect does not attend the call at the scheduled time or does not answer:</p>
                        <ul className={s.bulletList}>
                            <li>Mark the appointment outcome as <strong>No Show</strong>.</li>
                            <li>Ensure the opportunity remains in the appropriate follow-up path.</li>
                        </ul>
                        <p className={s.p}>An automated follow-up sequence will initiate to:</p>
                        <ul className={s.bulletList}>
                            <li>Re-engage the prospect</li>
                            <li>Encourage rescheduling</li>
                            <li>Provide booking options</li>
                        </ul>
                        <p className={s.p}>Do not manually override this process unless directed.</p>
                        <p className={s.p}>Continue monitoring engagement and rescheduling activity.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. If the Prospect Showed */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. If the Prospect Showed</h4>
                        <p className={s.p}>If the prospect attended the Discovery Call, mark the appointment as <strong>Showed</strong> and determine the correct next-stage outcome.</p>
                        <p className={s.p}>There are only four acceptable next steps:</p>

                        {/* A. Lost – Uninterested */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-red-800 text-lg mb-2">A. Lost – Uninterested</h5>
                            <p className="text-sm text-red-700 mb-2">If the prospect clearly states they are not interested in moving forward:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Move the opportunity to <strong>Lost</strong>.</li>
                                <li>Select the reason: <strong>Uninterested</strong>.</li>
                                <li>Add summary notes explaining the outcome.</li>
                            </ul>
                        </div>

                        {/* B. Lost – Disqualified */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h5 className="font-bold text-red-800 text-lg mb-2">B. Lost – Disqualified</h5>
                            <p className="text-sm text-red-700 mb-2">If, during the Discovery Call, it becomes clear that the prospect does not meet qualification standards:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Move the opportunity to <strong>Lost</strong>.</li>
                                <li>Select the reason: <strong>Disqualified</strong>.</li>
                                <li>Add summary notes explaining why.</li>
                            </ul>
                            <p className="text-xs text-red-600 mt-2 italic">Accurate categorization ensures reliable reporting and marketing feedback.</p>
                        </div>

                        {/* C. Not Booked Follow Ups */}
                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                            <h5 className="font-bold text-yellow-800 text-lg mb-2">C. Not Booked Follow Ups</h5>
                            <p className="text-sm text-yellow-700 mb-2">If the Discovery Call was positive but you were unable to secure an in-person meeting:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                <li>Move the opportunity to <strong>Not Booked Follow Ups</strong>.</li>
                            </ul>
                            <p className="text-sm text-yellow-700 mt-2">This stage is used when:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                <li>The conversation went well.</li>
                                <li>The prospect expressed interest.</li>
                                <li>An in-person meeting was not scheduled during the call.</li>
                            </ul>
                            <p className="text-sm text-yellow-700 mt-2">Add detailed notes summarizing:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                <li>Objections</li>
                                <li>Concerns</li>
                                <li>Timeline hesitations</li>
                                <li>Agreed next steps</li>
                            </ul>
                            <p className="text-xs text-yellow-600 mt-2 italic">This stage requires structured follow-up.</p>
                        </div>

                        {/* D. In-Person Meeting Booked */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                            <h5 className="font-bold text-green-800 text-lg mb-2">D. In-Person Meeting Booked</h5>
                            <p className="text-sm text-green-700 mb-2">If an in-person meeting was scheduled during the Discovery Call:</p>
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                <li>Schedule the appointment in the CRM.</li>
                                <li>Once scheduled, the opportunity will automatically move to <strong>In-Person Meeting Booked</strong>.</li>
                            </ul>
                            <p className="text-xs text-green-600 mt-2 italic">No manual stage movement is required.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Documentation Requirements */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Documentation Requirements</h4>
                        <p className={s.p}>After every Discovery Call (Showed only):</p>
                        <ul className={s.bulletList}>
                            <li>Review the call recording, transcript, and AI summary in the Notes section of the opportunity.</li>
                            <li>Add any additional context or clarifications not captured automatically.</li>
                            <li>Ensure all required CRM fields are completed.</li>
                        </ul>
                        <p className={s.p}>Documentation ensures:</p>
                        <ul className={s.bulletList}>
                            <li>Coaching visibility</li>
                            <li>Accurate forecasting</li>
                            <li>Process integrity</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Completion Criteria</h4>
                        <p className={s.p}>An opportunity should not remain in the Discovery Call Completed stage without:</p>
                        <ul className={s.bulletList}>
                            <li>Appointment outcome updated, and</li>
                            <li>A clearly defined next pipeline stage selected.</li>
                        </ul>
                        <p className={s.p}>This stage is a transition checkpoint, not a holding area.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Accountability</h4>
                        <p className={s.p}>This stage directly impacts:</p>
                        <ul className={s.bulletList}>
                            <li>Close rate accuracy</li>
                            <li>Forecast reliability</li>
                            <li>Follow-up effectiveness</li>
                            <li>Marketing feedback loops</li>
                        </ul>
                        <p className={s.p}>Failure to properly categorize outcomes creates pipeline distortion and unreliable reporting.</p>
                        <p className={s.p}>Strict adherence to this procedure is required.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 5. Handling Not Booked Follow Ups View
const HandlingNotBookedFollowUpsView = () => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: Not Booked Follow Ups</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the "Not Booked Follow Ups" stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; Not Booked Follow Ups</p>
                        <p className={s.p}>This stage is accessible on both desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of This Stage</h4>
                        <p className={s.p}>An opportunity is moved to Not Booked Follow Ups when:</p>
                        <ul className={s.bulletList}>
                            <li>The Discovery Call has been completed.</li>
                            <li>The prospect is qualified.</li>
                            <li>An in-person meeting was not scheduled.</li>
                        </ul>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-2">
                            <p className="text-indigo-900">These are <strong>not</strong> unqualified leads.<br />These are <strong>not</strong> uninterested leads.</p>
                            <p className="text-indigo-900 mt-2">These are qualified prospects who, for one reason or another, were not ready to schedule the next step.</p>
                        </div>
                        <p className={s.p}>Common reasons include:</p>
                        <ul className={s.bulletList}>
                            <li>Waiting to purchase land</li>
                            <li>On vacation</li>
                            <li>Waiting for a job promotion or income change</li>
                            <li>Finalizing financing</li>
                            <li>Personal timing constraints</li>
                        </ul>
                        <p className={s.p}>This stage is reserved exclusively for qualified prospects who expressed legitimate interest but require additional time.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Purpose of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Purpose of This Stage</h4>
                        <p className={s.p}>The purpose of this stage is to:</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900">Maintain structured, personalized follow-up with qualified prospects until they are ready to book an in-person meeting.</p>
                        </div>
                        <p className={s.p}>These are among the most valuable opportunities in the pipeline because:</p>
                        <ul className={s.bulletList}>
                            <li>They have engaged in a Discovery Call.</li>
                            <li>They have met qualification standards.</li>
                            <li>They are aware of the process.</li>
                            <li>They have shown genuine interest.</li>
                        </ul>
                        <p className={s.p}>Proper follow-up here directly impacts close rate and long-term revenue.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Follow-Up Standards */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Follow-Up Standards</h4>
                        <p className={s.p}>All follow-up in this stage must be:</p>
                        <ul className={s.bulletList}>
                            <li><strong>Manual</strong></li>
                            <li><strong>Personalized</strong></li>
                            <li><strong>Context-aware</strong></li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Automated nurture sequences should not replace personal outreach at this stage.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Personalization Requirement */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Personalization Requirement</h4>
                        <p className={s.p}>Before every follow-up:</p>
                        <ul className={s.bulletList}>
                            <li>Review the contact record.</li>
                            <li>Review opportunity notes.</li>
                            <li>Review call recordings and AI summaries if necessary.</li>
                        </ul>
                        <p className={s.p}>Follow-ups must reference their specific situation.</p>
                        <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h5 className="font-bold text-gray-900 mb-2">Examples:</h5>
                            <ul className={s.bulletList}>
                                <li>If they are purchasing land, ask whether the purchase has been finalized.</li>
                                <li>If they are waiting on financing, ask whether they have received updates.</li>
                                <li>If they mentioned a specific timeline, reference it directly.</li>
                            </ul>
                        </div>
                        <p className={s.p}>Follow-up should demonstrate that you understand their situation and are aligned with their goals.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Follow-Up Cadence */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Follow-Up Cadence</h4>
                        <p className={s.p}>Follow-up timing should be based on the prospect's stated reason for delay.</p>
                        <p className={s.p}>There are two acceptable structures:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                <h5 className="font-bold text-green-800 text-lg mb-2">A. Specific Date Follow-Up</h5>
                                <p className="text-sm text-green-700 mb-2">If the prospect provided a clear timeline:</p>
                                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                    <li>Create a task or reminder for that exact date.</li>
                                    <li>Follow up as agreed.</li>
                                    <li>Reference the prior conversation directly.</li>
                                </ul>
                                <p className="text-xs text-green-600 mt-2 italic">This is the preferred method when a timeline is provided.</p>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                <h5 className="font-bold text-blue-800 text-lg mb-2">B. General Ongoing Follow-Up</h5>
                                <p className="text-sm text-blue-700 mb-2">If no specific date was provided:</p>
                                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                    <li>Follow up every 1–2 weeks.</li>
                                    <li>Maintain professional, value-oriented communication.</li>
                                    <li>Avoid excessive messaging.</li>
                                </ul>
                                <p className="text-xs text-blue-600 mt-2 italic">The purpose is to remain present without creating pressure.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Objective of Follow-Up */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Objective of Follow-Up</h4>
                        <p className={s.p}>The objective at this stage is clear:</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900 text-lg">Secure an in-person meeting.</p>
                        </div>
                        <p className={s.p}>The in-person meeting allows you to:</p>
                        <ul className={s.bulletList}>
                            <li>Build deeper rapport</li>
                            <li>Establish trust</li>
                            <li>Strengthen emotional commitment</li>
                            <li>Present services in greater detail</li>
                        </ul>
                        <p className={s.p}>All follow-up should naturally guide toward scheduling this next step.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Movement Out of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Movement Out of This Stage</h4>
                        <p className={s.p}>There are three possible outcomes from this stage:</p>

                        {/* A. In-Person Meeting Booked */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-green-800 text-lg mb-2">A. In-Person Meeting Booked</h5>
                            <p className="text-sm text-green-700 mb-2">If the prospect agrees to schedule an in-person meeting:</p>
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                <li>Schedule the appointment in the CRM.</li>
                                <li>The opportunity will automatically move to <strong>In-Person Meeting Booked</strong>.</li>
                            </ul>
                            <p className="text-xs text-green-600 mt-2 italic">No manual stage movement is required.</p>
                        </div>

                        {/* B. Lost – Uninterested */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h5 className="font-bold text-red-800 text-lg mb-2">B. Lost – Uninterested</h5>
                            <p className="text-sm text-red-700 mb-2">If the prospect clearly communicates they no longer wish to proceed:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Move the opportunity to <strong>Lost</strong>.</li>
                                <li>Select the appropriate reason.</li>
                                <li>Add summary notes.</li>
                            </ul>
                        </div>

                        {/* C. Abandoned */}
                        <div className="bg-gray-100 border border-gray-200 rounded-xl p-6">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">C. Abandoned</h5>
                            <p className="text-sm text-gray-700 mb-2">If the prospect becomes unresponsive and:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Multiple follow-up attempts have been made, and</li>
                                <li>Several months have passed without engagement,</li>
                            </ul>
                            <p className="text-sm text-gray-700 mt-2">Move the opportunity to <strong>Abandoned</strong>.</p>
                            <p className="text-sm text-gray-700 mt-2">Add a clear note summarizing:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Last contact attempt</li>
                                <li>Duration of inactivity</li>
                                <li>Follow-up history</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2 italic">This keeps the pipeline accurate and forecastable.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Completion Criteria</h4>
                        <p className={s.p}>An opportunity should not remain in Not Booked Follow Ups without:</p>
                        <ul className={s.bulletList}>
                            <li>Documented follow-up activity, and</li>
                            <li>A scheduled next touchpoint.</li>
                        </ul>
                        <p className={s.p}>Stagnant opportunities distort pipeline visibility and reduce accountability.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 10. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>10. Accountability</h4>
                        <p className={s.p}>This stage directly impacts:</p>
                        <ul className={s.bulletList}>
                            <li>Long-cycle deal conversion</li>
                            <li>Pipeline stability</li>
                            <li>Revenue forecasting</li>
                            <li>Overall close rate</li>
                        </ul>
                        <p className={s.p}>Consistent, personalized follow-up is required to maximize conversion from qualified prospects.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 6. Handling In-Person Meeting Booked View
const HandlingInPersonMeetingBookedView = ({ onLinkClick }: { onLinkClick?: (title: string) => void }) => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: In-Person Meeting Booked</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the "In-Person Meeting Booked" stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; In-Person Meeting Booked</p>
                        <p className={s.p}>Appointments can also be viewed in:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Calendars &rarr; Appointments</p>
                        <p className={s.p}>This stage is accessible on both desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of This Stage</h4>
                        <p className={s.p}>An opportunity enters the In-Person Meeting Booked stage automatically when an in-person appointment is scheduled in the CRM.</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-2">
                            <p className="font-bold text-indigo-900">No manual stage movement is required.</p>
                        </div>
                        <p className={s.p}>When the in-person meeting is completed and the appointment is marked accordingly, the opportunity will move to the appropriate next stage based on the outcome.</p>
                        <p className={s.p}>This stage serves as:</p>
                        <ul className={s.bulletList}>
                            <li>A visibility dashboard for scheduled in-person meetings</li>
                            <li>A preparation checkpoint before a high-commitment sales conversation</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Purpose of the In-Person Meeting */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Purpose of the In-Person Meeting</h4>
                        <p className={s.p}>The in-person meeting is designed to:</p>
                        <ul className={s.bulletList}>
                            <li>Strengthen trust and authority</li>
                            <li>Deepen emotional commitment</li>
                            <li>Align on scope and expectations</li>
                            <li>Position next agreements or commitments</li>
                        </ul>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-3">
                            <p className="font-bold text-indigo-900">Whenever possible, this meeting should take place at your office.</p>
                        </div>
                        <p className={s.p}>Hosting the meeting in your office environment:</p>
                        <ul className={s.bulletList}>
                            <li>Establishes authority</li>
                            <li>Reinforces professionalism</li>
                            <li>Creates a controlled setting</li>
                            <li>Positions your company as the trusted expert</li>
                        </ul>
                        <p className={s.p}>Meeting at a prospect's home should only occur when necessary.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Required Preparation Before the Meeting */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Required Preparation Before the Meeting</h4>
                        <p className={s.p}>Prior to the meeting:</p>
                        <p className={s.p}>Open the opportunity record.</p>
                        <p className={s.p}>Review:</p>
                        <ul className={s.bulletList}>
                            <li>Discovery Call notes</li>
                            <li>Call recordings and transcripts</li>
                            <li>AI-generated summaries</li>
                            <li>Any objections or hesitations previously expressed</li>
                        </ul>
                        <p className={s.p}>Confirm:</p>
                        <ul className={s.bulletList}>
                            <li>All decision makers are attending</li>
                            <li>The meeting location is confirmed</li>
                            <li>The time is accurate</li>
                            <li>Any required documents or materials are prepared</li>
                        </ul>
                        <p className={s.p}>Preparation must be intentional and tailored to the prospect's specific situation.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Required Meeting Procedure */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Required Meeting Procedure</h4>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900">Follow the standardized In-Person Meeting Script.</p>
                        </div>
                        <p className={s.p}>You must follow the official <button onClick={() => onLinkClick && onLinkClick("In-Person Meeting Script")} className="text-indigo-600 underline font-medium hover:text-indigo-800">In-Person Meeting Script</button> located in the Resources section of the SOP library. Before the meeting, you must also prepare your <button onClick={() => onLinkClick && onLinkClick("Presentation Pillar Examples")} className="text-indigo-600 underline font-medium hover:text-indigo-800">Presentation Pillars</button> — these are the core value statements and proof points that anchor your authority and guide the conversation.</p>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Do not conduct the meeting informally or without structure.</p>
                        </div>
                        <p className={s.p}>The meeting should include:</p>
                        <ul className={s.bulletList}>
                            <li>Clear agenda setting</li>
                            <li>Scope discussion</li>
                            <li>Budget alignment</li>
                            <li>Process explanation</li>
                            <li>Next-step clarity</li>
                        </ul>
                        <p className={s.p}>Maintain control of the conversation while allowing the prospect to feel heard and understood.</p>
                        <p className={s.p}>Authority should be conveyed through confidence, clarity, and structure—not pressure.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Updating Appointment Outcome */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Updating Appointment Outcome</h4>
                        <p className={s.p}>Immediately after the meeting:</p>
                        <p className={s.p}>Navigate to <span className="font-medium text-gray-900 bg-gray-50 p-1 rounded text-sm">Calendars &rarr; Appointments</span>.</p>
                        <p className={s.p}>Select the meeting.</p>
                        <p className={s.p}>Update the appointment outcome to:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                                <p className="font-bold text-green-800 text-lg">Showed</p>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                                <p className="font-bold text-red-800 text-lg">No Show</p>
                            </div>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-3">
                            <p className="font-bold text-red-900">This update is mandatory for reporting and automation accuracy.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. If the Prospect Is a No Show */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. If the Prospect Is a No Show</h4>
                        <p className={s.p}>If the prospect fails to attend:</p>
                        <ul className={s.bulletList}>
                            <li>Mark the appointment outcome as <strong>No Show</strong>.</li>
                            <li>Follow internal reschedule procedures.</li>
                            <li>Initiate manual follow-up if necessary.</li>
                        </ul>
                        <p className={s.p}>Do not leave the opportunity idle without a defined next step.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. If the Prospect Showed */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. If the Prospect Showed</h4>
                        <p className={s.p}>If the meeting occurred, determine the correct next-stage outcome.</p>
                        <p className={s.p}>Common next steps include:</p>

                        {/* A. Agreement Stage */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-green-800 text-lg mb-2">A. Agreement Stage</h5>
                            <p className="text-sm text-green-700 mb-2">If the prospect commits to moving forward:</p>
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                <li>Schedule the appropriate agreement or next commitment.</li>
                                <li>The opportunity should move to the corresponding agreement stage.</li>
                            </ul>
                        </div>

                        {/* B. Not Closed Follow Ups */}
                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                            <h5 className="font-bold text-yellow-800 text-lg mb-2">B. Not Closed Follow Ups</h5>
                            <p className="text-sm text-yellow-700 mb-2">If the meeting went well but no agreement was secured:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                <li>Move the opportunity to <strong>Not Closed Follow Ups</strong>.</li>
                                <li>Document objections, concerns, and timeline considerations.</li>
                            </ul>
                        </div>

                        {/* C. Lost */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h5 className="font-bold text-red-800 text-lg mb-2">C. Lost</h5>
                            <p className="text-sm text-red-700 mb-2">If the prospect declines to proceed:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Move the opportunity to <strong>Lost</strong>.</li>
                                <li>Select the appropriate reason.</li>
                                <li>Add summary notes.</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Documentation Requirements */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Documentation Requirements</h4>
                        <p className={s.p}>After every in-person meeting:</p>
                        <p className={s.p}>Add detailed notes summarizing:</p>
                        <ul className={s.bulletList}>
                            <li>Key concerns</li>
                            <li>Emotional drivers</li>
                            <li>Decision dynamics</li>
                            <li>Agreed next steps</li>
                        </ul>
                        <p className={s.p}>Ensure required CRM fields are completed.</p>
                        <p className={s.p}>Accurate documentation ensures:</p>
                        <ul className={s.bulletList}>
                            <li>Forecast reliability</li>
                            <li>Coaching visibility</li>
                            <li>Process consistency</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 10. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>10. Completion Criteria</h4>
                        <p className={s.p}>An opportunity should not remain in the In-Person Meeting Booked stage without:</p>
                        <ul className={s.bulletList}>
                            <li>Appointment outcome updated, and</li>
                            <li>Clear next-stage movement defined.</li>
                        </ul>
                        <p className={s.p}>This stage is a transition checkpoint, not a holding stage.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 11. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>11. Accountability</h4>
                        <p className={s.p}>This meeting is one of the highest-impact stages in the sales process.</p>
                        <p className={s.p}>Execution quality directly influences:</p>
                        <ul className={s.bulletList}>
                            <li>Close rate</li>
                            <li>Average project size</li>
                            <li>Sales cycle length</li>
                            <li>Revenue predictability</li>
                        </ul>
                        <p className={s.p}>Preparation, professionalism, and system compliance are mandatory.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 7. Handling In-Person Meeting Completed View
const HandlingInPersonMeetingCompletedView = () => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: In-Person Meeting Completed</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the "In-Person Meeting Completed" stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; In-Person Meeting Completed</p>
                        <p className={s.p}>This stage is accessible on both desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of This Stage</h4>
                        <p className={s.p}>An opportunity moves to In-Person Meeting Completed after the scheduled in-person meeting has occurred and the appointment outcome has been marked accordingly in the CRM.</p>
                        <p className={s.p}>This stage serves as a decision checkpoint.</p>
                        <p className={s.p}>Its purpose is to:</p>
                        <ul className={s.bulletList}>
                            <li>Finalize the meeting outcome</li>
                            <li>Determine the correct next pipeline stage</li>
                            <li>Ensure documentation and forecasting accuracy</li>
                        </ul>
                        <p className={s.p}>No opportunity should remain in this stage without a defined next action.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Required Immediate Action */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Required Immediate Action: Update Appointment Outcome</h4>
                        <p className={s.p}>Immediately following the meeting:</p>
                        <p className={s.p}>Navigate to <span className="font-medium text-gray-900 bg-gray-50 p-1 rounded text-sm">Calendars &rarr; Appointments</span>.</p>
                        <p className={s.p}>Select the appointment.</p>
                        <p className={s.p}>Mark the outcome as:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                                <p className="font-bold text-green-800 text-lg">Showed</p>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                                <p className="font-bold text-red-800 text-lg">No Show</p>
                            </div>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-3">
                            <p className="font-bold text-red-900">This step is mandatory for automation and reporting accuracy.</p>
                        </div>
                        <p className={s.p}>Failure to update the appointment outcome will create pipeline inconsistencies.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. If the Prospect Was a No Show */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. If the Prospect Was a No Show</h4>
                        <p className={s.p}>If the prospect did not attend the meeting:</p>
                        <ul className={s.bulletList}>
                            <li>Mark the appointment as <strong>No Show</strong>.</li>
                            <li>Initiate follow-up to reschedule.</li>
                            <li>Document the situation in the opportunity notes.</li>
                        </ul>
                        <p className={s.p}>If the prospect becomes unresponsive after multiple follow-up attempts, move according to internal abandonment procedures.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. If the Prospect Showed */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. If the Prospect Showed</h4>
                        <p className={s.p}>If the meeting occurred, you must determine the appropriate next stage immediately.</p>
                        <p className={s.p}>There are only four acceptable outcomes.</p>

                        {/* A. Agreement Signed */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-green-800 text-lg mb-2">A. Agreement Signed</h5>
                            <p className="text-sm text-green-700 mb-2">If the prospect committed and signed the next agreement (Concept Design Agreement, Pre-Construction Agreement, etc.):</p>
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                <li>Ensure the agreement is properly documented.</li>
                                <li>Confirm payment (if applicable).</li>
                                <li>Move the opportunity to the appropriate agreement stage.</li>
                            </ul>
                            <p className="text-xs text-green-600 mt-2 italic">If automation is configured correctly, the stage may move automatically once the agreement is executed.</p>
                        </div>

                        {/* B. Not Closed Follow Ups */}
                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                            <h5 className="font-bold text-yellow-800 text-lg mb-2">B. Not Closed Follow Ups</h5>
                            <p className="text-sm text-yellow-700 mb-2">If the meeting was productive but the prospect did not commit:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                <li>Move the opportunity to <strong>Not Closed Follow Ups</strong>.</li>
                            </ul>
                            <p className="text-sm text-yellow-700 mt-2">This applies when:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                <li>Objections remain</li>
                                <li>Pricing requires consideration</li>
                                <li>Financing is pending</li>
                                <li>Internal discussions are required</li>
                            </ul>
                            <p className="text-sm text-yellow-700 mt-2">Add detailed notes outlining:</p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                <li>Key objections</li>
                                <li>Emotional drivers</li>
                                <li>Decision dynamics</li>
                                <li>Specific next follow-up date</li>
                            </ul>
                            <p className="text-xs text-yellow-600 mt-2 italic">This stage requires structured follow-up and active management.</p>
                        </div>

                        {/* C. Lost – Uninterested */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h5 className="font-bold text-red-800 text-lg mb-2">C. Lost – Uninterested</h5>
                            <p className="text-sm text-red-700 mb-2">If the prospect clearly declines to move forward:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Move the opportunity to <strong>Lost</strong>.</li>
                                <li>Select the reason: <strong>Uninterested</strong>.</li>
                                <li>Add summary notes explaining the decision.</li>
                            </ul>
                        </div>

                        {/* D. Lost – Disqualified */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h5 className="font-bold text-red-800 text-lg mb-2">D. Lost – Disqualified</h5>
                            <p className="text-sm text-red-700 mb-2">If new information reveals the prospect does not meet required criteria:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Move the opportunity to <strong>Lost</strong>.</li>
                                <li>Select the reason: <strong>Disqualified</strong>.</li>
                                <li>Add detailed notes documenting the reason.</li>
                            </ul>
                            <p className="text-xs text-red-600 mt-2 italic">Accurate categorization ensures reliable reporting and marketing feedback.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Documentation Requirements */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Documentation Requirements</h4>
                        <p className={s.p}>After every in-person meeting (Showed only):</p>
                        <p className={s.p}>Add structured notes summarizing:</p>
                        <ul className={s.bulletList}>
                            <li>Project scope</li>
                            <li>Budget alignment</li>
                            <li>Timeline clarity</li>
                            <li>Decision-maker dynamics</li>
                            <li>Objections and concerns</li>
                            <li>Emotional indicators</li>
                            <li>Agreed next steps</li>
                        </ul>
                        <p className={s.p}>Confirm all required CRM fields are completed.</p>
                        <p className={s.p}>Documentation at this stage directly impacts forecasting and coaching quality.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Completion Criteria</h4>
                        <p className={s.p}>An opportunity should not remain in In-Person Meeting Completed without:</p>
                        <ul className={s.bulletList}>
                            <li>Appointment outcome updated</li>
                            <li>Detailed notes added</li>
                            <li>A clearly defined next pipeline stage</li>
                        </ul>
                        <p className={s.p}>This stage is a transition point, not a holding area.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Accountability</h4>
                        <p className={s.p}>This stage directly affects:</p>
                        <ul className={s.bulletList}>
                            <li>Close rate</li>
                            <li>Average contract value</li>
                            <li>Revenue predictability</li>
                            <li>Sales cycle duration</li>
                        </ul>
                        <p className={s.p}>Delays or unclear categorization at this stage distort forecasting and reduce operational clarity.</p>
                        <p className={s.p}>Strict adherence to this procedure is required.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 8. Handling Not Closed Follow Ups View
const HandlingNotClosedFollowUpsView = () => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: Not Closed Follow Ups</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to the "Not Closed Follow Ups" stage within the Sales Pipeline.</p>
                        <p className={s.p}>You can locate this stage by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; Not Closed Follow Ups</p>
                        <p className={s.p}>This stage is accessible on both desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of This Stage</h4>
                        <p className={s.p}>An opportunity enters Not Closed Follow Ups when:</p>
                        <ul className={s.bulletList}>
                            <li>An in-person meeting has been completed, and</li>
                            <li>The prospect did not sign or commit to the next agreement, but</li>
                            <li>The opportunity remains viable.</li>
                        </ul>
                        <p className={s.p}>These prospects are:</p>
                        <ul className={s.bulletList}>
                            <li>Qualified</li>
                            <li>Engaged</li>
                            <li>Aware of the process</li>
                            <li>Considering moving forward</li>
                        </ul>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-2">
                            <p className="font-bold text-indigo-900">They have not said no.</p>
                            <p className="font-bold text-indigo-900">They have not been disqualified.</p>
                            <p className="font-bold text-indigo-900">They simply have not committed yet.</p>
                        </div>
                        <p className={s.p}>This is an active, revenue-potential stage.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Purpose of This Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Purpose of This Stage</h4>
                        <p className={s.p}>The purpose of this stage is to:</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900">Maintain structured, strategic follow-up until a clear decision is reached.</p>
                        </div>
                        <p className={s.p}>This stage exists to:</p>
                        <ul className={s.bulletList}>
                            <li>Resolve objections</li>
                            <li>Clarify concerns</li>
                            <li>Reinforce value</li>
                            <li>Regain momentum</li>
                            <li>Secure commitment</li>
                        </ul>
                        <p className={s.p}>Opportunities in this stage must be actively managed.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Documentation Requirement (Before Follow-Up) */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Documentation Requirement (Before Follow-Up)</h4>
                        <p className={s.p}>Before initiating any follow-up:</p>
                        <ul className={s.bulletList}>
                            <li>Review opportunity notes.</li>
                            <li>Review call transcripts and summaries.</li>
                        </ul>
                        <p className={s.p}>Identify:</p>
                        <ul className={s.bulletList}>
                            <li>Primary objection(s)</li>
                            <li>Emotional hesitation points</li>
                            <li>Financial concerns</li>
                            <li>Decision-maker dynamics</li>
                            <li>Timeline constraints</li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Do not follow up generically.</p>
                        </div>
                        <p className={s.p}>Follow-up must address the specific reason the deal did not close.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Follow-Up Standards */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Follow-Up Standards</h4>
                        <p className={s.p}>All outreach in this stage must be:</p>
                        <ul className={s.bulletList}>
                            <li>Manual</li>
                            <li>Personalized</li>
                            <li>Context-driven</li>
                            <li>Intentional</li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Avoid automated nurture sequences replacing direct engagement.</p>
                        </div>
                        <p className={s.p}>Follow-up methods may include:</p>
                        <ul className={s.bulletList}>
                            <li>Phone calls</li>
                            <li>Personalized text messages</li>
                            <li>Targeted emails</li>
                        </ul>
                        <p className={s.p}>The tone should be professional and solution-oriented, not pressured.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Follow-Up Cadence */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Follow-Up Cadence</h4>
                        <p className={s.p}>Follow-up cadence should be aligned with the prospect's stated timing.</p>

                        {/* If a Specific Date Was Given */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">If a Specific Date Was Given:</h5>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Schedule a task for that date.</li>
                                <li>Follow up exactly as agreed.</li>
                                <li>Reference the previous conversation.</li>
                            </ul>
                            <p className="text-xs text-blue-600 mt-2 italic">This maintains credibility and trust.</p>
                        </div>

                        {/* If No Specific Date Was Given */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">If No Specific Date Was Given:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Follow up every 1–2 weeks.</li>
                                <li>Keep communication purposeful and relevant.</li>
                                <li>Avoid excessive contact.</li>
                            </ul>
                            <p className="text-xs text-gray-600 mt-2 italic">Each interaction should move the conversation toward resolution.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Objective of Follow-Up */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Objective of Follow-Up</h4>
                        <p className={s.p}>The objective at this stage is clear:</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900">Secure commitment to the next agreement.</p>
                        </div>
                        <p className={s.p}>This may include:</p>
                        <ul className={s.bulletList}>
                            <li>Concept Design Agreement</li>
                            <li>Pre-Construction Agreement</li>
                            <li>Construction Contract</li>
                        </ul>
                        <p className={s.p}>All follow-up should aim to:</p>
                        <ul className={s.bulletList}>
                            <li>Rebuild urgency</li>
                            <li>Re-establish authority</li>
                            <li>Clarify value</li>
                            <li>Remove uncertainty</li>
                        </ul>
                        <p className={s.p}>Momentum must be intentionally recreated.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Possible Outcomes */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Possible Outcomes</h4>
                        <p className={s.p}>There are three acceptable outcomes from this stage.</p>

                        {/* A. Agreement Signed */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-green-800 text-lg mb-2">A. Agreement Signed</h5>
                            <p className="text-sm text-green-700 mb-2">If the prospect commits:</p>
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                <li>Execute the agreement.</li>
                                <li>Confirm payment if applicable.</li>
                                <li>Move the opportunity to the appropriate agreement stage.</li>
                                <li>Ensure all documentation is completed.</li>
                            </ul>
                        </div>

                        {/* B. Lost – Uninterested */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h5 className="font-bold text-red-800 text-lg mb-2">B. Lost – Uninterested</h5>
                            <p className="text-sm text-red-700 mb-2">If the prospect clearly declines to move forward:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Move the opportunity to <strong>Lost</strong>.</li>
                                <li>Select the appropriate reason.</li>
                                <li>Add detailed notes.</li>
                            </ul>
                            <p className="text-xs text-red-600 mt-2 italic">This ensures reporting accuracy and protects forecast integrity.</p>
                        </div>

                        {/* C. Abandoned */}
                        <div className="bg-gray-100 border border-gray-200 rounded-xl p-6">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">C. Abandoned</h5>
                            <p className="text-sm text-gray-700 mb-2">If the prospect becomes unresponsive after:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Multiple follow-up attempts, and</li>
                                <li>An extended period of inactivity (typically several months),</li>
                            </ul>
                            <p className="text-sm text-gray-700 mt-2">Move the opportunity to <strong>Abandoned</strong>.</p>
                            <p className="text-sm text-gray-700 mt-2">Document:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Date of last contact</li>
                                <li>Number of attempts made</li>
                                <li>Summary of previous objections</li>
                            </ul>
                            <p className="text-xs text-gray-600 mt-2 italic">This keeps the pipeline clean and realistic.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Performance Standard */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Performance Standard</h4>
                        <p className={s.p}>Opportunities in Not Closed Follow Ups must:</p>
                        <ul className={s.bulletList}>
                            <li>Have a documented next action.</li>
                            <li>Have a scheduled follow-up date.</li>
                            <li>Not remain idle without activity.</li>
                        </ul>
                        <p className={s.p}>Stalled deals distort forecasting and reduce accountability.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 10. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>10. Accountability</h4>
                        <p className={s.p}>This stage directly impacts:</p>
                        <ul className={s.bulletList}>
                            <li>Close rate</li>
                            <li>Revenue recovery</li>
                            <li>Sales cycle length</li>
                            <li>Forecast reliability</li>
                        </ul>
                        <p className={s.p}>High-performing sales teams convert a significant percentage of revenue from this stage.</p>
                        <p className={s.p}>Consistent, strategic follow-up is required.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 9. Handling Agreements Signed View
const HandlingAgreementsSignedView = () => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pipeline Stage: Agreements</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Location in CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Location in CRM</h4>
                        <p className={s.p}>This procedure applies to all Agreement stages within the Sales Pipeline.</p>
                        <p className={s.p}>Depending on your sales structure, you may have multiple agreement stages, such as:</p>
                        <ul className={s.bulletList}>
                            <li>Concept Design Agreement</li>
                            <li>Pre-Construction Agreement</li>
                            <li>Construction Contract</li>
                            <li>Change Order Agreement</li>
                            <li>Additional Services Agreement</li>
                        </ul>
                        <p className={s.p}>You can locate these stages by navigating to:</p>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded inline-block text-sm">Opportunities &rarr; Sales Pipeline &rarr; [Agreement Stage Name]</p>
                        <p className={s.p}>These stages are accessible on both desktop and mobile versions of the CRM.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Definition of Agreement Stages */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Definition of Agreement Stages</h4>
                        <p className={s.p}>An Agreement stage represents a formal commitment from the prospect.</p>
                        <p className={s.p}>When an opportunity enters an Agreement stage:</p>
                        <ul className={s.bulletList}>
                            <li>Revenue has been secured.</li>
                            <li>A contract has been executed.</li>
                            <li>The prospect has transitioned into an active client (for that phase of work).</li>
                        </ul>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-2">
                            <p className="font-bold text-green-900">Agreement stages signal that revenue has been won and must be tracked accurately.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Multiple Agreement Stages */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Multiple Agreement Stages</h4>
                        <p className={s.p}>Depending on your sales process, you may structure your pipeline with multiple agreement stages to reflect different phases of the project.</p>
                        <p className={s.p}>Examples include:</p>
                        <ul className={s.bulletList}>
                            <li>Design phase agreements</li>
                            <li>Pre-construction agreements</li>
                            <li>Construction contracts</li>
                            <li>Add-on services</li>
                        </ul>
                        <p className={s.p}>Each agreement stage should clearly represent a defined revenue milestone in your process.</p>
                        <p className={s.p}>This allows:</p>
                        <ul className={s.bulletList}>
                            <li>Accurate revenue forecasting</li>
                            <li>Phase-by-phase tracking</li>
                            <li>Clear handoff to operations</li>
                            <li>Better reporting and accountability</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Movement Into Agreement Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Movement Into Agreement Stage</h4>
                        <p className={s.p}>Movement into an Agreement stage must be done manually unless automation has been specifically configured.</p>
                        <p className={s.p}>Before moving an opportunity into an Agreement stage, confirm:</p>
                        <ul className={s.bulletList}>
                            <li>The agreement has been fully executed.</li>
                            <li>Required signatures have been obtained.</li>
                            <li>Any required deposit or payment has been received (if applicable).</li>
                            <li>Documentation is properly stored.</li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Do not move an opportunity into an Agreement stage based on verbal commitment alone.</p>
                        </div>
                        <p className={s.p}>Only executed agreements qualify.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Required Actions When an Agreement Is Signed */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Required Actions When an Agreement Is Signed</h4>
                        <p className={s.p}>When an agreement is finalized:</p>
                        <p className={s.p}>Move the opportunity to the appropriate Agreement stage.</p>
                        <p className={s.p}>Confirm and document:</p>
                        <ul className={s.bulletList}>
                            <li>Contract value</li>
                            <li>Payment amount received</li>
                            <li>Remaining balance</li>
                            <li>Start timeline (if applicable)</li>
                        </ul>
                        <p className={s.p}>Add structured notes summarizing:</p>
                        <ul className={s.bulletList}>
                            <li>Scope covered under this agreement</li>
                            <li>Any special conditions</li>
                            <li>Key expectations discussed</li>
                        </ul>
                        <p className={s.p}>This ensures financial accuracy and operational clarity.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Revenue Tracking */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Revenue Tracking</h4>
                        <p className={s.p}>Agreement stages are used to:</p>
                        <ul className={s.bulletList}>
                            <li>Track secured revenue</li>
                            <li>Monitor sales performance</li>
                            <li>Measure close rates</li>
                            <li>Forecast upcoming work</li>
                        </ul>
                        <p className={s.p}>Accurate stage movement directly impacts reporting.</p>
                        <p className={s.p}>Incorrect categorization distorts:</p>
                        <ul className={s.bulletList}>
                            <li>Revenue projections</li>
                            <li>Cash flow planning</li>
                            <li>Sales performance metrics</li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Strict accuracy is required.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Handoff to Operations */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Handoff to Operations</h4>
                        <p className={s.p}>After moving an opportunity into an Agreement stage:</p>
                        <ul className={s.bulletList}>
                            <li>Notify the appropriate operations team member (if required).</li>
                            <li>Ensure all documents are accessible.</li>
                            <li>Confirm next operational steps are clear.</li>
                        </ul>
                        <p className={s.p}>Sales and operations alignment begins at this stage.</p>
                        <p className={s.p}>Improper documentation at this point creates downstream execution issues.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Completion Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Completion Criteria</h4>
                        <p className={s.p}>An opportunity belongs in an Agreement stage only when:</p>
                        <ul className={s.bulletList}>
                            <li>The agreement has been fully executed.</li>
                            <li>Required payments (if applicable) have been received.</li>
                            <li>Documentation is complete.</li>
                            <li>Notes are accurate and detailed.</li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">No exceptions.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Accountability */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Accountability</h4>
                        <p className={s.p}>Agreement stages directly impact:</p>
                        <ul className={s.bulletList}>
                            <li>Revenue reporting</li>
                            <li>Cash flow forecasting</li>
                            <li>Sales performance tracking</li>
                            <li>Operational planning</li>
                        </ul>
                        <p className={s.p}>This stage marks the transition from opportunity to secured revenue.</p>
                        <p className={s.p}>Precision and documentation discipline are mandatory.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 10. Sales Representative Role & Performance Standards View
const SalesRepPerformanceStandardsView = () => {
    // Standard Styles
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Sales Representative Role & Performance Standards</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Purpose */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Purpose</h4>
                        <p className={s.p}>This document defines the performance standards, activity expectations, KPI benchmarks, and CRM discipline required of all Sales Representatives.</p>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-bold text-red-900">These standards are mandatory.</p>
                        </div>
                        <p className={s.p}>The purpose of this SOP is to:</p>
                        <ul className={s.bulletList}>
                            <li>Create measurable accountability</li>
                            <li>Protect pipeline integrity</li>
                            <li>Maintain consistent performance</li>
                            <li>Align sales activity with revenue targets</li>
                            <li>Ensure operational predictability</li>
                        </ul>
                        <p className={s.p}>Without defined standards, process adherence declines and performance becomes inconsistent.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Role Definition */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Role Definition</h4>
                        <p className={s.p}>The Sales Representative is responsible for:</p>
                        <ul className={s.bulletList}>
                            <li>Converting qualified leads into signed agreements</li>
                            <li>Maintaining accurate CRM records</li>
                            <li>Executing follow-up with discipline</li>
                            <li>Advancing opportunities efficiently through the pipeline</li>
                            <li>Protecting revenue opportunities</li>
                        </ul>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-2">
                            <p className="font-bold text-indigo-900">Sales is not measured by effort.</p>
                            <p className="font-bold text-indigo-900">Sales is measured by outcomes and adherence to system standards.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Daily Activity Minimums */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Daily Activity Minimums</h4>
                        <p className={s.p}>Minimum daily standards (unless otherwise approved):</p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">New Leads</h5>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Contact 100% of new leads within SLA (see Speed-to-Lead below)</li>
                                <li>Minimum of 4 call attempts per new lead over 4 days if no answer</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Active Opportunities</h5>
                            <p className="text-sm text-blue-700 mb-2">Review all opportunities in:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Qualified Lead</li>
                                <li>Not Booked Follow Ups</li>
                                <li>Not Closed Follow Ups</li>
                            </ul>
                            <p className="text-sm text-blue-700 mt-2">Ensure each has a next action scheduled</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Outbound Activity (if applicable)</h5>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Minimum outbound calls: [Define number based on structure]</li>
                                <li>Follow-up messages: As required per stage SOP</li>
                            </ul>
                        </div>

                        <p className={s.p}>Daily activity must be visible in the CRM.</p>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-bold text-red-900">If activity is not logged, it did not happen.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Speed-to-Lead Standard */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Speed-to-Lead Standard</h4>
                        <p className={s.p}>All New Leads must be contacted within:</p>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900 text-lg">5 minutes of entry into the CRM</p>
                        </div>
                        <p className={s.p}>Performance expectation:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                                <p className="text-xs text-green-600 uppercase font-medium mb-1">Target</p>
                                <p className="font-bold text-green-800 text-lg">Under 5 minutes</p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
                                <p className="text-xs text-yellow-600 uppercase font-medium mb-1">Acceptable Maximum</p>
                                <p className="font-bold text-yellow-800 text-lg">10 minutes</p>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                                <p className="text-xs text-red-600 uppercase font-medium mb-1">Unacceptable</p>
                                <p className="font-bold text-red-800 text-lg">Over 10 minutes</p>
                            </div>
                        </div>
                        <p className={s.p}>Speed-to-lead directly impacts:</p>
                        <ul className={s.bulletList}>
                            <li>Contact rate</li>
                            <li>Show rate</li>
                            <li>Close rate</li>
                            <li>Revenue per lead</li>
                        </ul>
                        <p className={s.p}>Failure to meet this standard reduces marketing ROI.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Required CRM Hygiene */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Required CRM Hygiene</h4>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-bold text-red-900">CRM discipline is mandatory.</p>
                        </div>
                        <p className={s.p}>Each Sales Representative must:</p>
                        <ul className={s.bulletList}>
                            <li>Log all calls through the CRM</li>
                            <li>Use CRM dialing system for recorded calls</li>
                            <li>Add structured notes after:
                                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    <li>Qualification Calls</li>
                                    <li>Discovery Calls</li>
                                    <li>In-Person Meetings</li>
                                </ul>
                            </li>
                            <li>Select correct Lost reasons</li>
                            <li>Update appointment outcomes (Showed / No Show)</li>
                            <li>Ensure all required fields are completed before stage movement</li>
                        </ul>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-2">
                            <p className="font-bold text-indigo-900">Pipeline integrity is non-negotiable.</p>
                        </div>
                        <p className={s.p}>Inaccurate or incomplete data results in unreliable forecasting and performance tracking.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Required Follow-Up Cadence */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Required Follow-Up Cadence</h4>
                        <p className={s.p}>All follow-up must comply with stage-specific SOPs.</p>
                        <p className={s.p}>Minimum standards:</p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">New Leads</h5>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Immediate call</li>
                                <li>Daily call attempts for 4 days if no response</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Qualified Leads</h5>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Active outreach until Discovery is booked</li>
                                <li>No lead remains in stage longer than 3–5 days without resolution</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Not Booked Follow Ups</h5>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Follow up on agreed date</li>
                                <li>Otherwise every 1–2 weeks</li>
                                <li>Personalized only</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Not Closed Follow Ups</h5>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Follow up based on objection timing</li>
                                <li>No opportunity remains idle without next action</li>
                            </ul>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Stalled pipeline entries are unacceptable.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. KPI Performance Targets */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. KPI Performance Targets</h4>
                        <p className={s.p}>The following KPIs are monitored weekly and monthly.</p>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">1. Contact Rate</h5>
                            <p className="text-sm text-gray-700 mb-1">Percentage of leads successfully contacted.</p>
                            <p className="text-sm text-gray-700">Target: <strong>60–80%+</strong></p>
                            <p className="text-xs text-gray-500 mt-1 italic">Below 50% requires review.</p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">2. Show Rate</h5>
                            <p className="text-sm text-gray-700 mb-1">Percentage of booked Discovery Calls that show.</p>
                            <p className="text-sm text-gray-700">Target: <strong>70–85%+</strong></p>
                            <p className="text-xs text-gray-500 mt-1 italic">Below 65% requires improvement plan.</p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">3. Close Rate</h5>
                            <p className="text-sm text-gray-700 mb-1">Percentage of qualified opportunities that convert to signed agreement.</p>
                            <p className="text-sm text-gray-700">Target: <strong>[Define based on business model]</strong></p>
                            <p className="text-xs text-gray-500 mt-1 italic">Typically 20–40% for high-ticket custom work.</p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">4. Revenue Per Representative</h5>
                            <p className="text-sm text-gray-700 mb-1">Total revenue generated per rep per month.</p>
                            <p className="text-sm text-gray-700">Target: <strong>Defined by company revenue goals and capacity.</strong></p>
                            <p className="text-xs text-gray-500 mt-1 italic">Tracked monthly.</p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">5. Time in Stage</h5>
                            <p className="text-sm text-gray-700 mb-2">Maximum acceptable stage durations:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>New Lead: <strong>4 days maximum</strong></li>
                                <li>Qualified Lead: <strong>3–5 days maximum</strong></li>
                                <li>Discovery Completed: <strong>Immediate next-stage movement</strong></li>
                                <li>Not Booked Follow Ups: <strong>Active cadence required</strong></li>
                                <li>Not Closed Follow Ups: <strong>Active cadence required</strong></li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2 italic">Extended stage aging without activity requires intervention.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Weekly Performance Review */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Weekly Performance Review</h4>
                        <p className={s.p}>Each Sales Representative will participate in a weekly review including:</p>
                        <ul className={s.bulletList}>
                            <li>Pipeline overview</li>
                            <li>Stage aging analysis</li>
                            <li>KPI tracking</li>
                            <li>Call review (selected recordings)</li>
                            <li>Objection patterns</li>
                            <li>Forecast discussion</li>
                        </ul>
                        <p className={s.p}>The objective is performance improvement and revenue growth.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Accountability Standards */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Accountability Standards</h4>
                        <p className={s.p}>Failure to meet standards may result in:</p>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                <li>Performance coaching</li>
                                <li>Improvement plan</li>
                                <li>Reduced lead flow</li>
                                <li>Reassignment of opportunities</li>
                            </ul>
                        </div>
                        <p className={s.p}>Top performers receive:</p>
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                            <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                                <li>Priority lead distribution</li>
                                <li>Growth opportunities</li>
                                <li>Performance-based incentives</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 10. Forecasting Responsibility */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>10. Forecasting Responsibility</h4>
                        <p className={s.p}>Sales Representatives are responsible for:</p>
                        <ul className={s.bulletList}>
                            <li>Maintaining realistic deal stages</li>
                            <li>Accurately categorizing Lost and Abandoned opportunities</li>
                            <li>Providing honest revenue forecasts</li>
                        </ul>
                        <p className={s.p}>Overstating pipeline strength damages operational planning and credibility.</p>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Accuracy is required.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 11. Definition of Done */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>11. Definition of Done</h4>
                        <p className={s.p}>A Sales Representative is performing at standard when:</p>
                        <ul className={s.bulletList}>
                            <li>Speed-to-lead is consistently under 5 minutes</li>
                            <li>CRM records are complete and clean</li>
                            <li>Follow-ups are active and personalized</li>
                            <li>KPIs meet or exceed targets</li>
                            <li>Pipeline movement is consistent</li>
                            <li>Revenue targets are met</li>
                        </ul>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-2">
                            <p className="font-bold text-indigo-900">This SOP defines professional performance.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 11. CRM Data Integrity & Pipeline Governance View
const CRMDataIntegrityView = () => {
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
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">CRM Data Integrity & Pipeline Governance</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* 1. Purpose */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>1. Purpose</h4>
                        <p className={s.p}>This SOP defines the required standards for CRM data accuracy, pipeline hygiene, conversation management, and opportunity governance.</p>
                        <p className={s.p}>The objective is to:</p>
                        <ul className={s.bulletList}>
                            <li>Maintain clean, reliable pipeline data</li>
                            <li>Ensure accurate forecasting</li>
                            <li>Protect marketing feedback loops</li>
                            <li>Prevent stage inflation</li>
                            <li>Maintain fast response times</li>
                            <li>Enable scalable growth</li>
                        </ul>
                        <p className={s.p}>If CRM data or conversations are disorganized, decision-making becomes unreliable and revenue is impacted.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Core Principle */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>2. Core Principle</h4>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-bold text-red-900">If it is not logged correctly in the CRM:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                                <li>It did not happen.</li>
                                <li>It does not count.</li>
                                <li>It cannot be forecasted.</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-bold text-red-900">If a message is not handled:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                                <li>The lead is not being managed.</li>
                                <li>Revenue is being risked.</li>
                            </ul>
                        </div>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900">System integrity is mandatory.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Required Fields Per Stage */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>3. Required Fields Per Stage</h4>
                        <p className={s.p}>No opportunity may move stages without completing the required fields for that stage.</p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">New Lead – Required Fields</h5>
                            <p className="text-sm text-blue-700 mb-2">Before moving out of New Lead:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Lead Source (required)</li>
                                <li>Contact Attempt Logged</li>
                                <li>Qualification Fields Completed:
                                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                        <li>Project Type</li>
                                        <li>Location</li>
                                        <li>Budget Range</li>
                                        <li>Timeline</li>
                                        <li>Decision Maker Confirmed (Yes/No)</li>
                                    </ul>
                                </li>
                            </ul>
                            <p className="text-sm text-blue-700 mt-2">If disqualified:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Lost Reason selected</li>
                                <li>Brief explanatory note added</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Qualified Lead – Required Fields</h5>
                            <p className="text-sm text-blue-700 mb-2">Before booking Discovery:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Qualification confirmed</li>
                                <li>Budget verified</li>
                                <li>Timeline confirmed</li>
                                <li>Decision maker status documented</li>
                                <li>Summary note added</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Discovery Call Completed – Required Fields</h5>
                            <p className="text-sm text-blue-700 mb-2">Before stage movement:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Appointment outcome marked (Showed / No Show)</li>
                                <li>Discovery summary note added</li>
                                <li>Objections documented</li>
                                <li>Clear next step defined</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">In-Person Meeting Completed – Required Fields</h5>
                            <p className="text-sm text-blue-700 mb-2">Before stage movement:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Appointment outcome marked</li>
                                <li>Budget alignment confirmed</li>
                                <li>Objections logged</li>
                                <li>Next action documented</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">Agreement Stage – Required Fields</h5>
                            <p className="text-sm text-blue-700 mb-2">Before moving into Agreement stage:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Agreement executed</li>
                                <li>Contract value entered</li>
                                <li>Payment status recorded</li>
                                <li>Agreement type selected</li>
                                <li>Scope summary note added</li>
                            </ul>
                            <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-3">
                                <p className="font-bold text-red-900 text-sm">Verbal agreements do not qualify.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Mandatory Note Requirements */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>4. Mandatory Note Requirements</h4>
                        <p className={s.p}>Notes are required after:</p>
                        <ul className={s.bulletList}>
                            <li>Qualification Calls</li>
                            <li>Discovery Calls</li>
                            <li>In-Person Meetings</li>
                            <li>Agreement Signings</li>
                            <li>Objection Discussions</li>
                            <li>Timeline Changes</li>
                            <li>Budget Changes</li>
                            <li>Major Status Changes</li>
                        </ul>
                        <p className={s.p}>Notes must include:</p>
                        <ul className={s.bulletList}>
                            <li>Summary of discussion</li>
                            <li>Key concerns</li>
                            <li>Objections</li>
                            <li>Decision dynamics</li>
                            <li>Clear next step</li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Generic notes such as "Good call" are not acceptable.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 5. Objection Logging Standards */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>5. Objection Logging Standards</h4>
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="font-bold text-indigo-900">All objections must be categorized.</p>
                        </div>
                        <p className={s.p}>When an objection arises:</p>
                        <ol className={s.list}>
                            <li>Document it in Notes.</li>
                            <li>Apply appropriate Objection Tag (if configured).</li>
                            <li>Categorize as:</li>
                        </ol>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                            {["Price", "Timing", "Financing", "Comparison", "Spouse/Partner", "Scope", "Other (with explanation)"].map((item, i) => (
                                <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                    <p className="text-sm font-medium text-gray-700">{item}</p>
                                </div>
                            ))}
                        </div>
                        <p className={s.p}>Uncategorized objections eliminate valuable pattern tracking.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 6. Lost Reason Categorization */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>6. Lost Reason Categorization</h4>
                        <p className={s.p}>When moving an opportunity to Lost:</p>
                        <ul className={s.bulletList}>
                            <li>A Lost Reason must be selected.</li>
                            <li>A supporting note must be added.</li>
                        </ul>
                        <p className={s.p}>Approved Lost Reasons include:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                            {["Uninterested", "Disqualified", "Budget Too Low", "Timeline Too Far Out", "Chose Competitor", "Financing Denied", "Internal Decision Change", "Other (with explanation)"].map((item, i) => (
                                <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                                    <p className="text-sm font-medium text-red-700">{item}</p>
                                </div>
                            ))}
                        </div>
                        <p className={s.p}>Incorrect categorization distorts close-rate metrics.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 7. Abandoned Movement Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>7. Abandoned Movement Criteria</h4>
                        <p className={s.p}>An opportunity may be moved to Abandoned when:</p>
                        <ul className={s.bulletList}>
                            <li>Multiple follow-up attempts have been made</li>
                            <li>60–90 days of inactivity have passed</li>
                            <li>The prospect is unresponsive</li>
                            <li>No future tasks are scheduled</li>
                        </ul>
                        <p className={s.p}>Before moving to Abandoned:</p>
                        <ul className={s.bulletList}>
                            <li>Confirm follow-up attempts are logged.</li>
                            <li>Add summary note with last contact date.</li>
                            <li>Confirm no pending tasks remain.</li>
                        </ul>
                        <p className={s.p}>This keeps the pipeline realistic and forecastable.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 8. Duplicate Contact Handling */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>8. Duplicate Contact Handling</h4>
                        <p className={s.p}>Duplicate records distort reporting.</p>
                        <p className={s.p}>If a duplicate is identified:</p>
                        <ol className={s.list}>
                            <li>Identify the most complete contact record.</li>
                            <li>Merge records (if CRM allows).</li>
                            <li>Confirm opportunity history remains intact.</li>
                            <li>Ensure no duplicate active opportunities exist.</li>
                        </ol>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Never allow two active opportunities for the same prospect.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 9. Conversations Tab Management Standards */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>9. Conversations Tab Management Standards</h4>
                        <p className={s.p}>The Conversations tab must remain clean and actively managed.</p>
                        <p className={s.p}>Failure to manage Conversations results in:</p>
                        <ul className={s.bulletList}>
                            <li>Missed messages</li>
                            <li>Slow response times</li>
                            <li>Lost deals</li>
                            <li>Decreased show rates</li>
                        </ul>
                        <p className={s.p}>The following standards apply:</p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-4">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">A. Mark as Read</h5>
                            <p className="text-sm text-blue-700 mb-2">All conversations must be marked as Read once:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>The message has been reviewed.</li>
                                <li>A response has been sent (if required).</li>
                                <li>The next action has been scheduled.</li>
                            </ul>
                            <p className="text-sm text-blue-700 mt-2">Unread conversations should only exist when immediate action is required.</p>
                            <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-3">
                                <p className="font-bold text-red-900 text-sm">Unread inboxes are unacceptable.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">B. Star Priority Conversations</h5>
                            <p className="text-sm text-blue-700 mb-2">Star conversations that are:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>High-value opportunities</li>
                                <li>Active negotiations</li>
                                <li>Objection-sensitive deals</li>
                                <li>Time-sensitive follow-ups</li>
                                <li>Agreement-stage prospects</li>
                            </ul>
                            <p className="text-sm text-blue-700 mt-2">Starring helps prioritize revenue-critical conversations.</p>
                            <p className="text-sm text-blue-700 mt-1">Priority conversations should be reviewed daily.</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h5 className="font-bold text-blue-800 text-lg mb-2">C. No Open Loops</h5>
                            <p className="text-sm text-blue-700 mb-2">No conversation should remain without:</p>
                            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>A reply, or</li>
                                <li>A scheduled follow-up task.</li>
                            </ul>
                            <p className="text-sm text-blue-700 mt-2">Conversations must always tie back to a pipeline stage and next action.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 10. Stage Aging Governance */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>10. Stage Aging Governance</h4>
                        <p className={s.p}>Maximum stage durations:</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-2">
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                                <li>New Lead: <strong>4 days</strong></li>
                                <li>Qualified Lead: <strong>3–5 days</strong></li>
                                <li>Discovery Completed: <strong>Immediate movement</strong></li>
                                <li>Not Booked Follow Ups: <strong>Must have scheduled next touch</strong></li>
                                <li>Not Closed Follow Ups: <strong>Must have scheduled next touch</strong></li>
                                <li>Agreement Stages: <strong>Move promptly to operational phase</strong></li>
                            </ul>
                        </div>
                        <p className={s.p}>Stage aging violations must be reviewed weekly.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 11. Weekly Pipeline & Data Review */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>11. Weekly Pipeline & Data Review</h4>
                        <p className={s.p}>Each week, management must review:</p>
                        <ul className={s.bulletList}>
                            <li>Opportunities with no activity in 14+ days</li>
                            <li>Missing required fields</li>
                            <li>Missing Lost reasons</li>
                            <li>Stage aging violations</li>
                            <li>Duplicate records</li>
                            <li>Unread Conversations</li>
                            <li>Starred priority conversations</li>
                        </ul>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2">
                            <p className="font-bold text-red-900">Corrections must be made immediately.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 12. Definition of a Clean CRM */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>12. Definition of a Clean CRM</h4>
                        <p className={s.p}>A clean CRM means:</p>
                        <ul className={s.bulletList}>
                            <li>All required fields completed</li>
                            <li>All appointment outcomes updated</li>
                            <li>All objections logged</li>
                            <li>Lost reasons accurate</li>
                            <li>No duplicate contacts</li>
                            <li>No stage-aging violations</li>
                            <li>No unread critical messages</li>
                            <li>All priority conversations starred and monitored</li>
                        </ul>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-2">
                            <p className="font-bold text-green-900">If this standard is maintained:</p>
                            <ul className="list-disc list-inside text-sm text-green-700 mt-2 space-y-1">
                                <li>Forecasting becomes reliable</li>
                                <li>Close rates improve</li>
                                <li>Marketing optimization becomes accurate</li>
                                <li>Scaling becomes controlled</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Custom View for Qualification Script
const QualificationScriptView = () => {
    // Standard Styles for the "Document" look (Matching DiscoveryScriptView)
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
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Qualification Call (TEMPLATE)</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    {/* When To Conduct */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>When To Conduct Qualification Calls:</h4>
                        <p className={s.p}>
                            When you receive a new lead, meaning somebody you haven’t spoken to before puts in their contact information via your website, paid ads, social media, or even calls you directly.
                        </p>
                        <p className={s.p}>
                            You should be calling them within 5 minutes of them becoming a new lead. Studies show that engaging a lead within 1 minute of them becoming a lead increases conversions by up to 391%. And shockingly, only 7% of companies consistently follow-up within 5 minutes.
                        </p>
                    </div>

                    {/* How To Prepare */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Prepare For Qualification Calls:</h4>
                        <p className={s.p}>
                            Always start by reviewing their form submission. If they just gave their name and phone number, you can’t do very much. But in some cases, you ask other questions on the form and these responses must be reviewed to show the lead your professionalism.
                        </p>
                        <p className={s.p}>
                            For example, if the lead inquires about a new custom home and selects they already own land, don’t ask the question about land ownership, rather, ask where their lot is located.
                        </p>
                        <p className={s.p}>
                            And always cross-reference the lead’s contact information with your CRM database. In some cases, the lead may have already reached out years ago and you can use the information that you previously documented from the past to build instant rapport.
                        </p>
                    </div>

                    {/* How To Qualify */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Qualify / Disqualify Leads:</h4>
                        <p className={s.p}>
                            The qualification call isn’t about selling — it’s about quickly figuring out if this person is someone we can genuinely help right now. Every question in the script has a reason behind it. Your goal is to understand whether they’re ready, realistic, and within the boundaries of what we actually do. If they aren’t, end the call kindly and professionally. Here’s how to think through each question when you’re on the phone.
                        </p>

                        <ol className={s.list}>
                            <li>
                                <strong>Motivation</strong> — “So tell me, what caught your eye or made you want to reach out to us?”<br />
                                This one is simple — you’re trying to understand what made them reach out in the first place. If they mention a specific project, ad, or referral, it means they’re genuinely interested and paying attention. If they sound unsure or can’t remember, they’re probably just browsing. You don’t need to disqualify someone just for being early, but you should mentally note how warm they feel and how aware they are of who we are. It also tells you what part of our marketing is actually working.
                            </li>
                            <li>
                                <strong>Location</strong> — “Do you have an idea of where you’re looking to build?”<br />
                                You’re checking if the project is even within reach. If it’s inside your service area, great — keep going. If it’s outside, there’s no point in continuing. Politely let them know it’s not a match and wish them well. This one’s purely about logistics and fit. The earlier you confirm this, the less time you waste chasing projects you can’t take on.
                            </li>
                            <li>
                                <strong>Land Ownership</strong> — “Have you decided on a piece of land yet or purchased one?”<br />
                                This tells you how close they are to actually building. If they already own land or are in the middle of buying, they’re qualified to move forward. You can even ask for the address and basic details about the lot so your team can prep properly later. If they don’t have land yet, they can’t do much with us right now. Still, always stay helpful — offer to point them toward a realtor or let them know if you have lots available. Even if you disqualify them for now, put them in your nurture system because that “no land yet” lead often turns into a real opportunity down the road.
                            </li>
                            <li>
                                <strong>Project Type</strong> — “What type of home are you looking to build?”<br />
                                This one’s about fit. You only want projects that match your company’s niche — whether that’s luxury custom homes, modern builds, or specific square footage ranges. If someone’s asking about a remodel, duplex, or something you don’t specialize in, it’s better to be honest upfront and let them know it’s not something you typically do. It saves everyone time and keeps your pipeline filled with projects you’re actually set up to deliver well.
                            </li>
                            <li>
                                <strong>Design Stage</strong> — “Do you have any designs or sketches drawn up yet?”<br />
                                Here you’re trying to figure out how far along they are in the process. If they don’t have any designs yet, that’s perfect — they’re early and open to being guided, which means you can help shape the project from the start. If they already have full plans, ask if they’re just collecting bids or looking for a specific builder to partner with. If they’re just comparing prices, that’s not your client — politely let them go. If they’re looking for the right fit, keep them qualified and move forward. This question separates tire-kickers from people ready to engage.
                            </li>
                            <li>
                                <strong>Timeline</strong> — “When would you potentially be looking to move in?”<br />
                                This one measures urgency. If they’re looking to move in within the next 12 to 24 months, that’s a solid timeframe. You can continue to the next step because it gives you time to go through design and construction properly. If they say something like “three or four years from now,” there’s no real action to take today. Use that opportunity to educate them about the timeline of the process and offer to send them some resources. Then add them to long-term follow-up. They’re not ready yet, but leaving a good impression now can turn them into an easy “yes” later.
                            </li>
                            <li>
                                <strong>Decision Makers</strong> — “Are there any partners or spouses that would be involved in the process?”<br />
                                This is a simple but crucial question. You need to know if there’s anyone else who’ll be part of the decision. If they have a partner or spouse, make sure you get their name and include them in the Discovery Call — that prevents delays and miscommunication later. If it’s just them, great. Either way, always confirm this early so you’re not halfway through the process only to find out there’s another decision-maker you haven’t spoken to.
                            </li>
                        </ol>
                    </div>

                    {/* What To Do After */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>What To Do After Qualification Calls:</h4>
                        <p className={s.p}>
                            Make sure that you are taking notes or recording the call / texts in your CRM. Some systems including the BuilderProject CRM have call recording features and you can text from within the system. Every qualification point and extra detail that may be necessary moving forward should be thoroughly documented. Because of the long sales cycles, you may not speak with that lead again for 12 months, and without proper notes, you will start from square one and become overwhelmed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Part 2: The Script Questions */}
            <section className={s.paper}>
                <div className={s.header}>
                    <h3 className={s.headerTitle}>
                        <MessageSquare size={18} className="mr-2 text-gray-500" />
                        Qualification Script Questions
                    </h3>
                </div>

                <div className={s.body}>
                    {/* Introduction Section */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Introduction</h4>
                        <p className={s.callout}>
                            "Hi <strong>[Name]</strong>, this is <strong>[Your Name]</strong> with <strong>[Company]</strong>. I saw you downloaded our <strong>[Asset Name]</strong> and wanted to see if you had any questions?"
                        </p>
                    </div>

                    {/* Connection Question */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Connection Question</h4>
                        <p className={s.callout}>
                            "Great. This will only take a second but I’m just calling to see if there’s anything we could possibly do for you… and if there is… I could maybe get you booked for a phone call with our planning team. Would that… help you if I did that?"
                        </p>
                    </div>

                    {/* Q1 Motivation */}
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <h4 className={s.sectionTitle}>1. Motivation</h4>
                        <p className={s.p}>"So tell me [Name], what caught your eye or made you want to reach out to us?"</p>
                    </div>

                    {/* Q2 Location */}
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <h4 className={s.sectionTitle}>2. Location</h4>
                        <p className={s.p}>"Do you have an idea of where you’re looking to build?"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <h4 className={s.sectionTitle}>3. Land Ownership</h4>
                        <p className={s.p}>"Have you decided on a piece of land yet or purchased one?"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <h4 className={s.sectionTitle}>4. Project Type</h4>
                        <p className={s.p}>"Ok and what type of home are you looking to build?"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <h4 className={s.sectionTitle}>5. Design Stage</h4>
                        <p className={s.p}>"Do you have any designs or sketches drawn up yet?"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <h4 className={s.sectionTitle}>6. Timeline</h4>
                        <p className={s.p}>"Ok and when would you potentially be looking to move in?"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    <div className="space-y-3 border-t border-gray-100 pt-8">
                        <h4 className={s.sectionTitle}>7. Partners</h4>
                        <p className={s.p}>"Are there any partners or spouses that would be involved in the process?"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-xl p-8 mt-8 border-t border-gray-100 pt-8">
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
            </section>
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
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Discovery Call (TEMPLATE)</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                {/* Document Body */}
                <div className={s.body}>

                    {/* When To Conduct */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>When To Conduct Discovery Calls:</h4>
                        <p className={s.p}>
                            Discovery Calls are only for qualified leads who’ve already completed a Qualification Call and meet the basic criteria: they’re in your service area, own or are purchasing land, have a realistic timeline and budget, and fit your niche.
                        </p>
                        <p className={s.p}>
                            This is the salesperson’s call — it’s meant for the business owner, sales rep, or whoever will be making the actual sale. The goal here isn’t to “close” the deal yet, but to collect deep insight into the client’s situation, motivations, pain points, and goals. You’re building emotional context that will later drive your in-person presentation or proposal.
                        </p>
                        <p className={s.p}>
                            The main focus is to understand the gap between where they are now and where they want to be — and to make them feel that gap.
                        </p>
                    </div>

                    {/* How To Prepare */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Prepare For Discovery Calls:</h4>
                        <p className={s.p}>
                            Before each Discovery Call, review all notes from the Qualification Call and CRM record. Know their land details, project type, and any prior communications so you can skip the surface-level questions and sound informed.
                        </p>
                        <p className={s.p}>
                            Have their form submission or call notes open during the conversation. You should be able to reference past answers naturally (“Last time you mentioned you were still finalizing the land purchase — how’s that going?”).
                        </p>
                        <p className={s.p}>
                            Always take this call in a quiet, private setting where you can focus 100%. These conversations often reveal financial details, family plans, and emotional motivations — so you need to listen carefully and take notes.
                        </p>
                    </div>

                    {/* Purpose */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Purpose Of The Discovery Call:</h4>
                        <p className={s.p}>
                            The Discovery Call has two purposes:
                        </p>
                        <p className={s.p}>
                            <strong>Data Collection</strong> – to understand their situation, goals, obstacles, and timeline so you can prepare an informed proposal or in-person meeting.
                        </p>
                        <p className={s.p}>
                            <strong>Emotional Discovery</strong> – to help them surface and relive the frustrations or fears behind their current situation, then visualize how much better life will be when they solve it with your help.
                        </p>
                        <p className={s.p}>
                            Think of this call as connecting logic to emotion — you’re finding both the “reason” and the “feeling” behind their decision to build so that you can provide the best in-person meeting possible and make the sale.
                        </p>
                    </div>

                    {/* How To Conduct */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Conduct Discovery Calls:</h4>
                        <p className={s.p}>
                            Start with casual rapport and tone-setting — you want them relaxed and conversational. The best Discovery Calls sound like two people exploring ideas, not a salesperson running through a checklist.
                        </p>

                        <p className={s.p}><strong>Connection Questions:</strong> These warm up the conversation and remind them who you are and why you’re speaking. You’re setting context, confirming that you’re aligned on purpose, and subtly reinforcing authority. Asking what stood out to them about your company helps you understand what part of your brand message connected most.</p>
                        <p className={s.p}>If a spouse or partner is part of the decision, confirm they’re on the call before diving in. You don’t want to spend 30 minutes only to have to repeat the conversation later.</p>

                        <p className={s.p}><strong>Situation Questions:</strong> This is where you gather hard data — how long they’ve been looking, what they’ve tried so far, and where they are in the process. You’re establishing facts about their journey and uncovering the “gap” between their current state and their desired outcome. The tone should be curious and slightly skeptical — you’re guiding them to realize they haven’t made the progress they’d like.</p>

                        <p className={s.p}><strong>Problem Awareness Questions:</strong> Here’s where the real sales psychology starts. You’re helping them feel the problem again — the frustrations, delays, or uncertainties holding them back. Questions like “Are you 100% satisfied with how things are progressing?” are designed to trigger self-reflection.</p>
                        <p className={s.p}>As they talk, listen for emotion and repeat their words back with empathy: “So it sounds like that’s been pretty stressful for you?” This is how they re-experience the pain that led them to reach out. From there, guide them to imagine what solving that problem would feel like — clarity, momentum, relief. That emotional contrast is what sets the stage for your pitch later.</p>

                        <p className={s.p}><strong>Booking The In-Person Meeting:</strong> By the end, you should know whether they’re a serious prospect and if your service is a good fit. If so, you’ll invite them to the next step — a more detailed, in-person or virtual planning meeting. This meeting is where you’ll present tailored insights and next steps, not just generic info.</p>
                        <p className={s.p}>Always book that meeting on the spot. Confirm the date and time, and use the “playful accountability” line from your script to reduce no-shows.</p>
                        <p className={s.p}>Then send them your Pre-Meeting Page — it builds authority and keeps them warm before the next step. Explain that it’ll help them come prepared and make better use of your meeting time.</p>

                        <p className="text-base text-red-700 font-bold mt-2">
                            NEVER UNDER ANY CIRCUMSTANCES should you give into the temptation to “just send them an email with more information” even if they explicitly ask for it. Always confirm a time or follow-up later to confirm a time if needed. You will lose the sale 99% of the time by doing this.
                        </p>
                    </div>

                    {/* How To Qualify */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Qualify / Disqualify During Discovery</h4>
                        <p className={s.p}>Even though these are already “qualified” leads, not everyone will stay that way once you dig deeper. Use this call to confirm:</p>
                        <ul className={s.bulletList}>
                            <li>They have a realistic budget</li>
                            <li>They’re emotionally and financially ready to start soon</li>
                            <li>All decision-makers are engaged</li>
                            <li>The project still fits your niche and capacity</li>
                        </ul>
                        <p className={s.p}>If anything changes — for example, they’ve delayed the project or drastically reduced budget — politely reset expectations. It’s better to disqualify now than waste time preparing a proposal for someone who won’t move forward.</p>
                    </div>

                    {/* What To Do After */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>What To Do After Discovery Calls</h4>
                        <p className={s.p}>Immediately after each call, log detailed notes in your CRM — every frustration, every goal, every quote-worthy line. These emotional triggers become powerful material for your in-person meeting or proposal presentation. Make sure the call was recorded as well so that you can listen to it again before the in-person meeting.</p>
                        <p className={s.p}>If they booked the next meeting, send a quick text or email confirmation within 10 minutes to lock it in. If they didn’t commit to a time yet, follow up within 24 hours while the emotional connection is still fresh.</p>
                        <p className={s.p}>Use the Discovery Call to build not just information, but momentum. You’re bridging the gap between curiosity and commitment — from interest to intention.</p>
                    </div>
                </div>
            </section>

            {/* Part 2: The Script */}
            <section className={s.paper}>
                <div className={s.header}>
                    <h3 className={s.headerTitle}>
                        <MessageSquare size={18} className="mr-2 text-gray-500" />
                        Discovery Call Script:
                    </h3>
                </div>

                <div className={s.body}>

                    {/* Connection Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Connection Questions:</h4>
                        <p className={s.p}>
                            Hey (Prospect First Name), it’s (Your First Name)… (Your Full Name) with (Business Name)… It looks like you talked to (Team Member Name) and booked a time with me to explore how we might be able to help you with your custom home idea.. does that sound right? <span className="text-gray-500 italic">(Curious/Concerned tone)</span>
                        </p>

                        {/* Decision Maker Table */}
                        <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
                            {/* Header Row */}
                            <div className="grid grid-cols-2 border-b border-gray-300 divide-x divide-gray-300">
                                <div className="p-3 bg-green-100 text-green-800 font-bold text-sm">
                                    All Decision Makers Present
                                </div>
                                <div className="p-3 bg-red-100 text-red-800 font-bold text-sm">
                                    Missing A Decision Maker
                                </div>
                            </div>

                            {/* Content Row */}
                            <div className="grid grid-cols-2 divide-x divide-gray-300">
                                {/* Green Path */}
                                <div className="p-4 bg-green-50 text-gray-800 text-sm">
                                    <p className="italic mb-2">Continue on &darr;</p>
                                </div>

                                {/* Red Path */}
                                <div className="p-4 bg-red-50 text-gray-800 text-sm space-y-4">
                                    <p>
                                        Before we get started, (Team Member Name) had mentioned to me about (Other Decision Maker’s Name). Are they able to make it?
                                    </p>

                                    {/* Nested Yes/No Table */}
                                    <div className="border border-gray-300 rounded overflow-hidden bg-white">
                                        <div className="grid grid-cols-2 border-b border-gray-300 divide-x divide-gray-300">
                                            <div className="p-2 bg-green-100 text-green-800 font-bold text-xs">Yes</div>
                                            <div className="p-2 bg-red-100 text-red-800 font-bold text-xs">No</div>
                                        </div>
                                        <div className="grid grid-cols-2 divide-x divide-gray-300">
                                            <div className="p-3 text-xs">
                                                Ok great.<br /><br />
                                                <span className="italic">Continue on &darr;</span>
                                            </div>
                                            <div className="p-3 text-xs space-y-2">
                                                <p>Ok no problem at all. What I'd recommend is that we reschedule so that we can find a time that works for both of you so that we can make sure everybody including me is on the same page with each other.</p>
                                                <p>Do you know when both of you would 100% be available so I can check my calendar and make sure I have time for you?</p>
                                                <p className="font-bold text-red-600">End the call ✗</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className={s.p}>
                            What really stood out to you that caused you to want to reach out today? <span className="text-gray-500 italic">(Curious/Engaging tone)</span>
                        </p>
                        <p className={s.p}>
                            Oh ok… These first calls are pretty basic… It’s really more for us to understand where you’re at now… how far you’ve gotten in the process… compared to what you have in mind for your finished home … to see what the gap looks like... And then towards the end… if you feel like this… might be… what you’re looking for, and we think we can help, then we can talk about possible next steps. Would that be appropriate?
                        </p>

                        <p className={s.callout}>
                            <strong>Status Frame If Needed:</strong> I’m not too sure if we can help you just yet … you might not even need us … I’d have to know a bit more about what you’re already doing for XYZ … <span className="text-gray-500 italic">(Ask your first Situation Question)</span>
                        </p>

                        <p className={s.callout}>
                            <strong>Asked For Pricing:</strong> Ohhh yeah, totally… it really depends on a few things — like the level of finishes, the specific lot you’re building on, and what steps you’ve already taken. Once we’ve gone through that a bit more… I can give you a ballpark range just so you know what’s realistic. <span className="text-gray-500 italic">(Ask your next question immediately)</span>
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Situation Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Situation Questions:</h4>
                        <p className={s.p}>
                            So I know (Team Member Name) already went over some of the basics — things like your land, where you’re building, general timing — I won’t make you repeat all that again.
                        </p>
                        <p className={s.p}>
                            What I’d love to understand though… is more about why you’re doing this because that’s really important to us here.
                        </p>

                        <ul className="space-y-4 py-2">
                            <li><p className={s.p}>So how long have you been thinking about building a home? <span className="text-gray-500 italic">(Curious tone)</span></p></li>
                            <li><p className={s.p}>Ok… and what made you decide you wanted to build rather than just buy something that’s already out there? <span className="text-gray-500 italic">(Neutral/curious tone)</span></p></li>
                            <li><p className={s.p}>And what have you really done so far in the process except for you know… buy land?</p></li>
                            <li><p className={s.p}>Just (whatever they mention)? Or anything else you’ve tried so I have a bit more context? <span className="text-gray-500 italic">(Curious/skeptical tone)</span></p></li>
                            <li><p className={s.p}>Got it. And when you think about it… what’s the main goal behind this? Like… what’s the big picture for you? Is this more of a forever home, an investment, a lifestyle change?</p></li>
                            <li><p className={s.p}>When you picture the home being finished… what would make you feel like… “Yeah… this was completely worth it”?</p></li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Probing / Clarifying Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Probing / Clarifying Questions:</h4>
                        <ul className={s.bulletList}>
                            <li>How long has that been going on for?</li>
                            <li>Has that had an impact on you?</li>
                            <li>Well, in what way?</li>
                            <li>What bothers you the most about this?</li>
                            <li>Okay, well, why now though?</li>
                            <li>Why is that so important to you now… why not just push it down the road?</li>
                            <li>(Repeat back emotional words)?</li>
                            <li>Can I ask why you said (blank)?</li>
                            <li>Can I ask what you meant when you said (blank)?</li>
                            <li>How do you mean by (blank)</li>
                            <li>Can you walk me through how (blank) happened exactly?</li>
                            <li>When you say (blank), what did you mean by that exactly?</li>
                            <li>Can I ask why you want (blank) though?</li>
                            <li>How did you feel when (blank) happened?</li>
                            <li>What’s causing (blank) to happen?</li>
                            <li>What’s prompting you to look into possibly changing (blank) though?</li>
                            <li>How does (blank) feel about (blank)?</li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Problem Awareness Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Problem Awareness Questions:</h4>
                        <p className={s.p}>
                            Ok so, besides (Insert any problems you’re aware of if applicable), from what you’ve told me about your project so far (insert situation), which seems like a fairly decent starting point… but if you don’t mind me asking though… are you… 100%... satisfied with how things are progressing so far? <span className="text-gray-500 italic">(Curious/Slightly skeptical tone)</span>
                        </p>
                        <ul className="space-y-4 py-2">
                            <li><p className={s.p}>Why haven’t you actually (blank) yet? <span className="text-gray-500 italic">(Confused/Skeptical tone)</span></p></li>
                            <li><p className={s.p}>So what is it do you think about (blank) that’s causing you to not hit, say (ideal outcome)?</p></li>
                            <li><p className={s.p}>Just so I can understand the rationale behind why you might be looking, besides just wanting to build your dream home… because everybody says that… what's the main reason you’re looking for outside help rather than (what they’re already doing or an alternative)?</p></li>
                        </ul>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Book The Meeting */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Book The In-Person Meeting:</h4>

                        <p className={s.p}>
                            Based on what you’ve shared with me so far … what we do here could work for you …
                        </p>

                        <p className={s.p}>
                            What I can do from here if you’d like … is let you (and your partner/spouse if applicable) book a more formal meeting with me at my office… over the next few days depending on our availability … where we’d talk a bit more about what you might be looking for … and then some possible … next steps … would that help you?
                        </p>

                        <p className={s.p}>
                            Ok, I’m pulling up my calendar now to see what times I may have available for you. Does tomorrow (morning/ afternoon) work for you?
                        </p>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded text-center my-4">
                            <strong className="text-blue-900 block">CONFIRM THE TIME AND BOOK IN-PERSON MEETING</strong>
                        </div>

                        <p className={s.p}>
                            <span className="text-gray-500 italic">(Playful tone)</span> Now just real quick… and I’m sure this isn’t you … however sometimes people ask us to help them with their project, we let them book some more time with us and then they don’t show up … you know those kinds of people …  I’m sure that isn’t you … right?
                        </p>

                        <p className={s.p}>
                            Great… I also wanted to bring up real quick about our pre-meeting page. It has a couple different things to make sure you know everything that we do, so that during our meeting, we can focus more on how it could possibly help, <span className="text-gray-500 italic">(playful tone)</span> rather than doing a boring lecture on our process. There’s a video on there, some frequently asked questions, and some projects we’ve done in the past.
                        </p>

                        <p className={s.p}>
                            Would it help if I sent that page over to you?
                        </p>

                        <p className={s.p}>
                            Awesome, I’ll ask you about it at our meeting at (Time and Date of Sales Call). Anything else for me before I go?
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
};

// Custom View for In-Person Meeting Script
const InPersonMeetingScriptView = () => {
    // Standard Styles
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
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">In-Person Meeting (TEMPLATE)</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <FileText size={18} className="mr-2 text-gray-500" />
                        Standard Operating Procedure
                    </h3>
                </div>

                <div className={s.body}>
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>When To Conduct In-Person Meetings:</h4>
                        <p className={s.p}>The in-person meeting is conducted only after a successful Discovery Call with a fully qualified prospect. At this point, you already know:</p>
                        <ul className={s.bulletList}>
                            <li>They own or are purchasing land.</li>
                            <li>They’re within your service area and niche.</li>
                            <li>They have a realistic budget and timeline.</li>
                            <li>You’ve uncovered their pain points, emotional motivators, and desired outcomes.</li>
                        </ul>
                        <p className={s.p}>The goal now is to convert trust and emotion into commitment by:</p>
                        <ul className={s.bulletList}>
                            <li>Re-activating their emotional awareness of the problem.</li>
                            <li>Exploring what they’ve already tried and why it hasn’t worked.</li>
                            <li>Building a clear vision of their “ideal outcome.”</li>
                            <li>Connecting that outcome to your solution in a collaborative, low-pressure way.</li>
                            <li>Guiding them toward a decision and next steps.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Purpose Of The In-Person Meeting:</h4>
                        <p className={s.p}>The purpose is not to “sell” your company. It’s to lead the client through clarity and conviction.</p>
                        <p className={s.p}>This meeting accomplishes three things:</p>
                        <ul className={s.bulletList}>
                            <li><strong>Emotional Re-engagement:</strong> Reignite the feelings they shared on the Discovery Call (frustration, excitement, overwhelm).</li>
                            <li><strong>Solution Framing:</strong> Help them logically and emotionally connect your process to their needs.</li>
                            <li><strong>Commitment:</strong> Earn permission to present a tailored plan and secure an agreement or design engagement.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>How To Prepare For In-Person Meetings:</h4>
                        <ol className={s.list}>
                            <li>
                                <strong>Review Discovery Notes/ Call:</strong> Read every line of your CRM notes. Highlight exact phrases they used (“We feel stuck,” “We want a space that fits our family”). These are emotional anchors you’ll re-use. Also re-listen to the Discovery Call once as you prepare your pillars, and once before the actual in-person meeting itself so you remember every key detail.
                            </li>
                            <li>
                                <strong>Prepare The 2-4 Pillars Of Your Presentation:</strong> Each pillar should represent one key problem they shared and how you’ll solve it. Use the Presentation Pillar Template resource attached to this lesson. These pillars should be customized for the exact problems you found in your Discovery Call.
                            </li>
                            <li>
                                <strong>Pre-Meeting Phone Call:</strong> You should always call them the day of the in-person appointment. This is not meant to be a long call and should only take 5 minutes. You want to:
                                <ul className="ml-6 mt-2 list-disc space-y-1">
                                    <li>Confirm they will be able to attend obviously as well as their partner. <strong>DO NOT under any circumstances take the in-person meeting without every decision maker present.</strong> There is a 99.9999% chance that they will say they need to think about it and talk to their partner when you ask them to make a decision. Instead of trying to handle that objection, it is far easier to prevent it all together.</li>
                                    <li>Ensure they’ve reviewed your pre-meeting content (videos, past projects, FAQs). This removes the need for a “pitch” and shifts the meeting from proving to planning.</li>
                                    <li>Make sure there’s no unanswered questions about where you are meeting or what you will be discussing.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Environment Setup:</strong>
                                <ul className="ml-6 mt-2 list-disc space-y-1">
                                    <li>Quiet, private space (no interruptions).</li>
                                    <li>Collaborative seating (side-by-side or at 45° angle, not directly across).</li>
                                    <li>Have visual aids ready (concept photos, samples, digital plans).</li>
                                    <li>Prepare a notepad to mirror “taking notes” — builds perceived investment and authority.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Mindset:</strong> You’re not closing them; you’re helping them close themselves by realizing their situation, goals, and next logical step.
                            </li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>What To Do After An In-Person Meeting:</h4>
                        <p className={s.p}>After every in-person meeting, there are only three possible outcomes. Each one requires a clear next step to keep control of the process and protect pipeline momentum.</p>
                        <ol className={s.list}>
                            <li>
                                <strong>Closed Agreement:</strong> This means you got a firm “yes” and a signed agreement while the client was in the office. This should always be your goal — getting physical authorization or digital signature before they leave. Once signed, immediately confirm payment details, update the CRM to “Closed Won,” and notify the internal team. The client should leave knowing exactly what happens next and when they’ll hear from your team.
                            </li>
                            <li>
                                <strong>Very Interested, But Did Not Formally Close:</strong> This means you received a verbal yes — they want to move forward — but couldn’t secure authorization or signature in the meeting. Before they leave, lock in a specific follow-up time (within 48–72 hours) to finalize the paperwork. Send a short recap email the same day summarizing their goals, what was agreed on verbally, and confirming the follow-up appointment. Update CRM stage to “Verbal Yes / Pending Signature.”
                            </li>
                            <li>
                                <strong>Did Not Close / Not Interested:</strong> This means they declined or clearly aren’t ready to proceed. End the meeting on a professional and respectful note. Thank them for their time, send a polite follow-up email that leaves the door open, and tag the lead appropriately in the CRM as “Lost” or “Nurture.” Set a reminder to recheck in several months if appropriate.
                            </li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Part 2: The Script Questions */}
            <section className={s.paper}>
                <div className={s.header}>
                    <h3 className={s.headerTitle}>
                        <MessageSquare size={18} className="mr-2 text-gray-500" />
                        In-Person Meeting Script
                    </h3>
                </div>

                <div className={s.body}>
                    {/* Re-Establish Problem Awareness */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Re-Establish Problem Awareness:</h4>
                        <p className={s.p}>
                            “I know we spoke briefly the other day… I did take some notes but you’ll have to forgive me… my handwriting’s all scratchy like a doctor.” <span className="text-gray-500 italic">(Playful tone)</span>
                        </p>
                        <p className={s.p}>
                            “So…” <span className="text-gray-500 italic">(pretending to look at notes)</span> “…when we talked, you mentioned (insert 2–3 pains or frustrations — e.g., ‘feeling stuck on the design process,’ ‘uncertain about total cost,’ ‘overwhelmed with options’)… can you tell me a bit more about that?” <span className="text-gray-500 italic">(Concerned tone, look up and pause)</span>
                        </p>
                        <p className={s.callout}>(Let them talk — this reopens their emotional state. Nod, mirror tone.)</p>
                        <p className={s.p}>
                            “You’d also asked me to send that pre-meeting page — the one with our past projects and that short video showing how we helped other clients (insert result, e.g., “go from concept to move-in with no budget surprises”). For you though, what stood out the most from that?”
                        </p>
                        <p className={s.callout}>
                            (Wait — confirm they went through it. This pre-frames authority and eliminates the need to “prove yourself”... If they didn’t go through it- sit there and go through it with them.)
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Solution Awareness Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Solution Awareness Questions:</h4>
                        <p className={s.p}>
                            “Now I’m curious — before you came to us, besides (what they’ve already tried or mentioned), who else have you talked with or looked into for help?”
                        </p>

                        <div className="mt-4 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-700 text-sm mb-2">If they haven’t talked to anyone:</h5>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
                                    <li>“Ohhh… what do you feel held you back from getting help before now?”</li>
                                    <li>“What’s changed that’s making it more important to figure this out now?”</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-700 text-sm mb-2">If they’ve spoken with others:</h5>
                                <p className="text-sm text-gray-800">“Ohhh, you’ve talked to (Builder X)? They’re fairly decent. What was missing from those conversations that kept you from already moving forward with them?”</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-700 text-sm mb-2">If they’ve tried something before and it didn’t work:</h5>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
                                    <li>“How do you mean it ‘didn’t work out’ last time?”</li>
                                    <li>“What do you feel caused that?”</li>
                                    <li>“Why not just give up on the idea altogether then?” <span className="text-gray-500 italic">(Slightly challenging tone - builds emotional buy-in)</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Ideal Criteria */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Ideal Criteria (Building the Vision):</h4>
                        <p className={s.p}>
                            “Let’s just make sure we could… actually help you. Suppose we sat down and mapped out your ideal build — besides (what they already said they want) — what else would you really want to see in that?”
                        </p>
                        <p className={s.callout}>
                            <strong>If they hesitate:</strong> “Well, I can make a suggestion if that helps. Most people we talk with say they’re usually looking for help with things like [clarity on budget], [design-to-build continuity], or [stress-free process]. What are your thoughts on those?”
                        </p>
                        <p className={s.p}>“Ok… and why is that so important to you right now?”</p>
                        <p className={s.p}>“Anything else you’d want to make sure we got right?”</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Future State */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Future State / Desired Outcome:</h4>
                        <p className={s.p}>
                            “Let’s just imagine for a second… suppose we could help you (insert their goal — e.g., ‘build that home without constant budget surprises’ or ‘finally move into something that actually fits your family’s lifestyle’)… how do you see that changing things for you?”
                        </p>
                        <p className={s.p}>“Besides that… how else do you see this helping you the most?”</p>
                        <p className={s.p}>“And on more of a personal or emotional level… what would that do for you?”</p>
                        <p className={s.callout}>(Pause — this lets them vividly picture success. That image is what they’ll later justify the investment for.)</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Consequence Questions */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Consequence Questions:</h4>
                        <p className={s.p}>
                            “Oh ok… well if you could… help me understand a bit better… what happens if you don’t do anything about this… and that (restate main problem) keeps dragging out another six or twelve months?”
                        </p>
                        <p className={s.callout}>
                            <strong>If they deflect:</strong> “Ohhh no worries — I’m not saying you won’t do anything… what I mean is, if nothing changed, what would that mean for you?”
                        </p>
                        <p className={s.p}>“How important is it for you to actually fix this now so you don’t have to keep (restate pain)?”</p>
                        <p className={s.p}>“Why is that so important for you?”</p>
                        <p className={s.p}>“Why do this now though- not just push it down the road like most people normally would?</p>
                        <p className={s.callout}>(Pause — let them feel the weight of inaction.)</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Transition To Presentation */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Transition To Presentation:</h4>
                        <p className={s.p}>“So it sounds like… it’s possibly time to make a change then?”</p>
                        <p className={s.p}>“Ok… that’s what I needed to hear — and based on everything you’ve told me, what we do here would work for you…”</p>
                        <p className={s.p}>
                            “…because you said you don’t want to keep (insert frustration) — but right now, you’re (insert logical challenge) — and that’s made you feel (insert emotional keyword from earlier)… does that sound about right?” <span className="text-gray-500 italic">(Wait for agreement)</span>
                        </p>
                        <p className={s.p}>
                            “Ok — well what I can do now, if you’d like, is walk you through how we help clients like you (insert goal)… so you can (insert emotional outcome). Would that be helpful?”
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Presentation (Pillars) */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Presentation (Pillars):</h4>
                        <p className={s.p}>For each pillar:</p>
                        <ul className={s.bulletList}>
                            <li>“Remember how you said (problem)…”</li>
                            <li>“…which has been causing (logical consequence)…”</li>
                            <li>“That’s actually one of the biggest things we see with clients before they come to us…”</li>
                            <li>“How we solve that is we (insert your process)…”</li>
                            <li>“And what that means for you is (insert emotional benefit)…”</li>
                            <li>“Does that make sense?” / “What are your thoughts on that?” / “Would that help you?”</li>
                        </ul>
                        <p className={s.callout}>(Repeat for each pillar, keeping total presentation under 10–15% of meeting time.)</p>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                            <p className="font-bold text-blue-900 mb-2">The Ask:</p>
                            <p className="text-blue-900 leading-relaxed">
                                "Ok… so the funds required for us to (insert what you are pitching them and what it will do for them) is just $_____. <span className="italic font-normal">(Neutral tone — not defensive or rushed.)</span>"
                            </p>
                            <p className="text-blue-900 font-bold mt-2">"Would that… help you… if we did that?"</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Commitment & Next Steps */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>Commitment & Next Steps:</h4>
                        <p className={s.p}>
                            “Based on everything we’ve gone over today… do you feel like this could be the answer for you — to finally (insert end result)?”
                        </p>
                        <div className="mt-4 space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h5 className="font-bold text-green-700 text-sm mb-2">If yes:</h5>
                                <ul className="list-disc ml-5 space-y-2 text-sm text-green-900">
                                    <li>“Ok — why do you feel it is though?” <span className="text-gray-500 italic">(Skeptical tone — builds conviction.)</span></li>
                                    <li>“Besides that, what specific parts of what we covered do you feel would help you the most?”</li>
                                    <li>“Perfect — looks like we’ve covered everything you said you needed to (insert goal). So the next step would be to make arrangements for (design agreement / pre-construction / etc.).”</li>
                                    <li>“We can take care of that right now so we can lock in your start timeline — would that be appropriate?”</li>
                                </ul>
                                <div className="mt-3 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded uppercase">
                                    Aim for signature on the spot
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

// Custom View for Presentation Pillar Examples
const PresentationPillarExamplesView = () => {
    // Standard Styles
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
            {/* Part 1: Structure / SOP */}
            <section className={s.paper}>
                <div className={s.header}>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Presentation Pillar Examples (TEMPLATE)</h1>
                        <p className="text-xs text-gray-400 mt-2">BuilderProject LLC © Copyright 2025. All Rights Reserved. ®</p>
                    </div>
                    <h3 className={s.headerTitle}>
                        <LayoutGrid size={18} className="mr-2 text-gray-500" />
                        Presentation Pillar Structure
                    </h3>
                </div>

                <div className={s.body}>
                    <div className="space-y-3">
                        <p className={s.p}>Repeat this structure for 2-4 problems that you uncovered earlier during the conversation.</p>

                        <div className="space-y-4 border-l-4 border-indigo-100 pl-6 py-2">
                            <div>
                                <h4 className="font-bold text-gray-700">1. Re-state the problem</h4>
                                <p className={s.p}>"Remember how you said … (one specific problem they have)"</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700">2. Amplify the consequence</h4>
                                <p className={s.p}>"Which is causing you to … (logical consequence of that problem, not emotional consequence)"</p>
                                <p className="text-sm text-gray-500 italic">(Check for agreement e.g. you know what I mean?)</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700">3. Normalize the problem</h4>
                                <p className={s.p}>"That’s actually one of the biggest problems people have when they come to us… (talk about this same problem in terms of how other people come to you with the same issue)"</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700">4. Introduce the solution (Logistics)</h4>
                                <p className={s.p}>"How we solve/prevent that for our clients is we… (Logistically - How you solve this particular part of the problem)"</p>
                                <p className="text-sm text-gray-500 italic">(Check for agreement e.g. does that make sense?)</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700">5. Explain the outcome (Result)</h4>
                                <p className={s.p}>"What that means for you is… (What it means once it’s solved = the outcome / end result)"</p>
                                <p className="text-sm text-gray-500 italic">(Open ended check for agreement e.g. What are your thoughts on that?)</p>
                            </div>
                        </div>

                        <p className={s.callout}>
                            <strong>Bridge:</strong> "And the second concern that a lot of our clients have, and i remember you mentioning this as well, is (next problem they have)..."
                        </p>
                    </div>
                </div>
            </section>

            {/* Part 2: Examples */}
            <section className={s.paper}>
                <div className={s.header}>
                    <h3 className={s.headerTitle}>
                        <MessageSquare size={18} className="mr-2 text-gray-500" />
                        Presentation Pillar Examples
                    </h3>
                </div>

                <div className={s.body}>
                    {/* Example 1 */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>“We’ve been planning this for years and still haven’t started.”</h4>
                        <p className={s.p}>“Remember how you said you’ve been planning this for years and still haven’t been able to actually get started?”</p>
                        <p className={s.p}>“Which has been causing you to feel like you’re stuck — researching, saving ideas, maybe even talking to a few builders… but never really seeing anything come to life.”</p>
                        <p className="text-sm text-gray-500 italic">“You know what I mean?” (pause for agreement)</p>
                        <p className={s.p}>“That’s actually one of the most common things we hear from people when they first reach out. They’ve had the dream sitting in their head for years, but between confusing information, not knowing what step comes first, and being worried about making a wrong decision — it just keeps getting pushed off.”</p>
                        <p className={s.p}>“How we help clients finally get started is through our Concept Design Agreement. It’s a really simple first step that lets us take all those ideas out of your head and actually put them onto paper. We’ll create your concept layout, align it with your budget, and give you a realistic view of what it could look like and cost — before you have to make any big commitments.”</p>
                        <p className="text-sm text-gray-500 italic">“Does that make sense?” (pause)</p>
                        <p className={s.p}>“What that means for you is you’ll finally stop planning in circles and start seeing your home take shape. It’s a low-risk, easy way to move from talking about your dream home to actually designing it — with something real you can look at, tweak, and feel confident about.”</p>
                        <p className="text-sm text-gray-500 italic">“What are your thoughts on that?”</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Example 2 */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>“We want confidence that the timeline will be met.”</h4>
                        <p className={s.p}>“Remember how you said one of your biggest concerns was making sure the timeline actually gets met?”</p>
                        <p className={s.p}>“Which has been causing you to feel a bit uneasy about moving forward — because you’ve probably heard all the stories about builds dragging on for months past deadline, costing people extra rent, stress, and sleepless nights.”</p>
                        <p className="text-sm text-gray-500 italic">“You know what I mean?” (pause for agreement)</p>
                        <p className={s.p}>“That’s honestly one of the top frustrations we hear from families before they start with us. They’ve seen other builders overpromise and underdeliver — or start construction without all the details finalized — and then every small delay snowballs into something much bigger.”</p>
                        <p className={s.p}>“How we prevent that from happening for our clients is through our Preliminary Building Agreement. During this stage, we finalize all your engineering, selections, approvals, and supplier scheduling before a single shovel hits the ground. That way, when we sign your build contract, every piece of the puzzle is already in place — and your construction timeline is realistic, accurate, and protected.”</p>
                        <p className="text-sm text-gray-500 italic">“Does that make sense?” (pause)</p>
                        <p className={s.p}>“What that means for you is you’ll finally have confidence in what’s coming next. You’ll know your timeline is mapped out, backed by real data, and managed proactively — so you can plan your move, your finances, and your life without constant uncertainty.”</p>
                        <p className="text-sm text-gray-500 italic">“What are your thoughts on that?”</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Example 3 */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>“We want to know exactly what we’re paying for.”</h4>
                        <p className={s.p}>“Remember how you said one of the most important things for you was knowing exactly what you’re paying for?”</p>
                        <p className={s.p}>“Which has probably caused some hesitation when talking to other builders — because you’ve seen quotes that look vague, or full of allowances, and it leaves you wondering what’s actually included and what might show up later as an extra.”</p>
                        <p className="text-sm text-gray-500 italic">“You know what I mean?” (pause for agreement)</p>
                        <p className={s.p}>“That’s honestly one of the biggest reasons people come to us. They’ve heard the horror stories — budgets blowing out halfway through, clients being hit with surprise invoices, or builders changing prices once construction starts — and they just want transparency from day one.”</p>
                        <p className={s.p}>“How we make sure that never happens is by giving you a fully itemized, fixed-price contract that’s built from the groundwork we did in your preliminary stage. Every material, every inclusion, every cost is broken down in writing. There are no grey areas, and no ‘we’ll figure that out later’ items. Everything is priced, signed off, and locked in before we start.”</p>
                        <p className="text-sm text-gray-500 italic">“Does that make sense?” (pause)</p>
                        <p className={s.p}>“What that means for you is total clarity — no guessing, no surprises, and no awkward conversations halfway through your build. You’ll always know where every dollar is going, so you can feel confident that the investment you’re making is protected and fully understood.”</p>
                        <p className="text-sm text-gray-500 italic">“What are your thoughts on that?”</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Example 4 */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>“We want to stop feeling cramped or disorganized.”</h4>
                        <p className={s.p}>“Remember how you said you want to stop feeling cramped and disorganized in your current home?”</p>
                        <p className={s.p}>“Which, as you mentioned, has been causing a lot of day-to-day frustration — running out of storage, feeling like everyone’s on top of each other, or not having space that really works for how your family lives.”</p>
                        <p className="text-sm text-gray-500 italic">“You know what I mean?” (pause for agreement)</p>
                        <p className={s.p}>“That’s actually one of the most common reasons families come to us. Their current home might technically ‘work,’ but it’s not functional — the layout doesn’t flow, the rooms aren’t being used well, and it just feels like chaos no matter how much they clean or rearrange. And after a while, that constant clutter and tight space starts affecting everything — stress levels, routines, even how much time they actually enjoy being home.”</p>
                        <p className={s.p}>“How we help people fix that is through our Concept Design Agreement. That’s where we sit down, look at how you live day to day, and design a home that finally makes sense for your lifestyle — with spaces that are open, organized, and tailored to your routines. It’s a simple first step that turns all that daily frustration into a clear plan for a home that actually works for you.”</p>
                        <p className="text-sm text-gray-500 italic">“Does that make sense?” (pause)</p>
                        <p className={s.p}>“What that means for you is no more tripping over toys, bumping elbows in the kitchen, or feeling like your home is bursting at the seams. You’ll finally have a layout that feels open, calm, and organized — where everything has its place and you can actually relax at home again.”</p>
                        <p className="text-sm text-gray-500 italic">“What are your thoughts on that?”</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Example 5 */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>“We want our builder to communicate proactively.”</h4>
                        <p className={s.p}>“Remember how you said one of the biggest things for you was wanting a builder who actually communicates — not just when something goes wrong?”</p>
                        <p className={s.p}>“Which has probably been one of your biggest worries — that once you sign, you’ll be left in the dark, wondering what’s happening or chasing updates that should’ve already been shared.”</p>
                        <p className="text-sm text-gray-500 italic">“You know what I mean?” (pause for agreement)</p>
                        <p className={s.p}>“That’s honestly one of the most common frustrations we hear from people who come to us after talking with other builders. They tell us they’d get calls returned days later, or not at all, and had no idea where their project stood. It leaves people feeling ignored, anxious, and like they have to manage the builder instead of the other way around.”</p>
                        <p className={s.p}>“How we solve that for our clients is through our client communication system that’s built into every project. You get weekly progress calls, real-time updates through our client portal, and direct contact with your project manager — so you’re always in the loop before you even need to ask.”</p>
                        <p className="text-sm text-gray-500 italic">“Does that make sense?” (pause)</p>
                        <p className={s.p}>“What that means for you is peace of mind — knowing exactly what’s happening, what’s coming next, and that your builder is staying ahead of potential issues before they ever reach you. You won’t have to chase updates or wonder if things are on track — you’ll know, every step of the way.”</p>
                        <p className="text-sm text-gray-500 italic">“What are your thoughts on that?”</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Example 6 */}
                    <div className="space-y-3">
                        <h4 className={s.sectionTitle}>“We’re nervous about committing to such a big decision.”</h4>
                        <p className={s.p}>“Remember how you mentioned feeling a little nervous about committing to something this big?”</p>
                        <p className={s.p}>“Which makes total sense — it’s not a small decision. You’re investing a huge amount of time, money, and emotion into something you want to get absolutely right.”</p>
                        <p className="text-sm text-gray-500 italic">“You know what I mean?” (pause for agreement)</p>
                        <p className={s.p}>“That’s honestly how just about every family feels before they build. Even the most confident clients tell me they were excited but anxious at the same time — because it’s not just a contract, it’s your dream, your savings, your next chapter. And nobody wants to get that wrong.”</p>
                        <p className={s.p}>“How we help clients get past that uncertainty is by making sure there’s nothing unknown by the time you sign. You’ve already gone through concept design, all your selections, engineering, pricing, and scheduling — everything is mapped out before construction even starts. That’s why this agreement isn’t a leap of faith — it’s simply the next logical step in a process you already know and trust.”</p>
                        <p className="text-sm text-gray-500 italic">“Does that make sense?” (pause)</p>
                        <p className={s.p}>“What that means for you is peace of mind — knowing that when you sign, you’re not gambling, you’re confirming. You’re saying yes to something that’s been planned, priced, and proven — and from here, all that’s left is to finally see it come to life.”</p>
                        <p className="text-sm text-gray-500 italic">“What are your thoughts on that?”</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState("Sales Process");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeView, setActiveView] = useState<ViewState>('library');
    const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);


    const sops: SOP[] = [
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
        {
            title: "Sales Representative Role & Performance Standards",
            description: "Activity minimums\n• Speed-to-lead standard\n• CRM hygiene\n• KPI targets\n• Weekly review\n• Accountability",
            category: "Sales"
        },
        {
            title: "CRM Data Integrity & Pipeline Governance",
            description: "Required fields per stage\n• Note requirements\n• Objection logging\n• Lost reasons\n• Conversations management\n• Stage aging",
            category: "Operations"
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
        },
        {
            title: "In-Person Meeting Script",
            description: "Detailed script and SOP for conducting the In-Person Meeting.",
            category: "Script",
            detailedContent: "SOP and Script for In-Person Meeting"
        },
        {
            title: "Presentation Pillar Examples",
            description: "Structure and examples for the Presentation Pillars to be used in the In-Person Meeting.",
            category: "Script",
            detailedContent: "Presentation Pillar Structure and Examples"
        }
    ];

    const allSops = [...sops, ...stageSops, ...scripts];


    // Logic to handle view switching
    const handleSOPClick = (sop: SOP) => {
        setSelectedSOP(sop);
        setActiveView('sop-detail');
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
                        {activeTab === 'Sales Process' && (
                            <SalesProcessTree onSelectSOP={handleTreeSelection} />
                        )}

                        {activeTab === "SOP's" && (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                                {sops.map((sop, idx) => (
                                    <SOPCard key={idx} sop={sop} onClick={() => handleSOPClick(sop)} />
                                ))}
                            </div>
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
