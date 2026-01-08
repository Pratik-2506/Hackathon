import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function History() {
    const { user } = useAuth();
    const [data, setData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Mood Level',
                data: [3, 4, 2, 3, 5, 4, 3],
                borderColor: 'rgb(20, 184, 166)', // mint-500
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgb(20, 184, 166)',
                pointBorderWidth: 2,
                pointRadius: 6,
            }
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            // Get data from journal_entries now, not moods
            const { data: entries } = await supabase
                .from('journal_entries')
                .select('created_at, mood_level')
                .eq('user_id', user?.id)
                .not('mood_level', 'is', null) // Only get entries with mood
                .order('created_at', { ascending: true })
                .limit(7);

            if (entries && entries.length > 0) {
                setData({
                    labels: entries.map(m => new Date(m.created_at).toLocaleDateString('en-US', { weekday: 'short' })),
                    datasets: [{
                        ...data.datasets[0],
                        data: entries.map(m => m.mood_level)
                    }]
                });
            } else {
                // Explicitly empty the graph if no data found
                setData({
                    labels: [],
                    datasets: [{
                        ...data.datasets[0],
                        data: []
                    }]
                });
            }
        };
        fetchData();
    }, [user]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        const map = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😁' };
                        return map[value];
                    },
                    font: {
                        size: 20
                    }
                },
                grid: {
                    color: '#f1f5f9'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Your Mood Journey</h1>
                <p className="text-slate-500">Visualizing your emotional trends over time.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-lavender-100 relative min-h-[300px]">
                {data.labels.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                        <p className="mb-2 text-lg font-medium text-slate-500">No mood data yet</p>
                        <p className="text-sm">Log your first entry in the Journal to see your trends here!</p>
                    </div>
                ) : (
                    <div className="h-[300px] md:h-[400px] w-full">
                        <Line options={options} data={data} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-lavender-50">
                    <h3 className="font-semibold text-slate-700 mb-2">Weekly Insight</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        You seem to be having a relatively balanced week. You reported feeling great on Friday! Consider what made that day special.
                    </p>
                </div>
                <div className="bg-mint-50 p-6 rounded-3xl border border-mint-100">
                    <h3 className="font-semibold text-mint-800 mb-2">Tip of the Day</h3>
                    <p className="text-mint-700 text-sm leading-relaxed">
                        Regular sleep patterns can significantly improve mood stability. Try to wind down at the same time tonight.
                    </p>
                </div>
            </div>
        </div>
    );
}
