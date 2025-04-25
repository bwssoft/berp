"use client"

import { publicConfig } from "@/app/lib/config/public";



export function ShowVersion() {
  return (
    <div className="font-extralight justify-center m-auto">
      <p> Versão {publicConfig.BCUBE_VERSION}</p>
    </div>
  );
}
