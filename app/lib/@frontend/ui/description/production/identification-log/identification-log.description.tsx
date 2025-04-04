import { IIdentificationLog } from "@/app/lib/@backend/domain";
import { getStatusProps } from "@/app/lib/util";
import React from "react";

interface Props {
  data: IIdentificationLog | null;
}

export function IdentificationLogDescription({ data }: Props) {
  if (!data) {
    return (
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900">
          Identification Log Information Not Found
        </h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Please look for other information.
        </p>
      </div>
    );
  }
  const formattedCreatedAt = new Date(data.created_at).toLocaleString();
  const { Icon, statusClass, text } = getStatusProps(data.status);

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900">
          Identification Log Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Detailed identification log from the device.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          {/* Result */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Result</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
              <Icon className={`h-5 w-5 ${statusClass}`} />
              <span className={`mr-2 ${statusClass}`}>{text}</span>
            </dd>
          </div>

          {/* Old ID */}
          {data.before && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">
                Before Identification
              </dt>
              <dd className="flex flex-col mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <p>{data.before.serial}</p>
                <p>{data.before.imei}</p>
              </dd>
            </div>
          )}

          {/* Current ID */}
          {data.after && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">
                After Identification
              </dt>
              <dd className="flex flex-col mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <p>{data.after.serial ?? "--"}</p>
                <p>{data.after.imei ?? "--"}</p>
              </dd>
            </div>
          )}
          {/* Technology */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Technology</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.technology.system_name}
            </dd>
          </div>

          {/* Created At */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Created At</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formattedCreatedAt}
            </dd>
          </div>

          {/* User ID */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">User ID</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.user.name}
            </dd>
          </div>

          {/* Metadata - Test Duration */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">
              Test Duration
            </dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {(data.metadata.end_time - data.metadata.init_time) / 1000}s
            </dd>
          </div>

          {/* Metadata - Commands */}
          {data.metadata.commands && data.metadata.commands.length > 0 && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Commands</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 rounded-md border border-gray-200"
                >
                  {data.metadata.commands.map((cmd, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">
                          Request: {cmd.request}
                        </span>
                        {cmd.response && (
                          <span className="text-gray-400">
                            Response: {cmd.response}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
