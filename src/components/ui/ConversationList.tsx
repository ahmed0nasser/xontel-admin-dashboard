import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import {
  subscribeToConversations,
  subscribeToUnreadCount,
  getUserById,
} from "../../services/firebase";
import type { Employee, Conversation } from "../../types";
import UnreadBadge from "./UnreadBadge";
import { formatRelativeTime } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

interface ConversationListProps {
  onSelectEmployee: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

interface ConversationWithDetails extends Conversation {
  employee: Employee;
  unreadCount: number;
  lastMessageSenderFirstName: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectEmployee,
  selectedEmployee,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<ConversationWithDetails[]>(
    []
  );

  useEffect(() => {
    const unsubscribe = subscribeToConversations(async (newConversations) => {
      const conversationsWithDetails: ConversationWithDetails[] =
        await Promise.all(
          newConversations.map(async (conv) => {
            const employee = await getUserById(conv.id);
            const lastMessageSenderFirstName =
              conv.lastMessageSenderId === employee.id
                ? employee.firstName
                : (user?.firstName as string);
            return {
              ...conv,
              employee,
              unreadCount: 0,
              lastMessageSenderFirstName,
            };
          })
        );
      setConversations(conversationsWithDetails);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    conversations.forEach((conv) => {
      const unsubPromise = subscribeToUnreadCount(conv.id, (count) => {
        setConversations((prevConvs) =>
          prevConvs.map((p) =>
            p.id === conv.id ? { ...p, unreadCount: count } : p
          )
        );
      });
      unsubPromise.then((unsub) => unsubscribers.push(unsub));
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [conversations]);

  const filteredConversations = conversations.filter((conv) =>
    `${conv.employee.firstName} ${conv.employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full px-4 lg:px-2">
        <div className="px-2 w-full flex items-center mb-4 rounded-3xl border border-gray-300 bg-gray-200 hover:border-gray-400 duration-300">
          <span className="text-2xl">
            <CiSearch />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="p-2 w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div>
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className={`flex p-3 border-b border-zinc-400/50 cursor-pointer transition-colors duration-300 ${
              selectedEmployee?.id === conv.employee.id
                ? "bg-brand-blue/80 text-white"
                : "hover:bg-brand-blue/20"
            }`}
            onClick={() => onSelectEmployee(conv.employee)}
          >
            <img
              src={conv.employee.profilePictureUrl}
              alt={`${conv.employee.firstName} ${conv.employee.lastName}`}
              className="h-12 w-12 rounded-full mr-3"
            />
            <div className="grow overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold truncate">{`${conv.employee.firstName} ${conv.employee.lastName}`}</p>
                  <p className="text-sm text-zinc-500">{conv.employee.title}</p>
                </div>
                <p className="text-xs text-zinc-500 shrink-0 ml-2">
                  {formatRelativeTime(conv.lastMessageTimestamp)}
                </p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-zinc-600 truncate">
                  {conv.lastMessageSenderFirstName}: {conv.lastMessage}
                </p>
                <UnreadBadge count={conv.unreadCount} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
