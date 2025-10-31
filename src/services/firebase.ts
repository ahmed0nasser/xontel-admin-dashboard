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
  collectionGroup,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Employee, Message, Feedback, Conversation } from '../types';

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

  return onSnapshot(q, async (querySnapshot) => {
    const messages: Message[] = [];
    const batch = writeBatch(db);
    const hrUser = await getHRUser();
    let performUpdate = false;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.senderId !== hrUser.id && !data.isRead) {
        batch.update(doc.ref, { isRead: true });
        performUpdate = true;
      }
      messages.push({
        id: doc.id,
        senderId: data.senderId,
        text: data.text,
        timestamp: data.timestamp.toDate(),
        isRead: true, // Visually mark as read immediately
      });
    });

    if (performUpdate) {
      await batch.commit();
    }

    onMessagesUpdate(messages);
  });
};

export const sendMessage = async (
  conversationId: string,
  text: string,
  senderId: string
): Promise<void> => {
  const conversationRef = doc(db, 'conversations', conversationId);
  const messagesRef = collection(conversationRef, 'messages');

  const batch = writeBatch(db);

  batch.set(
    conversationRef,
    {
      lastMessage: text,
      lastMessageTimestamp: Timestamp.now(),
      lastMessageSenderId: senderId,
    },
    { merge: true }
  );

  batch.set(doc(messagesRef), {
    senderId: senderId,
    text,
    timestamp: Timestamp.now(),
    isRead: false,
  });

  await batch.commit();
};

export const subscribeToUnreadCount = async (
  conversationId: string,
  onCountUpdate: (count: number) => void
): Promise<() => void> => {
  const messagesRef = collection(
    db,
    'conversations',
    conversationId,
    'messages'
  );
  const hrUser = await getHRUser();
  const q = query(
    messagesRef,
    where('senderId', '!=', hrUser.id),
    where('isRead', '==', false)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    onCountUpdate(querySnapshot.size);
  });

  return unsubscribe;
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

export const subscribeToConversations = (
  onConversationsUpdate: (conversations: Conversation[]) => void
): (() => void) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, orderBy('lastMessageTimestamp', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const conversations: Conversation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      conversations.push({
        id: doc.id,
        participantNames: data.participantNames,
        lastMessage: data.lastMessage,
        lastMessageTimestamp: data.lastMessageTimestamp.toDate(),
        lastMessageSenderId: data.lastMessageSenderId || '',
        messages: [], // Messages subcollection is not loaded here
      });
    });
    onConversationsUpdate(conversations);
  });
};

export const subscribeToTotalUnreadCount = async (
  onCountUpdate: (count: number) => void
): Promise<() => void> => {
  const hrUser = await getHRUser();
  const messagesCollectionGroup = collectionGroup(db, 'messages');
  const q = query(
    messagesCollectionGroup,
    where('isRead', '==', false),
    where('senderId', '!=', hrUser.id)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    onCountUpdate(querySnapshot.size);
  });

  return unsubscribe;
};
