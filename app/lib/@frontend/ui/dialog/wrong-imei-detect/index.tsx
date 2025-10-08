"use client";

import { cn } from "@/app/lib/util";
import { Dialog } from '@/frontend/ui/component/dialog';

import { XMarkIcon } from "@heroicons/react/24/outline";
import { DialogTitle } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface Props {
  wrongImeiDetected: boolean;
  setWrongImeiDetected: Dispatch<SetStateAction<boolean>>;
}
export const WrongImeiDetectedDialog = (props: Props) => {
  const { wrongImeiDetected, setWrongImeiDetected } = props;
  const router = useRouter();

  if (!wrongImeiDetected) return null;

  return (
    <>
      {wrongImeiDetected && (
        <Dialog
          open={wrongImeiDetected}
          setOpen={(value) => {
            if (!value) {
              setWrongImeiDetected(false);
              router.push(`/production/tool/identificator`);
            } else {
              setWrongImeiDetected(true);
            }
          }}
        >
          <div>
            <div
              className={cn(
                "mx-auto flex size-12 items-center justify-center rounded-full bg-red-100"
              )}
            >
              <XMarkIcon aria-hidden="false" className="size-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <DialogTitle
                as="h3"
                className="text-base font-semibold text-gray-900"
              >
                IMEI Inválido
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Não é permitido configurar equipamento com esse IMEI.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={() => {
                setWrongImeiDetected(false);
                router.push(`/production/tool/identificator`);
              }}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
            >
              Ok
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
};
