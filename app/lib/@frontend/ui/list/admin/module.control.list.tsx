"use client";

import { IControl, IProfile } from "@/app/lib/@backend/domain";
import { cn } from "@/app/lib/util";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  ProfileLinkedControlModal,
  useProfileLinkedControlModal,
} from "../../modal";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

interface Props {
  controls: PaginationResult<IControl>;
  profile: IProfile | null;
}

export function ModuleControlList(props: Props) {
  const { controls, profile } = props;
  const linkedControlModal = useProfileLinkedControlModal();

  return (
    <>
      <ul
        role="list"
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {controls.docs.map((control) => (
          <li
            key={control.id}
            className={cn(
              "group relative p-6 bg-white col-span-1 rounded-lg shadow ring-1 ring-inset ring-gray-900/10"
            )}
          >
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {control.name}
              </h3>
              <div className="w-fit mt-2 flex divide-x-2 divide-gray-300 text-sm text-gray-400 hover:cursor-pointer">
                <Link
                  href={`/admin/control/${control.id}/${profile?.id ?? ""}`}
                  key={control.id}
                  className="text-gray-500 pr-2 hover:underline hover:underline-offset-4 hover:text-blue-500"
                >
                  Detalhes
                </Link>
                <p
                  className="text-gray-500 px-2 hover:underline hover:underline-offset-4 hover:text-blue-500"
                  onClick={() =>
                    linkedControlModal.handleControlSelection({
                      id: control.id,
                      code: control.code,
                      name: control.name,
                    })
                  }
                >
                  Ver Perfis
                </p>
              </div>
            </div>
            {profile &&
              !profile?.locked_control_code.includes(control.code) && (
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-6 flex gap-2"
                >
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Presente no perfil
                  </div>
                </span>
              )}
          </li>
        ))}
      </ul>

      <ProfileLinkedControlModal
        profiles={linkedControlModal.profiles}
        closeModal={linkedControlModal.closeModal}
        open={linkedControlModal.open}
        control={linkedControlModal.control}
        isLoading={linkedControlModal.isLoading}
      />
    </>
  );
}
