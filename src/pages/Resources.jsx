import { ExternalLink, Phone } from 'lucide-react';

const RESOURCES = [
    {
        category: "Emergency & Government Support",
        items: [
            { name: "National Emergency Number", desc: "Police, Fire, Ambulance (All-in-One).", link: "tel:112", action: "Call 112" },
            { name: "Ambulance (Medical Emergency)", desc: "Immediate medical assistance.", link: "tel:102", action: "Call 102" },
            { name: "Tele MANAS (Mental Health)", desc: "24/7 Govt Mental Health Support.", link: "tel:14416", action: "Call 14416" },
            { name: "Women's Helpline", desc: "For harassment/safety issues.", link: "tel:1091", action: "Call 1091" },
            { name: "Anti-Ragging Helpline", desc: "Report ragging in colleges (UGC).", link: "tel:18001805522", action: "Call 1800-180-5522" },
            { name: "Cyber Crime Helpline", desc: "Report online harassment/bullying.", link: "tel:1930", action: "Call 1930" },
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
