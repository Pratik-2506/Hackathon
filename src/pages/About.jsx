export default function About() {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">About MindEase</h1>

            <div className="prose prose-slate max-w-none text-slate-600">
                <p className="lead text-xl">
                    MindEase is a friendly AI-powered emotional support companion designed for students.
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8 rounded-r-lg">
                    <h3 className="font-bold text-amber-800 text-lg mb-2">Important Disclaimer</h3>
                    <p className="text-amber-900">
                        MindEase is <strong>not a medical device or a replacement for professional healthcare</strong>.
                        The AI does not diagnose, treat, or offer medical advice. If you are experiencing a crisis
                        or severe mental health symptoms, please contact a professional or emergency services immediately.
                    </p>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Our Mission</h3>
                <p>
                    We aim to provide a safe, non-judgmental space for reflection and emotional support.
                    University life is challenging, and no one should have to navigate stress, anxiety, or loneliness alone.
                </p>

                <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Privacy Promise</h3>
                <p>
                    Your conversations and mood data are private. We store minimal data required to provide the service
                    and do not sell your personal information. You have full control to delete your data at any time.
                </p>
            </div>
        </div>
    );
}
