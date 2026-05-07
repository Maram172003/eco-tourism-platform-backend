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
    text: "Comment gérez-vous l'approvisionnement en produits pour votre établissement ?",
    category: 'economic',
    order: 1,
    answers: [
      { text: "J'achète chez les grossistes les moins chers", score: 1 },
      { text: "Je mélange produits locaux et importés", score: 2 },
      { text: "Je privilégie les producteurs régionaux", score: 3 },
      { text: "Je m'approvisionne exclusivement chez des producteurs locaux certifiés", score: 4 },
    ],
  },
  {
    text: "Quelle est votre politique de gestion des déchets dans votre établissement ?",
    category: 'environmental',
    order: 2,
    answers: [
      { text: "Pas de politique particulière", score: 1 },
      { text: "Tri basique des déchets", score: 2 },
      { text: "Tri, compostage et réduction des emballages", score: 3 },
      { text: "Zéro déchet : compostage, recyclage total, emballages réutilisables et sensibilisation clients", score: 4 },
    ],
  },
  {
    text: "Comment réduisez-vous la consommation d'énergie dans votre projet ?",
    category: 'environmental',
    order: 3,
    answers: [
      { text: "Je n'ai pas de mesures spécifiques", score: 1 },
      { text: "J'utilise des ampoules basse consommation", score: 2 },
      { text: "J'ai installé des équipements économes et suis ma consommation", score: 3 },
      { text: "J'utilise des énergies renouvelables (solaire) et ai un bilan carbone annuel", score: 4 },
    ],
  },
  {
    text: "Comment intégrez-vous les habitants de la communauté locale dans votre projet ?",
    category: 'social',
    order: 4,
    answers: [
      { text: "Je n'ai pas de lien particulier avec la communauté", score: 1 },
      { text: "J'emploie quelques personnes locales", score: 2 },
      { text: "J'emploie majoritairement du personnel local et participe à des événements communautaires", score: 3 },
      { text: "Je co-gère avec la communauté, reverse une part des bénéfices et finance des projets sociaux locaux", score: 4 },
    ],
  },
  {
    text: "Quelle est votre gestion de l'eau dans votre établissement ?",
    category: 'environmental',
    order: 5,
    answers: [
      { text: "Aucune mesure particulière", score: 1 },
      { text: "Robinets à économiseur d'eau", score: 2 },
      { text: "Récupération des eaux de pluie et limitation arrosage", score: 3 },
      { text: "Système complet de recyclage des eaux grises, récupération pluie et sensibilisation des clients", score: 4 },
    ],
  },
  {
    text: "Comment communiquez-vous votre engagement éco-responsable à vos clients ?",
    category: 'social',
    order: 6,
    answers: [
      { text: "Je ne communique pas spécifiquement là-dessus", score: 1 },
      { text: "Une mention sur mon site internet", score: 2 },
      { text: "Une charte affichée dans mon établissement avec des actions concrètes", score: 3 },
      { text: "Formation du personnel, charte clients, rapport de durabilité annuel publié", score: 4 },
    ],
  },
  {
    text: "Comment gérez-vous l'impact touristique sur les sites naturels proches de votre établissement ?",
    category: 'environmental',
    order: 7,
    answers: [
      { text: "Ce n'est pas ma responsabilité", score: 1 },
      { text: "J'informe les clients des règles de base", score: 2 },
      { text: "Je propose des activités respectueuses et oriente vers des guides locaux", score: 3 },
      { text: "Je participe activement à la préservation des sites et contribue aux fonds de protection", score: 4 },
    ],
  },
  {
    text: "Quelle est votre politique salariale et sociale envers votre personnel ?",
    category: 'social',
    order: 8,
    answers: [
      { text: "Je respecte le minimum légal", score: 1 },
      { text: "Je paie légèrement au-dessus du SMIG", score: 2 },
      { text: "Je propose des salaires corrects et des formations", score: 3 },
      { text: "Salaires valorisants, formations continues, participation aux bénéfices et couverture sociale complète", score: 4 },
    ],
  },
  {
    text: "Avez-vous une certification ou un label éco-responsable pour votre établissement ?",
    category: 'economic',
    order: 9,
    answers: [
      { text: "Non, je ne vois pas l'intérêt", score: 1 },
      { text: "J'envisage d'en obtenir un", score: 2 },
      { text: "Je suis en cours de certification", score: 3 },
      { text: "Je possède une ou plusieurs certifications et les renouvelle régulièrement", score: 4 },
    ],
  },
  {
    text: "Comment mesurez-vous l'impact de votre projet sur le développement local ?",
    category: 'economic',
    order: 10,
    answers: [
      { text: "Je ne le mesure pas", score: 1 },
      { text: "Je regarde mes données financières", score: 2 },
      { text: "Je suis les emplois créés et les achats locaux", score: 3 },
      { text: "Je publie un rapport d'impact annuel incluant données sociales, environnementales et économiques", score: 4 },
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
    where: { target_type: 'eco_project', is_active: true },
  });

  if (existing) {
    console.log('Questionnaire eco_project already seeded. Skipping.');
    await dataSource.destroy();
    return;
  }

  let categories = await categoryRepo.find({
    where: [{ name: 'environmental' }, { name: 'social' }, { name: 'economic' }],
  });

  if (categories.length < 3) {
    const existingNames = new Set(categories.map((c) => c.name));
    const toCreate = ['environmental', 'social', 'economic'].filter((n) => !existingNames.has(n));
    const newCats = await categoryRepo.save(toCreate.map((name) => categoryRepo.create({ name })));
    categories = [...categories, ...newCats];
  }

  const catMap = new Map(categories.map((c) => [c.name, c]));

  const questionnaire = await questionnaireRepo.save(
    questionnaireRepo.create({
      name: 'Questionnaire Propriétaire Éco-Responsable',
      target_type: 'eco_project',
      version: 1,
      description: 'Évaluez le niveau de durabilité et d\'impact éco-responsable de votre projet touristique.',
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

  console.log(`Seeded project questionnaire with ${QUESTIONS.length} questions`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
