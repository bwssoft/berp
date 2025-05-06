"use client";

import { IProfile } from "@/app/lib/@backend/domain";
import { SetLockedProfileForm } from "@/app/lib/@frontend/ui/form";
import { ControlTree } from "@/app/lib/util";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  ClockIcon,
  IdentificationIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../component";
import {
  AuditByControlCodeProfileModal,
  ProfileLinkedControlModal,
  useAuditByControlCodeProfileModal,
  useProfileLinkedControlModal,
} from "../../modal";
import { useAuth } from "../../../context";

interface Props {
  controlTree: ControlTree;
  totalControlsOnModule: number;
  profile: IProfile | null;
}

export function SubModuleControlList(props: Props) {
  const { controlTree, profile, totalControlsOnModule } = props;
  const linkedControlModal = useProfileLinkedControlModal();
  const auditModal = useAuditByControlCodeProfileModal();

  return (
    <>
      <ul
        role="list"
        className="mt-10 px-4 sm:px-6 lg:px-8 flex flex-col space-y-2"
      >
        {controlTree.map((control, index) => (
          <li
            key={control.id + index}
            className="col-span-1  rounded-lg bg-white shadow"
          >
            {renderControlTree(
              control,
              profile,
              totalControlsOnModule,
              linkedControlModal.handleControlSelection,
              auditModal.handleControlSelection
            )}
          </li>
        ))}
      </ul>

      <ProfileLinkedControlModal
        profiles={linkedControlModal.profiles}
        closeModal={linkedControlModal.closeModal}
        open={linkedControlModal.open}
        control={linkedControlModal.control}
      />

      <AuditByControlCodeProfileModal
        audits={auditModal.audits ?? { docs: [] }}
        closeModal={auditModal.closeModal}
        open={auditModal.open}
        control={auditModal.control}
        currentPage={auditModal.page}
        handleChangePage={auditModal.handleChangePage}
      />
    </>
  );
}

//ACORDION BSOFT

const renderControlTree = (
  control: ControlTree[number],
  profile: IProfile | null,
  totalControlsOnModule: number,
  openProfileModal: (props: { id: string; name: string; code: string }) => void,
  openAuditModal: (props: { id: string; name: string; code: string }) => void
) => {
  const has_children = control.children.length > 0;

  const { restrictFeatureByProfile } = useAuth()
  const hideActiveButton = restrictFeatureByProfile("admin:profile:inactive");

  return (
    <Disclosure key={control.id}>
      <DisclosureButton className="border-b border-gray-200 w-full p-6 group flex justify-between items-center gap-2">
        <p className="flex gap-2">
          {control.name}
          {!has_children && (
            <span>
              <InformationCircleIcon
                className="size-5"
                title={control.description}
              />
            </span>
          )}
        </p>
        <div className="flex items-center gap-4">
          {!has_children && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                title="Histórico"
                onClick={() => {
                  openAuditModal({
                    id: control.id,
                    name: control.name,
                    code: control.code,
                  });
                }}
                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <ClockIcon className="size-5" />
              </Button>
              <Button
                type="button"
                title="Perfis"
                onClick={() =>
                  openProfileModal({
                    id: control.id,
                    name: control.name,
                    code: control.code,
                  })
                }
                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <IdentificationIcon className="size-5" />
              </Button>
              {hideActiveButton && (
                <SetLockedProfileForm
                  control={control}
                  profile={profile}
                  totalControlsOnModule={totalControlsOnModule}
                />
              )}
            </div>
          )}
          {has_children ? (
            <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
          ) : (
            <></>
          )}
        </div>
      </DisclosureButton>
      {has_children ? (
        <div>
          <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0">
            {control.children.map((c) =>
              renderControlTree(
                c,
                profile,
                totalControlsOnModule,
                openProfileModal,
                openAuditModal
              )
            )}
          </DisclosurePanel>
        </div>
      ) : (
        <></>
      )}
    </Disclosure>
  );
};
