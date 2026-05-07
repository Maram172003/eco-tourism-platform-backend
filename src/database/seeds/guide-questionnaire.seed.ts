import { DataSource } from 'typeorm';
import {
  Answer,
  Question,
  QuestionCategory,
  Questionnaire,
} from '../../questionnaire/entities/questionnaire.entities';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  entities: [Questionnaire, QuestionCategory, Question, Answer],
  synchronize: true,
});

const QUESTIONS = [
  {
    text: "Un groupe de touristes veut visiter une zone naturelle protégée. Comment gérez-vous leur impact sur l'environnement ?",
    category: 'environmental',
    order: 1,
    answers: [
      { text: "Je les laisse explorer librement", score: 1 },
      { text: "Je leur donne quelques consignes de base", score: 2 },
      { text: "Je fixe des règles strictes et surveille le groupe", score: 3 },
      { text: "Je sensibilise, fixe un quota visiteurs et reste sur les sentiers balisés", score: 4 },
    ],
  },
  {
    text: "Un client vous demande de visiter un site archéologique non officiel pour éviter les foules. Que faites-vous ?",
    category: 'social',
    order: 2,
    answers: [
      { text: "J'accepte si le client insiste", score: 1 },
      { text: "J'hésite mais je propose une alternative touristique classique", score: 2 },
      { text: "Je refuse poliment et propose un site officiel équivalent", score: 3 },
      { text: "Je refuse, explique l'importance de la protection et oriente vers des acteurs locaux certifiés", score: 4 },
    ],
  },
  {
    text: "Comment choisissez-vous les prestataires locaux (hébergement, restauration) pour vos circuits ?",
    category: 'economic',
    order: 3,
    answers: [
      { text: "Je choisis les moins chers", score: 1 },
      { text: "Je choisis les plus connus", score: 2 },
      { text: "Je privilégie les prestataires locaux", score: 3 },
      { text: "Je sélectionne uniquement des acteurs locaux éco-responsables certifiés", score: 4 },
    ],
  },
  {
    text: "Lors d'une randonnée, un touriste laisse des déchets dans la nature. Comment réagissez-vous ?",
    category: 'environmental',
    order: 4,
    answers: [
      { text: "Je ne dis rien pour éviter le conflit", score: 1 },
      { text: "Je ramasse moi-même discrètement", score: 2 },
      { text: "Je lui demande de ramasser ses déchets", score: 3 },
      { text: "Je lui explique l'impact environnemental et organise un ramassage collectif", score: 4 },
    ],
  },
  {
    text: "Un groupe veut prendre des photos avec des animaux sauvages. Quelle est votre réaction ?",
    category: 'environmental',
    order: 5,
    answers: [
      { text: "Je facilite l'accès aux animaux", score: 1 },
      { text: "Je les laisse approcher à distance raisonnable", score: 2 },
      { text: "Je les maintiens à distance sécurisée", score: 3 },
      { text: "J'explique les règles éthiques et propose l'observation sans interférence", score: 4 },
    ],
  },
  {
    text: "Comment présentez-vous la culture et les traditions locales à vos groupes ?",
    category: 'social',
    order: 6,
    answers: [
      { text: "Je montre les attractions les plus populaires", score: 1 },
      { text: "Je présente les traditions de manière générale", score: 2 },
      { text: "Je fais participer des artisans ou habitants locaux", score: 3 },
      { text: "Je co-construis l'expérience avec la communauté locale et reverse une partie aux associations", score: 4 },
    ],
  },
  {
    text: "Un touriste vous demande d'acheter un objet fabriqué avec des espèces protégées. Que faites-vous ?",
    category: 'environmental',
    order: 7,
    answers: [
      { text: "Je l'aide à trouver le vendeur", score: 1 },
      { text: "Je déconseille mais ne l'empêche pas", score: 2 },
      { text: "Je refuse de l'accompagner pour cet achat", score: 3 },
      { text: "Je refuse, explique la loi et oriente vers l'artisanat durable", score: 4 },
    ],
  },
  {
    text: "Comment évaluez-vous l'impact de vos circuits sur les communautés locales ?",
    category: 'social',
    order: 8,
    answers: [
      { text: "Je n'y pense pas spécifiquement", score: 1 },
      { text: "Je recueille des avis touristiques", score: 2 },
      { text: "Je consulte les habitants après chaque circuit", score: 3 },
      { text: "Je mets en place un suivi régulier avec les communautés et adapte mes circuits", score: 4 },
    ],
  },
  {
    text: "Quel est votre rapport à la formation continue sur l'écotourisme ?",
    category: 'economic',
    order: 9,
    answers: [
      { text: "Je n'ai pas le temps de me former", score: 1 },
      { text: "Je lis des articles de temps en temps", score: 2 },
      { text: "Je suis des formations certifiantes ponctuellement", score: 3 },
      { text: "Je me forme régulièrement et partage mes connaissances avec d'autres guides", score: 4 },
    ],
  },
  {
    text: "Comment gérez-vous le nombre de visiteurs dans les zones sensibles ?",
    category: 'environmental',
    order: 10,
    answers: [
      { text: "Je ne fixe pas de limite", score: 1 },
      { text: "Je limite si demandé par les autorités", score: 2 },
      { text: "Je fixe moi-même une limite raisonnable", score: 3 },
      { text: "Je respecte strictement la capacité de charge et refuse les groupes supplémentaires", score: 4 },
    ],
  },
];

