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
    text: "Vous êtes à Tunis et vous allez passer une semaine à Djerba. Comment voyagez-vous ?",
    category: 'environmental',
    order: 1,
    answers: [
      { text: "Prendre l'avion (1h)", score: 1 },
      { text: "Prendre votre voiture individuelle (6h)", score: 2 },
      { text: "Prendre le bus longue distance ou louage", score: 3 },
      { text: "Partager un trajet ou faire du covoiturage / hitchhike", score: 4 },
    ],
  },
  {
    text: "Vous arrivez dans une région que vous ne connaissez pas. Vous choisissez quel hébergement ?",
    category: 'environmental',
    order: 2,
    answers: [
      { text: "Un hôtel international confortable", score: 1 },
      { text: "Un hôtel touristique classique", score: 2 },
      { text: "Une maison d'hôtes locale", score: 3 },
      { text: "Un hébergement chez l'habitant ou un écolodge", score: 4 },
    ],
  },
  {
    text: "À midi, vous cherchez où manger. Que préférez-vous ?",
    category: 'economic',
    order: 3,
    answers: [
      { text: "Une chaîne internationale", score: 1 },
      { text: "Un restaurant touristique", score: 2 },
      { text: "Un petit restaurant local", score: 3 },
      { text: "Manger chez un producteur local ou une famille", score: 4 },
    ],
  },
  {
    text: "Vous arrivez dans une belle vallée ou une montagne. Que préférez-vous ?",
    category: 'social',
    order: 4,
    answers: [
      { text: "Visiter les endroits les plus populaires", score: 1 },
      { text: "Suivre un circuit touristique classique", score: 2 },
      { text: "Explorer les sentiers locaux", score: 3 },
      { text: "Participer à une activité guidée avec un guide local", score: 4 },
    ],
  },
  {
    text: "Vous souhaitez acheter un souvenir. Que choisissez-vous ?",
    category: 'economic',
    order: 5,
    answers: [
      { text: "Une boutique touristique", score: 1 },
      { text: "Un magasin de souvenirs", score: 2 },
      { text: "Un marché local", score: 3 },
      { text: "Acheter directement chez un artisan", score: 4 },
    ],
  },
  {
    text: "Pendant votre voyage, vous avez des bouteilles ou des emballages. Que faites-vous ?",
    category: 'environmental',
    order: 6,
    answers: [
      { text: "Les jeter dans la première poubelle disponible", score: 1 },
      { text: "Les jeter quand vous trouvez une poubelle", score: 2 },
      { text: "Essayer de trier les déchets", score: 3 },
      { text: "Réduire vos déchets (gourde, sac réutilisable)", score: 4 },
    ],
  },
  {
    text: "Pendant votre séjour, vous choisissez plutôt :",
    category: 'social',
    order: 7,
    answers: [
      { text: "Les attractions touristiques populaires", score: 1 },
      { text: "Les activités connues", score: 2 },
      { text: "Les activités nature ou culture locale", score: 3 },
      { text: "Les expériences organisées par des acteurs locaux", score: 4 },
    ],
  },
  {
    text: "Dans un village, vous avez du temps libre. Que faites-vous ?",
    category: 'social',
    order: 8,
    answers: [
      { text: "Rester dans les zones touristiques", score: 1 },
      { text: "Visiter les lieux les plus connus", score: 2 },
      { text: "Discuter avec quelques habitants", score: 3 },
      { text: "Essayer de participer à la vie locale", score: 4 },
    ],
  },
  {
    text: "Avant de partir dans une nouvelle région, comment préparez-vous votre voyage ?",
    category: 'environmental',
    order: 9,
    answers: [
      { text: "Choisir les destinations les plus populaires", score: 1 },
      { text: "Regarder les avis sur internet", score: 2 },
      { text: "Chercher des expériences locales", score: 3 },
      { text: "Chercher des activités durables et responsables", score: 4 },
    ],
  },
  {
    text: "Vous découvrez un endroit naturel magnifique mais fragile. Que faites-vous ?",
    category: 'environmental',
    order: 10,
    answers: [
      { text: "Prendre quelques photos puis partir", score: 1 },
      { text: "Partager l'endroit sur les réseaux sociaux", score: 2 },
      { text: "Respecter les règles et rester discret", score: 3 },
      { text: "Respecter les règles et sensibiliser les autres visiteurs", score: 4 },
    ],
  },
  {
    text: "Vous sejournez dans un village du sud. Comment gerez-vous votre consommation d'eau ?",
    category: 'environmental',
    order: 11,
    answers: [
      { text: "Prendre des douches longues", score: 1 },
      { text: "Faire attention quand vous y pensez", score: 2 },
      { text: "Essayer de limiter votre consommation", score: 3 },
      { text: "Faire tres attention et sensibiliser votre entourage", score: 4 },
    ],
  },
];

async function seed() {
  
  if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
    console.error(' Variables .env manquantes. Vérifiez le chemin du fichier .env');
    console.error('   DB_HOST:', process.env.DB_HOST);
    console.error('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'MANQUANT');
    process.exit(1);
  }

  await dataSource.initialize();
  console.log(' Database connected');

  const questionnaireRepo = dataSource.getRepository(Questionnaire);
  const categoryRepo      = dataSource.getRepository(QuestionCategory);
  const questionRepo      = dataSource.getRepository(Question);
  const answerRepo        = dataSource.getRepository(Answer);

  // Vérifier si déjà seedé
  const existing = await questionnaireRepo.findOne({
    where: { target_type: 'eco_traveler', is_active: true },
  });

  if (existing) {
    console.log('ℹ Questionnaire already seeded. Skipping.');
    await dataSource.destroy();
    return;
  }

  // Créer les catégories
  const categories = await categoryRepo.save([
    { name: 'environmental' },
    { name: 'social' },
    { name: 'economic' },
  ]);
  const catMap = new Map(categories.map((c) => [c.name, c]));

  // Créer le questionnaire
  const questionnaire = await questionnaireRepo.save(
    questionnaireRepo.create({
      name: 'Questionnaire Ecovoyage ',
      target_type: 'eco_traveler',
      version: 1,
      description: 'Imaginez que vous prenez une annee sabbatique pour decouvrir la Tunisie.',
      max_score: QUESTIONS.length * 4, //chaque question max = 4 points
      is_active: true,
    }),
  );

  // Créer les questions et réponses
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

  console.log(` Seeded questionnaire with ${QUESTIONS.length} questions`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(' Seed failed:', err.message);
  process.exit(1);
});