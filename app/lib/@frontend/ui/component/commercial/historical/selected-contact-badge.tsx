"use client";

import { ContactSelection } from "@/app/lib/@backend/domain";
import {
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { WhatsappIcon } from "@/app/lib/@frontend/svg/whatsapp-icon";

interface SelectedContactBadgeProps {
  selectContact: ContactSelection | undefined;
  onRemove: () => void;
}

export function SelectedContactBadge({
  selectContact,
  onRemove,
}: SelectedContactBadgeProps) {
  if (!selectContact || !selectContact.id) {
    return null;
  }

  const getContactIcon = (type: string, channel: string) => {
    if (channel === "Whatsapp") {
      return <WhatsappIcon classname="w-3 h-3 text-green-600" />;
    }

    if (type === "Email") {
      return <EnvelopeIcon className="w-3 h-3 text-blue-600" />;
    }

    if (type.includes("Telefone") || type === "Celular") {
      return <PhoneIcon className="w-3 h-3 text-gray-600" />;
    }

    return <PhoneIcon className="w-3 h-3 text-gray-600" />;
  };

  const getChannelLabel = (type: string, channel: string) => {
    if (channel === "Whatsapp") {
      return "WhatsApp";
    }
    return type;
  };

  const getBadgeColor = (type: string, channel: string) => {
    if (channel === "Whatsapp") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (type === "Email") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (type === "Celular") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border text-sm font-medium ${getBadgeColor(selectContact.type, selectContact.channel)} mb-2`}
    >
      <div className="flex items-center space-x-1.5">
        {getContactIcon(selectContact.type, selectContact.channel)}
        <span className="truncate max-w-32">{selectContact.name}</span>
        <span className="text-xs opacity-75">
          ({getChannelLabel(selectContact.type, selectContact.channel)})
        </span>
      </div>

      <button
        onClick={onRemove}
        className="flex-shrink-0 p-0.5 text-current opacity-60 hover:opacity-100 hover:bg-black/10 rounded-full transition-all duration-200"
        title="Remover contato selecionado"
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </div>
  );
}
