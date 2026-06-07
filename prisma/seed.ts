import "dotenv/config";
import { prisma } from "../lib/prisma";
import { Goal, Difficulty, LearningStage, UserRole } from "@prisma/client";

async function main() {
  console.log("Seeding started...");

  // 1. Seed Word Packs and Words
  const academicPack = await prisma.wordPack.upsert({
    where: { id: "default-academic" },
    update: {},
    create: {
      id: "default-academic",
      name: "Default Academic Vocab",
      description: "NCERT level, literary vocabulary for academic students",
      goal: Goal.ACADEMIC,
      isDefault: true,
    },
  });

  const academicWords = [
    { word: "ephemeral", meaning: "lasting for a very short time", example: "Her success as a pop star was ephemeral.", difficulty: Difficulty.MEDIUM },
    { word: "cacophony", meaning: "a harsh, discordant mixture of sounds", example: "A cacophony of car horns woke us up.", difficulty: Difficulty.HARD },
    { word: "capricious", meaning: "given to sudden and unaccountable changes of mood or behavior", example: "The administration of justice is capricious.", difficulty: Difficulty.HARD },
    { word: "loquacious", meaning: "tending to talk a great deal; talkative", example: "She became loquacious after a few drinks.", difficulty: Difficulty.MEDIUM },
    { word: "taciturn", meaning: "reserved or uncommunicative in speech; saying little", example: "A taciturn man, he spoke only when necessary.", difficulty: Difficulty.MEDIUM },
    { word: "lucid", meaning: "expressed clearly; easy to understand", example: "The write-up was lucid and easy to read.", difficulty: Difficulty.EASY },
    { word: "pragmatic", meaning: "dealing with things sensibly and realistically", example: "She took a pragmatic approach to the problem.", difficulty: Difficulty.EASY },
    { word: "venerate", meaning: "regard with great respect; revere", example: "The locals venerate their ancestral spirits.", difficulty: Difficulty.MEDIUM },
    { word: "superfluous", meaning: "unnecessary, especially through being more than enough", example: "Avoid superfluous information in your essay.", difficulty: Difficulty.EASY },
    { word: "mitigate", meaning: "make less severe, serious, or painful", example: "Drainage schemes have helped to mitigate the problem.", difficulty: Difficulty.EASY },
  ];

  for (const w of academicWords) {
    await prisma.word.upsert({
      where: { id: `academic-${w.word}` },
      update: {},
      create: {
        id: `academic-${w.word}`,
        word: w.word,
        meaning: w.meaning,
        example: w.example,
        difficulty: w.difficulty,
        wordPackId: academicPack.id,
      },
    });
  }

  const examPrepPack = await prisma.wordPack.upsert({
    where: { id: "default-examprep" },
    update: {},
    create: {
      id: "default-examprep",
      name: "Competitive Exams Vocab",
      description: "Vocab for competitive exams like UPSC, CAT, SSC, Banking",
      goal: Goal.EXAM_PREP,
      isDefault: true,
    },
  });

  const examWords = [
    { word: "anomaly", meaning: "something that deviates from what is standard, normal, or expected", example: "The double-digit inflation is an anomaly.", difficulty: Difficulty.MEDIUM },
    { word: "equivocal", meaning: "open to more than one interpretation; ambiguous", example: "The politicians gave an equivocal answer.", difficulty: Difficulty.HARD },
    { word: "lucrative", meaning: "producing a great deal of profit", example: "The merger proved to be highly lucrative.", difficulty: Difficulty.EASY },
    { word: "assiduous", meaning: "showing great care and perseverance", example: "She was assiduous in pointing out every feature.", difficulty: Difficulty.MEDIUM },
    { word: "fastidious", meaning: "very attentive to and concerned about accuracy and detail", example: "The chef was fastidious about food presentation.", difficulty: Difficulty.HARD },
    { word: "vituperate", meaning: "blame or insult someone in strong or violent language", example: "The press vituperated the player for his poor performance.", difficulty: Difficulty.HARD },
    { word: "obsequious", meaning: "obedient or attentive to an excessive or servile degree", example: "They were served by obsequious waiters.", difficulty: Difficulty.HARD },
    { word: "recalcitrant", meaning: "having an obstinately uncooperative attitude toward authority", example: "A recalcitrant class is difficult to teach.", difficulty: Difficulty.HARD },
    { word: "alacrity", meaning: "brisk and cheerful readiness", example: "She accepted the invitation with alacrity.", difficulty: Difficulty.MEDIUM },
    { word: "magnanimous", meaning: "very generous or forgiving, especially toward a rival", example: "She was magnanimous in victory.", difficulty: Difficulty.MEDIUM },
  ];

  for (const w of examWords) {
    await prisma.word.upsert({
      where: { id: `exam-${w.word}` },
      update: {},
      create: {
        id: `exam-${w.word}`,
        word: w.word,
        meaning: w.meaning,
        example: w.example,
        difficulty: w.difficulty,
        wordPackId: examPrepPack.id,
      },
    });
  }

  const professionalPack = await prisma.wordPack.upsert({
    where: { id: "default-professional" },
    update: {},
    create: {
      id: "default-professional",
      name: "Business English Vocab",
      description: "Business English and corporate communication for working professionals",
      goal: Goal.PROFESSIONAL,
      isDefault: true,
    },
  });

  const professionalWords = [
    { word: "synergy", meaning: "the interaction or cooperation of two or more organizations", example: "The synergy between our teams drove the success.", difficulty: Difficulty.EASY },
    { word: "leverage", meaning: "use something to maximum advantage", example: "We should leverage our market position.", difficulty: Difficulty.EASY },
    { word: "paradigm", meaning: "a typical example or pattern of something; a model", example: "There is a paradigm shift in how we work remotely.", difficulty: Difficulty.MEDIUM },
    { word: "deliverable", meaning: "a thing that can be provided, especially as a product of a development process", example: "We need to finalize the key deliverables by Friday.", difficulty: Difficulty.EASY },
    { word: "holistic", meaning: "characterized by comprehension of the parts of something as intimately interconnected", example: "We need a holistic view of the project.", difficulty: Difficulty.MEDIUM },
    { word: "agile", meaning: "able to move quickly and easily, or relating to project management", example: "Our engineering team uses agile methodologies.", difficulty: Difficulty.EASY },
    { word: "divergent", meaning: "tending to be different or develop in different directions", example: "Our views are divergent, but we agree on the goal.", difficulty: Difficulty.MEDIUM },
    { word: "scalability", meaning: "the capacity to be changed in size or scale", example: "The architecture ensures the scalability of the application.", difficulty: Difficulty.MEDIUM },
    { word: "bottleneck", meaning: "a situation that causes delay in a process or system", example: "We need to identify and remove the bottlenecks.", difficulty: Difficulty.EASY },
    { word: "redundancy", meaning: "the state of being no longer needed or useful", example: "The system has built-in redundancy to prevent failures.", difficulty: Difficulty.MEDIUM },
  ];

  for (const w of professionalWords) {
    await prisma.word.upsert({
      where: { id: `prof-${w.word}` },
      update: {},
      create: {
        id: `prof-${w.word}`,
        word: w.word,
        meaning: w.meaning,
        example: w.example,
        difficulty: w.difficulty,
        wordPackId: professionalPack.id,
      },
    });
  }

  // 2. Seed Dummy Friends
  const dummyFriends = [
    { clerkId: "dummy_duobird", name: "Duo Bird", email: "duobird@example.com", streak: 12, longestStreak: 15, xpCount: 45 },
    { clerkId: "dummy_ankiflash", name: "Anki Flash", email: "ankiflash@example.com", streak: 8, longestStreak: 10, xpCount: 32 },
    { clerkId: "dummy_lexischolar", name: "Lexi Scholar", email: "lexischolar@example.com", streak: 3, longestStreak: 5, xpCount: 15 },
    { clerkId: "dummy_vocapro", name: "Voca Pro", email: "vocapro@example.com", streak: 1, longestStreak: 2, xpCount: 8 },
  ];

  const now = new Date();

  for (const f of dummyFriends) {
    const user = await prisma.user.upsert({
      where: { clerkId: f.clerkId },
      update: {
        name: f.name,
        email: f.email,
      },
      create: {
        clerkId: f.clerkId,
        name: f.name,
        email: f.email,
        role: UserRole.INDEPENDENT,
        streak: {
          create: {
            currentStreak: f.streak,
            longestStreak: f.longestStreak,
            totalDaysCompleted: f.streak,
            lastCompletedAt: now,
          },
        },
      },
      include: {
        streak: true,
      },
    });

    // Seed UserProgress records for these friends to generate weekly XP
    // Each completed correct word is 10 XP. So we create f.xpCount progress items
    // using words from default academic (we'll just use any words)
    const allWords = await prisma.word.findMany({ take: 5 });
    
    // Clean up past progress for dummy users first so they are consistent
    await prisma.userProgress.deleteMany({
      where: { userId: user.id },
    });

    for (let i = 0; i < Math.min(f.xpCount, allWords.length); i++) {
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          wordId: allWords[i].id,
          stage: LearningStage.TESTED,
          correct: true,
          attempts: 1,
          completedAt: now,
        },
      });
    }
  }

  console.log("Seeding complete successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
