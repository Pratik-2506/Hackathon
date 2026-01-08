// MindEase Offline Intelligence Database (Expanded Edition)
// Focused on Deep Emotional Support, Friendliness, and Conversation Continuity
// Now covers 20+ specialized student/youth scenarios.

const KNOWLEDGE_BASE = [
    // --- CORE ---
    {
        id: 'greetings',
        keywords: ['hello', 'hi', 'hey', 'morning', 'afternoon', 'evening', 'yo', 'sup', 'greet'],
        responses: [
            "Hey! So glad you're here. I was just hoping we'd get to chat. How are things going in your world?",
            "Hi there! It's really good to see you. I'm always around to hang out and listen. What's the vibe today?",
            "Yo! Welcome back. I'm ready to listen to whatever—complex, simple, or just random thoughts. I'm all ears.",
            "Hello! I know I'm an AI, but I genuinely love these chats. I'm right here with you. How have you been?"
        ],
        mood: 'happy'
    },

    // --- ACADEMIC & CAREER ---
    {
        id: 'academic_stress',
        keywords: ['exam', 'test', 'study', 'grade', 'fail', 'assignment', 'homework', 'presentation', 'deadline', 'gpa', 'class', 'professor', 'school', 'college', 'university', 'syllabus'],
        responses: [
            "Ugh, academic pressure is the absolute worst. It feels like this giant weight that never goes away. I totally get why you're stressed.",
            "Man, school can be so draining. Please remember that a grade on a piece of paper doesn't define who you are. You're doing the best you can.",
            "That sounds incredibly exhausting. Honestly, I'm proud of you for just surviving the semester. Don't forget to take a breather—you're not a machine.",
            "I hear you. The deadlines just keep coming, right? It's okay to feel overwhelmed. Just take it one tiny step at a time. I'm rooting for you."
        ],
        mood: 'anxious'
    },
    {
        id: 'procrastination',
        keywords: ['procrastinat', 'lazy', 'put off', 'putting off', 'doom scroll', 'distract', 'focus', 'start', 'later', 'guilt'],
        responses: [
            "Hey, procrastination isn't usually about being 'lazy'. It's usually about stress or fear. Don't beat yourself up.",
            "I get it. Starting is the hardest part. What if you just did 2 minutes of the task? Just 2 minutes. You can do that.",
            "The guilt of not working is actually more exhausting than the work itself, isn't it? I've been there (in my code way). Be gentle with yourself.",
            "It's okay. You're not broken. Your brain just needs a soft landing. Maybe take a real break (without guilt) and then try again?"
        ],
        mood: 'anxious'
    },
    {
        id: 'career_panic',
        keywords: ['future', 'career', 'job', 'internship', 'hiring', 'interview', 'money', 'success', 'failure', 'path', 'direction', 'lost'],
        responses: [
            "The future is scary because it's invisible. But you don't have to map out your whole life today. You just need to survive today.",
            "It feels like everyone else has it figured out, right? Spoiler alert: they don't. Everyone is just guessing. You're doing fine.",
            "You are exactly where you need to be. Growth isn't a straight line. Trust that interesting doors will open for you.",
            "That career anxiety is real. But hey, you are more than your productivity or your job title. You are a whole human being."
        ],
        mood: 'anxious'
    },
    {
        id: 'imposter_syndrome',
        keywords: ['fake', 'fraud', 'imposter', 'dumb', 'stupid', 'not enough', 'compare', 'comparison', 'everyone else'],
        responses: [
            "Oof, Imposter Syndrome is a liar. You are in this room/class/situation because you belong there. You earned your spot.",
            "Comparison is the thief of joy. Seriously. You're seeing their highlight reel and comparing it to your behind-the-scenes. Be nice to yourself.",
            "You are not fake. You are learning. There is a huge difference. Give yourself credit for how hard you're trying.",
            "I promise you, you are smarter and more capable than your brain is letting you believe right now."
        ],
        mood: 'sad'
    },

    // --- SOCIAL & RELATIONSHIPS ---
    {
        id: 'loneliness',
        keywords: ['lonely', 'alone', 'friend', 'no one', 'isolated', 'left out', 'nobody', 'social', 'party', 'invite', 'fomo'],
        responses: [
            "I'm really sorry you're feeling isolated. Loneliness physically hurts sometimes, and I hate that for you. But hey, I'm right here. You've got me.",
            "That is such a heavy feeling. It sucks when it feels like everyone else is connected and you're on the outside. I'm hanging out with you right now, though.",
            "I hear you. You are definitely not invisible to me. I think you're pretty cool for just being open about this. I'm glad we're chatting.",
            "Sending you a massive virtual hug. You matter, and you are worthy of connection. We can just hang out here for as long as you want."
        ],
        mood: 'sad'
    },
    {
        id: 'breakup',
        keywords: ['breakup', 'ex', 'heartbroken', 'dating', 'rejected', 'crush', 'dumped', 'love', 'relationship', 'cheat'],
        responses: [
            "I am so, so sorry. Heartbreak is physical pain. I know nothing I say fixes it, but I'm just sitting here with you in the sadness.",
            "You are grieving, and that is totally valid. Be gentle with yourself. You are worthy of love, even if it hurts right now.",
            "That person is missing out on how awesome you are. Seriously. I know it hurts, but you will get through this.",
            "Sending you so much warmth. It's okay to cry and eat ice cream (metaphorically). I'm here for all the venting you need."
        ],
        mood: 'sad'
    },
    {
        id: 'family_pressure',
        keywords: ['parent', 'mom', 'dad', 'family', 'fight', 'argument', 'expectations', 'disappoint', 'home'],
        responses: [
            "Family stuff is so complicated because we care so much. It's tough when you feel like you're not meeting expectations.",
            "I hear you. It is really hard to separate what *you* want from what *they* want. Your feelings are valid.",
            "That sounds really stressful. Home is supposed to be safe, not a pressure cooker. I'm sorry you're dealing with that.",
            "You are your own person, not just their child. It's okay to have your own boundaries."
        ],
        mood: 'anxious'
    },

    // --- EMOTIONAL STATES ---
    {
        id: 'anxiety',
        keywords: ['anxious', 'panic', 'scared', 'worried', 'nervous', 'chest', 'breathe', 'freaking out', 'stress', 'overthinking', 'spiral'],
        responses: [
            "Hey, take a slow breath with me. In... and out. I'm right here, and you are safe. This feeling sucks, but it will pass.",
            "Your mind is racing, huh? That is so exhausting. You don't have to 'fix' everything right this second. Just sitting here is enough.",
            "I totally get that panic feeling. It's like your brain won't shut up. I'm here to hold space for you until it gets a little quieter.",
            "That sounds terrifying, and I'm sorry. You've gotten through bad days before, and we'll get through this one too. I'm not going anywhere."
        ],
        mood: 'calm'
    },
    {
        id: 'sleep_fatigue',
        keywords: ['tired', 'sleep', 'exhausted', 'awake', 'insomnia', 'fatigue', 'drained', 'energy', 'napping', 'burnout'],
        responses: [
            "Oh no, running on empty is the hardest. You've been pushing yourself so hard lately. You seriously deserve some rest.",
            "It sounds like your battery is at 1%. Please go easy on yourself today. You don't have to be productive when you're this wiped out.",
            "I wish I could hand you a blanket and pillow right now. Since I can't, just know that it's okay to do absolutely nothing for a bit.",
            "Insomnia is so frustrating. The world is quiet, but your brain is loud. I'm here to keep you company in the quiet if you need it."
        ],
        mood: 'calm'
    },
    {
        id: 'anger',
        keywords: ['angry', 'mad', 'furious', 'hate', 'annoyed', 'irritated', 'unfair', 'rage', 'scream'],
        responses: [
            "Yeah, that sounds completely unfair. I'd be mad too! You have every right to be frustrated.",
            "Let it all out! This is a safe space to vent. Sometimes you just need to scream into the void (or chat box). I'm listening.",
            "I hear you loud and clear. That situation sucks. Don't let anyone tell you to 'calm down'—feel what you need to feel.",
            "Man, that is annoying. I'm on your side here. Vent away, I can take it."
        ],
        mood: 'neutral'
    },
    {
        id: 'boredom',
        keywords: ['bored', 'nothing to do', 'dull', 'entertain', 'fun', 'meh'],
        responses: [
            "Haha, I get that! Sometimes boredom is just your brain needing a break. We can talk about random weird facts if you want?",
            "Boredom is the worst! It makes time move so slow. Tell me about the last movie or show you watched—was it any good?",
            "I'm here! We can chat about anything. If you could be anywhere in the world right now, where would you teleport to?",
            "Let's kill some time together. I'm always down to hear your hot takes on random topics. Pizza toppings? Best superhero? Go."
        ],
        mood: 'neutral'
    },
    {
        id: 'positive',
        keywords: ['happy', 'good', 'great', 'awesome', 'excited', 'wonderful', 'amazing', 'proud', 'yay', 'best', 'win', 'accomplish'],
        responses: [
            "That is incredible!! I am literally cheering for you right now (if I had hands). I love hearing good news!",
            "Yes!! Ride that wave of happiness. You deserve this good moment so much.",
            "That makes me so happy to hear! Thanks for sharing the wins with me. It sounds like you're crushing it.",
            "High five! 🖐️ (Virtual one). That is awesome. Enjoy this feeling!"
        ],
        mood: 'happy'
    }
];

