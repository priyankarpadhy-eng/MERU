import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_USER = {
  email: 'demo@leadmanager.com',
  name: 'Alex Vance',
  password: 'Password123',
};

const LEADS = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acmecorp.io',
    phone: '+1 415 555 0101',
    company: 'Acme Systems',
    source: 'WEBSITE',
    status: 'NEW',
    notes: 'Inquired about enterprise onboarding and team seat pricing.',
    daysAgo: 1,
  },
  {
    name: 'David Chen',
    email: 'd.chen@apextechnologies.com',
    phone: '+1 212 555 0142',
    company: 'Apex Technologies',
    source: 'LINKEDIN',
    status: 'CONTACTED',
    notes: 'Had initial 15-minute intro call. Evaluating CRM alternatives for Q1.',
    daysAgo: 2,
  },
  {
    name: 'Elena Rostova',
    email: 'elena@vanguarddigital.de',
    phone: '+49 30 555 0199',
    company: 'Vanguard Digital',
    source: 'REFERRAL',
    status: 'QUALIFIED',
    notes: 'Budget approved ($45k ARR). Scheduled contract review for next Tuesday.',
    daysAgo: 3,
  },
  {
    name: 'Marcus Brody',
    email: 'mbrody@cobaltlogistics.com',
    phone: '+1 312 555 0188',
    company: 'Cobalt Logistics',
    source: 'COLD_CALL',
    status: 'LOST',
    notes: 'Decided to renew with incumbent vendor due to existing multi-year commit.',
    daysAgo: 5,
  },
  {
    name: 'Amara Okafor',
    email: 'amara.okafor@stridehealth.org',
    phone: '+1 650 555 0134',
    company: 'Stride Health',
    source: 'EVENT',
    status: 'NEW',
    notes: 'Met at SaaStr annual booth. Interested in automated pipeline tracking.',
    daysAgo: 6,
  },
  {
    name: 'Liam Gallagher',
    email: 'liam@beaconfinancial.co.uk',
    phone: '+44 20 7946 0912',
    company: 'Beacon Financial',
    source: 'WEBSITE',
    status: 'CONTACTED',
    notes: 'Requested security compliance sheet (SOC2 Type II). Sent via email.',
    daysAgo: 7,
  },
  {
    name: 'Claire Dupont',
    email: 'c.dupont@miragecommerce.fr',
    phone: '+33 1 42 68 55 00',
    company: 'Mirage Commerce',
    source: 'ADVERTISEMENT',
    status: 'QUALIFIED',
    notes: 'Pilot approved with 5 sales reps. Starting trial phase Monday.',
    daysAgo: 8,
  },
  {
    name: 'Tariq Al-Mansoor',
    email: 'tariq@crescentventures.ae',
    phone: '+971 4 312 4500',
    company: 'Crescent Ventures',
    source: 'LINKEDIN',
    status: 'NEW',
    notes: 'Interested in portfolio-wide roll out across 12 venture companies.',
    daysAgo: 9,
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@zenithcloud.in',
    phone: '+91 80 4123 4567',
    company: 'Zenith Cloud',
    source: 'REFERRAL',
    status: 'QUALIFIED',
    notes: 'Referred by CTO. Architecture review passed without objections.',
    daysAgo: 10,
  },
  {
    name: 'Thomas Lindqvist',
    email: 'thomas@nordicdesign.se',
    phone: '+46 8 123 4567',
    company: 'Nordic Design Studio',
    source: 'WEBSITE',
    status: 'CONTACTED',
    notes: 'Looking for a simple, clutter-free lead workflow for their agency.',
    daysAgo: 12,
  },
  {
    name: 'Hannah Abbott',
    email: 'hannah@solarpulse.energy',
    phone: '+1 503 555 0177',
    company: 'SolarPulse Energy',
    source: 'OTHER',
    status: 'LOST',
    notes: 'Budget postponed to H2 2027. Set reminder to follow up in 6 months.',
    daysAgo: 14,
  },
  {
    name: 'Kenji Sato',
    email: 'kenji.sato@omnitech.jp',
    phone: '+81 3 5555 0143',
    company: 'OmniTech Tokyo',
    source: 'EVENT',
    status: 'NEW',
    notes: 'Connected after keynote. Needs Japanese timezone support verification.',
    daysAgo: 15,
  },
  {
    name: 'Rachel Green',
    email: 'rachel@hudsonretail.com',
    phone: '+1 212 555 0195',
    company: 'Hudson Retail Group',
    source: 'ADVERTISEMENT',
    status: 'CONTACTED',
    notes: 'Demo completed. VP of Sales was enthusiastic about the clean UX.',
    daysAgo: 16,
  },
  {
    name: 'Mateo Morales',
    email: 'mmorales@solaria.es',
    phone: '+34 91 555 0122',
    company: 'Solaria Networks',
    source: 'REFERRAL',
    status: 'QUALIFIED',
    notes: 'Legal reviewing Master Services Agreement (MSA). 20 seats.',
    daysAgo: 18,
  },
  {
    name: 'Chloe Tremblay',
    email: 'chloe@laurentianmedia.ca',
    phone: '+1 514 555 0166',
    company: 'Laurentian Media',
    source: 'WEBSITE',
    status: 'NEW',
    notes: 'Downloaded product spec sheet. Follow-up email triggered.',
    daysAgo: 19,
  },
  {
    name: 'Julian Vance',
    email: 'julian@vanceprecision.com',
    phone: '+1 303 555 0119',
    company: 'Vance Precision Labs',
    source: 'COLD_CALL',
    status: 'CONTACTED',
    notes: 'Spoke with operations director. Wants integration with existing tools.',
    daysAgo: 21,
  },
  {
    name: 'Nadia Petrov',
    email: 'n.petrov@aerovision.ch',
    phone: '+41 22 555 0178',
    company: 'AeroVision Switzerland',
    source: 'LINKEDIN',
    status: 'LOST',
    notes: 'Strict on-prem requirement. SaaS model did not meet their policy.',
    daysAgo: 22,
  },
  {
    name: 'Gabriel Santos',
    email: 'gsantos@paulistalabs.br',
    phone: '+55 11 5555 0190',
    company: 'Paulista Labs',
    source: 'EVENT',
    status: 'NEW',
    notes: 'Met at Web Summit. Expanding sales team from 3 to 15 reps.',
    daysAgo: 24,
  },
  {
    name: 'Ingrid Berg',
    email: 'ingrid@fjordmaritime.no',
    phone: '+47 21 55 01 44',
    company: 'Fjord Maritime',
    source: 'REFERRAL',
    status: 'QUALIFIED',
    notes: 'Final contract sent for electronic signature. Deal size $32k.',
    daysAgo: 25,
  },
  {
    name: 'Wei Zhang',
    email: 'w.zhang@quantumdynamics.sg',
    phone: '+65 6789 0123',
    company: 'Quantum Dynamics SG',
    source: 'WEBSITE',
    status: 'CONTACTED',
    notes: 'Requested custom data retention terms. Escalated to compliance.',
    daysAgo: 27,
  },
  {
    name: 'Zoe Katsaros',
    email: 'zoe@aegeananalytics.gr',
    phone: '+30 210 555 0161',
    company: 'Aegean Analytics',
    source: 'ADVERTISEMENT',
    status: 'NEW',
    notes: 'Sign-up through inbound marketing campaign. Sent intro deck.',
    daysAgo: 28,
  },
  {
    name: 'Owen Fletcher',
    email: 'owen@ironcladoverland.com',
    phone: '+1 404 555 0132',
    company: 'Ironclad Overland',
    source: 'COLD_CALL',
    status: 'LOST',
    notes: 'Internal reorganization halted all new software procurement.',
    daysAgo: 30,
  },
  {
    name: 'Lila Rossi',
    email: 'lila.rossi@milanoapparel.it',
    phone: '+39 02 5555 0184',
    company: 'Milano Apparel Group',
    source: 'LINKEDIN',
    status: 'CONTACTED',
    notes: 'Followed up after mutual connection recommendation.',
    daysAgo: 32,
  },
  {
    name: 'Arthur Pendelton',
    email: 'arthur@crownheritage.uk',
    phone: '+44 161 555 0129',
    company: 'Crown Heritage Partners',
    source: 'WEBSITE',
    status: 'QUALIFIED',
    notes: 'Procurement paperwork in progress. Expected start date 1st of month.',
    daysAgo: 35,
  },
  {
    name: 'Fatima Zahra',
    email: 'f.zahra@atlascreative.ma',
    phone: '+212 522 55 01 77',
    company: 'Atlas Creative Studio',
    source: 'OTHER',
    status: 'NEW',
    notes: 'Independent boutique studio seeking simple lead tracking.',
    daysAgo: 38,
  },
];

async function main() {
  console.log('Seeding database...');

  // 1. Create or update demo user
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {
      name: DEMO_USER.name,
      passwordHash,
    },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      passwordHash,
    },
  });

  console.log(`Demo user ready: ${user.email} (ID: ${user.id})`);

  // Clear existing leads for the demo user for idempotent seeding
  await prisma.lead.deleteMany({
    where: { userId: user.id },
  });

  // 2. Insert leads with calculated creation dates
  const now = new Date();
  for (const item of LEADS) {
    const createdAt = new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.lead.create({
      data: {
        userId: user.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        company: item.company,
        source: item.source,
        status: item.status,
        notes: item.notes,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  console.log(`Successfully seeded ${LEADS.length} leads for demo user.`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
