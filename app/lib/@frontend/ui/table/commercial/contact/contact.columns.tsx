import { ColumnDef } from "@tanstack/react-table";
import { ContactItem } from "../../../form/commercial/account/contact/create/use-contact.create.account";
import { WhatsappIcon } from "../../../../svg/whatsapp-icon";
import {
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Checkbox } from '@/frontend/ui/component/checkbox';


interface Props {
  handlePreferredContact: (
    index: number,
    key: keyof ContactItem["preferredContact"]
  ) => void;
  handleRemove: (index: number) => void;
}

export const columnsContact = (props: Props): ColumnDef<ContactItem>[] => [
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) => {
      const contact = row.original;
      return contact.type;
    },
  },
  {
    header: "Contato",
    accessorKey: "contact",
    cell: ({ row }) => {
      const contact = row.original;
      return contact.contact;
    },
  },
  {
    header: "Contato preferencial",
    accessorKey: "preferredContact",
    cell: ({ row }) => {
      const contact = row.original;

      return (
        <div className="flex gap-2">
          {(contact.type[0] === "Celular" ||
            contact.type[0] === "Telefone Residencial" ||
            contact.type[0] === "Telefone Comercial") && (
            <label className="flex items-center">
              <Checkbox
                checked={contact.preferredContact?.phone === true}
                onClick={() => props.handlePreferredContact(row.index, "phone")}
              />
              <PhoneIcon className="w-5 h-5" />
            </label>
          )}

          {contact.type[0] === "Email" && (
            <label className="flex items-center">
              <Checkbox
                checked={contact.preferredContact?.email === true}
                onClick={() => props.handlePreferredContact(row.index, "email")}
              />
              <EnvelopeIcon className="w-5 h-5" />
            </label>
          )}

          {contact.type[0] === "Celular" && (
            <label className="flex items-center">
              <Checkbox
                checked={contact.preferredContact?.whatsapp === true}
                onClick={() =>
                  props.handlePreferredContact(row.index, "whatsapp")
                }
              />
              <WhatsappIcon classname="w-5 h-5" />
            </label>
          )}
        </div>
      );
    },
  },
  {
    header: "",
    accessorKey: "id",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <button
          type="button"
          onClick={() => props.handleRemove(Number(contact.id!))}
          className="text-gray-600 hover:text-blue-900 px-0 py-0"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      );
    },
  },
];
