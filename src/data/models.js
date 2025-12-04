// Mock Data for Feeling Fine Program

export const CORNERSTONE_CATEGORIES = [
    { id: 'nutrition', name: 'Nutrition', icon: '🍎', description: 'Nourish your body with healthy choices.' },
    { id: 'movement', name: 'Movement', icon: '🏃', description: 'Keep your body active and strong.' },
    { id: 'sleep', name: 'Sleep', icon: '😴', description: 'Rest and recharge for the day ahead.' },
    { id: 'stress_management', name: 'Stress Management', icon: '🧘', description: 'Find your inner calm.' },
    { id: 'social_connection', name: 'Social Connection', icon: '🤝', description: 'Connect with others.' },
    { id: 'cognitive_health', name: 'Brain Health', icon: '🧠', description: 'Keep your mind sharp.' },
    { id: 'healthy_aging', name: 'Healthy Aging', icon: '🌿', description: 'Embrace the journey of life.' },
];

export const KEYSTONE_CATEGORIES = [
    { id: 'principles', name: 'Principles' },
    { id: 'commitment', name: 'Commitment' },
    { id: 'beliefs', name: 'Beliefs' },
    { id: 'consistency', name: 'Consistency' },
    { id: 'persistence', name: 'Persistence' },
    { id: 'values', name: 'Values' },
    { id: 'virtues', name: 'Virtues' },
];

// Helper to create act objects
const createActs = (category, list) => {
    return list.map((text, index) => ({
        id: `${category}_${index + 1}`,
        text,
        category
    }));
};

const NUTRITION_ACTS = [
    "Drink a glass of water immediately upon waking.",
    "Eat a serving of leafy green vegetables.",
    "Replace a sugary drink with water or herbal tea.",
    "Eat a piece of whole fruit instead of juice.",
    "Include a source of protein with breakfast.",
    "Eat a handful of raw nuts or seeds.",
    "Avoid processed foods for one entire meal.",
    "Cook a meal at home using fresh ingredients.",
    "Eat slowly and chew your food thoroughly.",
    "Stop eating when you feel 80% full.",
    "Have a meat-free meal today.",
    "Drink 8 glasses of water throughout the day.",
    "Avoid added sugar for the entire day.",
    "Eat a serving of fermented food (yogurt, kimchi, etc.).",
    "Snack on raw vegetables (carrots, celery, etc.).",
    "Use olive oil instead of butter or margarine.",
    "Eat a serving of fatty fish or plant-based omega-3s.",
    "Read the nutrition label before buying a food item.",
    "Portion your meal on a smaller plate.",
    "Eat a rainbow: include 3 different colored veggies in a meal."
];

const MOVEMENT_ACTS = [
    "Take a brisk 10-minute walk.",
    "Stand up and stretch every hour while working.",
    "Take the stairs instead of the elevator.",
    "Park further away from the store entrance.",
    "Do 10 push-ups (or wall push-ups).",
    "Do 10 squats while waiting for the kettle to boil.",
    "Go for a walk after dinner.",
    "Dance to your favorite song.",
    "Do a 5-minute yoga flow.",
    "Walk while talking on the phone.",
    "Do some gardening or yard work.",
    "Clean the house vigorously for 15 minutes.",
    "Go for a bike ride.",
    "Try a new physical activity or sport.",
    "Balance on one leg while brushing your teeth.",
    "Walk a dog (yours or a friend's).",
    "Do a plank for 30 seconds.",
    "Stretch your hamstrings and back.",
    "Walk 5,000 steps today.",
    "Walk 10,000 steps today."
];

const SLEEP_ACTS = [
    "Go to bed 30 minutes earlier than usual.",
    "Avoid screens (phone, TV) 1 hour before bed.",
    "Keep your bedroom cool and dark.",
    "Read a physical book before sleep.",
    "Avoid caffeine after 2:00 PM.",
    "Wake up at the same time as yesterday.",
    "Get 15 minutes of sunlight in the morning.",
    "Do a calming meditation before bed.",
    "Take a warm bath or shower before sleep.",
    "Write down your to-do list for tomorrow to clear your mind.",
    "Use blackout curtains or an eye mask.",
    "Avoid heavy meals 2 hours before bed.",
    "Listen to white noise or calming music.",
    "Change your bed sheets for fresh ones.",
    "Practice deep breathing exercises in bed.",
    "Keep your phone out of the bedroom.",
    "Limit alcohol consumption in the evening.",
    "Get at least 7 hours of sleep.",
    "Get at least 8 hours of sleep.",
    "Establish a consistent bedtime routine."
];

