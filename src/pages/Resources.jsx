import { ExternalLink, Phone } from 'lucide-react';

const RESOURCES = [
    {
        category: "Emergency",
        items: [
            { name: "988 Suicide & Crisis Lifeline", desc: "24/7, free and confidential support.", link: "tel:988", action: "Call 988" },
            { name: "Crisis Text Line", desc: "Text HOME to 741741 to connect with a Crisis Counselor.", link: "sms:741741", action: "Text 741741" },
        ]
    },
    {
        category: "University Support",
        items: [
            { name: "Student Health Services", desc: "On-campus medical and mental health clinic.", link: "#", action: "Visit Website" },
            { name: "Counseling Center", desc: "Professional counseling for students.", link: "#", action: "Book Appointment" },
        ]
    },
    {
        category: "Self-Care",
        items: [
            { name: "Headspace Student Plan", desc: "Meditation and mindfulness apps.", link: "https://www.headspace.com/student", action: "Learn More" },
            { name: "Calm", desc: "Sleep stories and relaxation.", link: "https://www.calm.com", action: "Visit Site" },
        ]
    }
];

export default function Resources() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Support Resources</h1>
            <p className="text-slate-500 mb-8">Professional help and tools to support your well-being.</p>

            <div className="space-y-8">
                {RESOURCES.map((section, i) => (
                    <div key={i}>
                        <h2 className="text-lg font-semibold text-lavender-600 mb-4 px-2 uppercase tracking-wider text-xs">{section.category}</h2>
                        <div className="grid gap-4">
                            {section.items.map((item, j) => (
                                <div key={j} className="bg-white p-6 rounded-2xl shadow-sm border border-lavender-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                                    </div>
                                    <a
                                        href={item.link}
                                        className="px-5 py-2 bg-slate-50 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        {item.link.startsWith('tel') && <Phone size={14} />}
                                        {item.action}
                                        {!item.link.startsWith('tel') && !item.link.startsWith('sms') && <ExternalLink size={14} />}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
