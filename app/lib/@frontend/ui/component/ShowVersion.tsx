"use client"

import { publicConfig } from "@/app/lib/config";


export function ShowVersion() {
  return (
    <div className="font-extralight justify-center m-auto">
      <p>{publicConfig.BCUBE_VERSION}</p>
    </div>
  );
}
