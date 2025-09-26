"use client";

import { ContactSelection } from "@/app/lib/@backend/domain";
import {
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { WhatsappIcon } from "@/app/lib/@frontend/svg/whatsapp-icon";

interface SelectedContactCardProps {
  selectContact: ContactSelection | undefined;
  onRemove: () => void;
  showAnimation?: boolean;
}

export function SelectedContactCard({
  selectContact,
  onRemove,
  showAnimation = true,
}: SelectedContactCardProps) {
  if (!selectContact || !selectContact.id) {
    return null;
  }

  const getContactIcon = (type: string, channel: string) => {
    if (channel === "Whatsapp") {
      return <WhatsappIcon classname="w-4 h-4 text-green-600" />;
    }

    if (type === "Email") {
      return <EnvelopeIcon className="w-4 h-4 text-blue-600" />;
    }

    if (type.includes("Telefone") || type === "Celular") {
      return <PhoneIcon className="w-4 h-4 text-gray-600" />;
    }

    return <PhoneIcon className="w-4 h-4 text-gray-600" />;
  };

  const getChannelLabel = (type: string, channel: string) => {
    if (channel === "Whatsapp") {
      return "WhatsApp";
    }
    return type;
  };

  const getBadgeColor = (type: string, channel: string) => {
    if (channel === "Whatsapp") {
      return "bg-green-100 text-green-800";
    }

    if (type === "Email") {
      return "bg-blue-100 text-blue-800";
    }

    if (type === "Celular") {
      return "bg-purple-100 text-purple-800";
    }

    return "bg-gray-100 text-gray-800";
  };

  const animationClass = showAnimation
    ? "animate-in slide-in-from-top-2 fade-in-0 duration-300"
    : "";
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Contato selecionado
      </h3>
      <div
        className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm ${animationClass}`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {getContactIcon(selectContact.type, selectContact.channel)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectContact.name}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(selectContact.type, selectContact.channel)}`}
              >
                {getChannelLabel(selectContact.type, selectContact.channel)}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {selectContact.contact}
            </p>
            {selectContact.id === "outros-contact" && (
              <p className="text-xs text-amber-600 font-medium">
                • Contato personalizado
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          title="Remover contato selecionado"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