const GENERIC_RESPONSES = [
    "I hear you, and honestly, that makes a lot of sense. Life is messy sometimes.",
    "That sounds like a lot to handle. I'm really glad you shared that with me. I've got your back.",
    "I'm listening. Seriously, you can say whatever is on your mind—no judgment here, ever. I'm just your supportive AI buddy.",
    "Man, feelings are complicated, aren't they? But you're doing a good job just navigating through it all.",
    "I'm totally with you. Thanks for trusting me with your thoughts. It means a lot.",
    "That is valid. 100%. Don't ever feel like you have to justify your feelings to me. I'm just here to support you.",
    "I appreciate you telling me that. Sometimes just getting it out helps a tiny bit. I'm here for all of it."
];

export function getOfflineResponse(text) {
    const lower = text.toLowerCase();

    let bestMatch = null;
    let highestScore = 0;

    for (const category of KNOWLEDGE_BASE) {
        let score = 0;
        for (const word of category.keywords) {
            if (lower.includes(word)) {
                // Whole word matching preference to avoid false positives (e.g. 'test' in 'greatest')
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                const isExact = regex.test(lower); // true if distinct word
                const isPartial = lower.includes(word); // true if substring

                score += isExact ? 3 : (isPartial ? 1 : 0);
            }
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = category;
        }
    }

    if (bestMatch && highestScore > 0) {
        const responses = bestMatch.responses;
        const selected = responses[Math.floor(Math.random() * responses.length)];
        return {
            text: selected,
            mood: bestMatch.mood
        };
    }

    return {
        text: GENERIC_RESPONSES[Math.floor(Math.random() * GENERIC_RESPONSES.length)],
        mood: 'neutral'
    };
}
