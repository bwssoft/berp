"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  configurationProfileId: string;
  selected: boolean;
}

export const SelectColumn = (props: Props) => {
  const { configurationProfileId, selected } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = () => {
    //Alterar route params para ser possivel exibir qual perfil foi selecionado
    const params = new URLSearchParams(searchParams);
    params.set("configuration_profile_id", configurationProfileId);
    router.replace(`${pathname}?${params.toString()}`);

    //Enviar mensagem para o crm
    window.parent.postMessage(
      {
        event: "configuration_profile",
        configuration_profile_link: `https://bconfig.vercel.app/configurator/E3+4G?id=${configurationProfileId}`,
        configuration_profile_selected: `${window.location.host}/crm/configuration-profile/form/update?id=${configurationProfileId}`,
      },
      "*"
    );
  };
  return (
    <div className="pr-2">
      {selected ? (
        <p className="text-blue-600 hover:text-blue-900">Selecionado</p>
      ) : (
        <button
          className="text-blue-600 hover:text-blue-900"
          onClick={handleClick}
        >
          Selecionar
        </button>
      )}
    </div>
  );
};
