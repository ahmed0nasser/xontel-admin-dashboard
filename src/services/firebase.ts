import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Employee, Message, Feedback } from '../types';

export const getUserById = async (userId: string): Promise<Employee> => {
  const userDoc = await getDoc(doc(db, 'employees', userId));
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const data = userDoc.data();
  return {
    id: userDoc.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    title: data.title,
    profilePictureUrl: data.profilePictureUrl,
    role: data.role,
    joinedDate: data.joinedDate.toDate(),
    createdAt: data.createdAt.toDate(),
  };
};

export const getHRUser = async (): Promise<Employee> => {
  const q = query(collection(db, 'employees'), where('role', '==', 'hr'), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('HR user not found');
  }

  const hrDoc = querySnapshot.docs[0];
  const data = hrDoc.data();

  return {
    id: hrDoc.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    title: data.title,
    profilePictureUrl: data.profilePictureUrl,
    role: data.role,
    joinedDate: data.joinedDate.toDate(),
    createdAt: data.createdAt.toDate(),
  };
};

export const subscribeToMessages = (
  conversationId: string,
  onMessagesUpdate: (messages: Message[]) => void
): (() => void) => {
  const messagesRef = collection(
    db,
    'conversations',
    conversationId,
    'messages'
  );
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        senderId: data.senderId,
        text: data.text,
        timestamp: data.timestamp.toDate(),
        isRead: data.isRead,
      });
    });
    onMessagesUpdate(messages);
  });
};

export const sendMessage = async (
  conversationId: string,
  text: string
): Promise<void> => {
  const conversationRef = doc(db, 'conversations', conversationId);
  const messagesRef = collection(conversationRef, 'messages');

  const batch = writeBatch(db);

  batch.set(
    conversationRef,
    {
      lastMessage: text,
      lastMessageTimestamp: Timestamp.now(),
    },
    { merge: true }
  );

  batch.set(doc(messagesRef), {
    senderId: conversationId,
    text,
    timestamp: Timestamp.now(),
    isRead: false,
  });

  await batch.commit();
};

export const markMessagesAsRead = async (
  conversationId: string
): Promise<void> => {
  const messagesRef = collection(
    db,
    'conversations',
    conversationId,
    'messages'
  );
  const hrUser = await getHRUser();
  const q = query(
    messagesRef,
    where('senderId', '==', hrUser.id),
    where('isRead', '==', false)
  );

  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);

  querySnapshot.forEach((document) => {
    batch.update(document.ref, { isRead: true });
  });

  await batch.commit();
};

export const subscribeToUnreadCount = (
  conversationId: string,
  onCountUpdate: (count: number) => void
): (() => void) => {
  const messagesRef = collection(
    db,
    'conversations',
    conversationId,
    'messages'
  );
  
  getHRUser().then(hrUser => {
    const q = query(
      messagesRef,
      where('senderId', '==', hrUser.id),
      where('isRead', '==', false)
    );

    return onSnapshot(q, (querySnapshot) => {
      onCountUpdate(querySnapshot.size);
    });
  });

  return () => {};
};

export const subscribeToFeedback = (
  onFeedbackUpdate: (feedback: Feedback[]) => void
): (() => void) => {
  const feedbackRef = collection(db, 'feedback');
  const q = query(feedbackRef, orderBy('date', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const newFeedback: Feedback[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      newFeedback.push({
        id: doc.id,
        date: data.date.toDate(),
        employeeName: data.employeeName,
        score: data.score,
        notes: data.notes,
      });
    });
    onFeedbackUpdate(newFeedback);
  });
};
