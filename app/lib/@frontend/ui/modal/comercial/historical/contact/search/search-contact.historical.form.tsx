"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  Button,
  SearchContactHistoricalAccountForm,
} from "../../../../../component";
import { useSearchContactHistoricalModal } from "./use-search-contact.historical.form";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { ContactSelection } from "@/app/lib/@backend/domain";

interface ContactModalProps {
  accountId?: string;
  selectContact: ContactSelection;
  setSelectContact: (
    value:
      | ContactSelection
      | ((prev: ContactSelection | undefined) => ContactSelection | undefined)
      | undefined
  ) => void;
}

export function SearchContactHistoricalModal({
  accountId,
  selectContact,
  setSelectContact,
}: ContactModalProps) {
  const { closeModal, openModal, open, contactsByCompany, isLoading } =
    useSearchContactHistoricalModal(accountId ?? "");

  return (
    <>
      <Button
        onClick={openModal}
        type="button"
        variant={"ghost"}
        className="p-1"
      >
        <PhoneIcon className="h-5 w-5" />
      </Button>

      <Modal
        open={open}
        onClose={closeModal}
        title="Selecione um contato para o histórico"
        className="bg-white h-full max-h-[70vh]"
        position="center"
      >
        <ModalContent>
          <ModalBody>
            <SearchContactHistoricalAccountForm
              isLoading={isLoading}
              selectContact={selectContact}
              setSelectContact={setSelectContact}
              closeModal={closeModal}
              contacts={contactsByCompany ?? []}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
