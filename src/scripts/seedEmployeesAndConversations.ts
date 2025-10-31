// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck   
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  Timestamp
} from 'firebase/firestore';

// 🔥 REPLACE with your Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======================================
// 🎨 Deterministic avatar generator
// ======================================
function hashStringToNumber(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // convert to 32bit integer
  }
  return Math.abs(hash) % max;
}

function getDeterministicAvatar(username: string, gender: 'male' | 'female') {
  const n = hashStringToNumber(username, 50) + 1; // 1–50
  return `https://xsgames.co/randomusers/assets/avatars/${gender}/${n}.jpg`;
}

// ===========================
// 👩‍💼 USERS TO CREATE
// ===========================
const users = [
  {
    username: 'hr.manager',
    password: 'hrpassword123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    title: 'HR Manager',
    gender: 'female' as const,
    role: 'hr',
    joinedDate: new Date('2022-01-15'),
  },
  {
    username: 'john.doe',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Software Engineer',
    gender: 'male' as const,
    role: 'employee',
    joinedDate: new Date('2023-06-20'),
  },
  {
    username: 'emma.wilson',
    password: 'password123',
    firstName: 'Emma',
    lastName: 'Wilson',
    title: 'UI/UX Designer',
    gender: 'female' as const,
    role: 'employee',
    joinedDate: new Date('2023-07-01'),
  },
  {
    username: 'michael.brown',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Brown',
    title: 'Data Analyst',
    gender: 'male' as const,
    role: 'employee',
    joinedDate: new Date('2023-07-15'),
  },
  {
    username: 'olivia.smith',
    password: 'password123',
    firstName: 'Olivia',
    lastName: 'Smith',
    title: 'Project Coordinator',
    gender: 'female' as const,
    role: 'employee',
    joinedDate: new Date('2023-08-01'),
  },
  {
    username: 'liam.james',
    password: 'password123',
    firstName: 'Liam',
    lastName: 'James',
    title: 'QA Engineer',
    gender: 'male' as const,
    role: 'employee',
    joinedDate: new Date('2023-09-05'),
  },
  {
    username: 'sophia.miller',
    password: 'password123',
    firstName: 'Sophia',
    lastName: 'Miller',
    title: 'Marketing Specialist',
    gender: 'female' as const,
    role: 'employee',
    joinedDate: new Date('2023-09-10'),
  },
];

// ===========================
// 🔧 SEED USERS
// ===========================
async function seedUsers() {
  console.log('Starting user seeding...');
  const userIds: Record<string, string> = {};

  for (const user of users) {
    try {
      const email = `${user.username}@chatapp.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, user.password);
      const uid = userCredential.user.uid;
      userIds[user.username] = uid;

      const profilePictureUrl = getDeterministicAvatar(user.username, user.gender);

      await setDoc(doc(db, 'employees', uid), {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        profilePictureUrl,
        role: user.role,
        joinedDate: Timestamp.fromDate(user.joinedDate),
        createdAt: Timestamp.now(),
      });

      console.log(`✅ Created ${user.username} (${uid}) → ${profilePictureUrl}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ User ${user.username} already exists, skipping...`);
      } else {
        console.error(`❌ Error creating ${user.username}:`, error);
      }
    }
  }

  return userIds;
}

// ===========================
// 💬 SEED CONVERSATIONS
// ===========================
async function seedConversations(userIds: Record<string, string>) {
  console.log('\nStarting conversation seeding...');

  const hrId = userIds['hr.manager'];
  if (!hrId) {
    console.error('❌ HR Manager not found, cannot create conversations.');
    return;
  }

  const hrName = 'Sarah Johnson';

  for (const username of Object.keys(userIds)) {
    if (username === 'hr.manager') continue;

    const empId = userIds[username];
    const emp = users.find(u => u.username === username)!;
    const employeeName = `${emp.firstName} ${emp.lastName}`;

    const conversationRef = doc(db, 'conversations', empId);
    await setDoc(conversationRef, {
      participantNames: [hrName, employeeName],
      lastMessage: "Let's schedule your onboarding meeting soon!",
      lastMessageTimestamp: Timestamp.fromDate(new Date(Date.now() - 0.5 * 60 * 60 * 1000)),
      lastMessageSenderId: hrId,
    });

    const messagesRef = collection(conversationRef, 'messages');
    const messages = [
      {
        senderId: hrId,
        text: `Hi ${emp.firstName}! Welcome to the team 🎉`,
        timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
        isRead: true,
      },
      {
        senderId: empId,
        text: `Thank you ${hrName.split(' ')[0]}! Excited to start.`,
        timestamp: Timestamp.fromDate(new Date(Date.now() - 1.5 * 60 * 60 * 1000)),
        isRead: true,
      },
      {
        senderId: hrId,
        text: "Let's schedule your onboarding meeting soon!",
        timestamp: Timestamp.fromDate(new Date(Date.now() - 0.5 * 60 * 60 * 1000)),
        isRead: false,
      },
    ];

    for (const msg of messages) {
      await addDoc(messagesRef, msg);
    }

    console.log(`💬 Created conversation for ${employeeName}`);
  }
}

// ===========================
// 🚀 MAIN
// ===========================
async function main() {
  console.log('===============================');
  console.log('🔥 Firebase Employee Seeder');
  console.log('===============================\n');

  try {
    const userIds = await seedUsers();
    await seedConversations(userIds);

    console.log('\n===============================');
    console.log('✅ Seeding completed successfully!');
    console.log('===============================\n');

    console.log('Demo HR Login:');
    console.log('  Username: hr.manager');
    console.log('  Password: hrpassword123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    // @ts-expect-error correct node process exit
    process.exit(1);
  }
}

main();
