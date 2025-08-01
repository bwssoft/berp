"use client";

import { useState } from "react";
import { Button, Modal, ModalBody, ModalContent } from "../../../component";
import { ActiveLoraForm } from "../../../form/connectivity/lora-activation/activate/active.lora.form";

export function LoraActivationModal() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Ativação/Desativação em Massa
      </Button>
      <Modal
        position="right"
        title={`Ativação/Desativação de chaves LoRa`}
        open={open}
        onClose={() => setOpen((prev) => !prev)}
      >
        <ModalBody>
          <ModalContent>
            <ActiveLoraForm />
          </ModalContent>
        </ModalBody>
      </Modal>
    </>
  );
}