const STRESS_ACTS = [
    "Take 5 deep, slow breaths.",
    "Spend 10 minutes in nature.",
    "Write down 3 things you are grateful for.",
    "Meditate for 5 minutes.",
    "Laugh out loud (watch a funny video).",
    "Listen to your favorite relaxing music.",
    "Say 'no' to a non-essential request.",
    "Unplug from social media for 2 hours.",
    "Do a 'body scan' to release tension.",
    "Pet a dog or cat.",
    "Practice mindfulness while washing dishes.",
    "Write in a journal for 10 minutes.",
    "Forgive someone (or yourself) for a mistake.",
    "Visualize a peaceful place.",
    "Take a break and do absolutely nothing for 5 minutes.",
    "Hug a loved one for 20 seconds.",
    "Smile at yourself in the mirror.",
    "Perform a random act of kindness.",
    "Read an inspiring quote.",
    "Focus on the present moment."
];

const SOCIAL_ACTS = [
    "Call a friend or family member just to say hi.",
    "Send a text of appreciation to someone.",
    "Eat a meal with someone without phones.",
    "Listen actively to someone without interrupting.",
    "Smile at a stranger.",
    "Compliment someone genuinely.",
    "Ask a colleague how their day is going.",
    "Plan a get-together with friends.",
    "Volunteer for a local cause.",
    "Write a thank-you note.",
    "Introduce yourself to a neighbor.",
    "Join a club or group activity.",
    "Share a funny story with someone.",
    "Offer help to someone in need.",
    "Reconnect with an old friend.",
    "Make eye contact when speaking to people.",
    "Ask someone for their advice.",
    "Share a meal with a neighbor.",
    "Participate in a community event.",
    "Express love to your partner or family."
];

const BRAIN_ACTS = [
    "Read a chapter of a book.",
    "Solve a crossword or Sudoku puzzle.",
    "Learn a new word and use it in a sentence.",
    "Brush your teeth with your non-dominant hand.",
    "Take a different route to work or the store.",
    "Listen to an educational podcast.",
    "Learn 5 words in a new language.",
    "Play a memory game.",
    "Try a new recipe.",
    "Play a musical instrument (or learn to).",
    "Draw, paint, or doodle.",
    "Write a short poem or story.",
    "Do a jigsaw puzzle.",
    "Learn a new skill (e.g., juggling, knitting).",
    "Engage in a debate or intellectual discussion.",
    "Recall what you ate for dinner 3 days ago.",
    "Memorize a phone number.",
    "Teach someone something you know.",
    "Avoid multitasking for 30 minutes.",
    "Drink water to hydrate your brain."
];

const AGING_ACTS = [
    "Wear sunscreen on your face.",
    "Practice balancing on one foot.",
    "Stand up straight and check your posture.",
    "Moisturize your skin.",
    "Get your hearing or vision checked (if due).",
    "Floss your teeth.",
    "Lift a light weight to maintain muscle mass.",
    "Learn something new about your family history.",
    "Spend time with someone of a different generation.",
    "Check your blood pressure.",
    "Review your medications with a doctor.",
    "Clear clutter from a walkway to prevent falls.",
    "Eat antioxidant-rich foods (berries, dark chocolate).",
    "Stay socially active.",
    "Keep your mind active with puzzles.",
    "Stretch your hips and back.",
    "Limit alcohol intake.",
    "Quit smoking (or don't start).",
    "Laugh often.",
    "Reflect on your life's purpose."
];

export const SMALL_ACTS = {
    nutrition: createActs('nutrition', NUTRITION_ACTS),
    movement: createActs('movement', MOVEMENT_ACTS),
    sleep: createActs('sleep', SLEEP_ACTS),
    stress_management: createActs('stress_management', STRESS_ACTS),
    social_connection: createActs('social_connection', SOCIAL_ACTS),
    cognitive_health: createActs('cognitive_health', BRAIN_ACTS),
    healthy_aging: createActs('healthy_aging', AGING_ACTS),
};

export const DAILY_DOSES = [
    "The journey of a thousand miles begins with a single step.",
    "Health is not just about what you're eating. It's also about what you're thinking and saying.",
    "Take care of your body. It's the only place you have to live.",
    "A healthy outside starts from the inside.",
    "Believe you can and you're halfway there.",
    "Consistency is the key to breakthrough.",
    "Small daily improvements are the key to staggering long-term results.",
    "Your health is an investment, not an expense.",
    "Don't wait for the perfect moment, take the moment and make it perfect.",
    "Wellness is the complete integration of body, mind, and spirit."
];

export const DAY_FOCUS_MAPPING = {
    1: 'nutrition',         // Monday
    2: 'movement',          // Tuesday
    3: 'sleep',             // Wednesday
    4: 'stress_management', // Thursday
    5: 'social_connection', // Friday
    6: 'cognitive_health',  // Saturday
    0: 'healthy_aging'      // Sunday
};