async function seed() {
  if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
    console.error('Variables .env manquantes.');
    process.exit(1);
  }

  await dataSource.initialize();
  console.log('Database connected');

  const questionnaireRepo = dataSource.getRepository(Questionnaire);
  const categoryRepo      = dataSource.getRepository(QuestionCategory);
  const questionRepo      = dataSource.getRepository(Question);
  const answerRepo        = dataSource.getRepository(Answer);

  const existing = await questionnaireRepo.findOne({
    where: { target_type: 'guide', is_active: true },
  });

  if (existing) {
    console.log('Questionnaire guide already seeded. Skipping.');
    await dataSource.destroy();
    return;
  }

  // Réutiliser les catégories existantes ou créer si nécessaire
  let categories = await categoryRepo.find({
    where: [{ name: 'environmental' }, { name: 'social' }, { name: 'economic' }],
  });

  if (categories.length < 3) {
    const existing = new Set(categories.map((c) => c.name));
    const toCreate = ['environmental', 'social', 'economic'].filter((n) => !existing.has(n));
    const newCats = await categoryRepo.save(toCreate.map((name) => categoryRepo.create({ name })));
    categories = [...categories, ...newCats];
  }

  const catMap = new Map(categories.map((c) => [c.name, c]));

  const questionnaire = await questionnaireRepo.save(
    questionnaireRepo.create({
      name: 'Questionnaire Guide Éco-Responsable',
      target_type: 'guide',
      version: 1,
      description: 'Évaluez vos pratiques de guide en matière de tourisme durable et responsable.',
      max_score: QUESTIONS.length * 4,
      is_active: true,
    }),
  );

  for (const q of QUESTIONS) {
    const question = await questionRepo.save(
      questionRepo.create({
        questionnaire_id: questionnaire.id,
        category_id:      catMap.get(q.category)!.id,
        question_text:    q.text,
        question_order:   q.order,
        weight:           1,
      }),
    );

    for (let i = 0; i < q.answers.length; i++) {
      await answerRepo.save(
        answerRepo.create({
          question_id:  question.id,
          answer_text:  q.answers[i].text,
          score:        q.answers[i].score,
          answer_order: i,
        }),
      );
    }
  }

  console.log(`Seeded guide questionnaire with ${QUESTIONS.length} questions`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
