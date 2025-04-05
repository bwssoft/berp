import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { getStatusProps } from "@/app/lib/util";
import React from "react";

interface Props {
  data: IConfigurationLog | null;
}

export function ConfigurationLogDescription({ data }: Props) {
  if (!data) {
    return (
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900">
          Configuration Log Information Not Found
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
          Configuration Log Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Detailed configuration log from the device.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          {/* Configuration Status */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Result</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
              <Icon className={`h-5 w-5 ${statusClass}`} />
              <span className={`mr-2 ${statusClass}`}>{text}</span>
            </dd>
          </div>

          {/* Profile Information */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Profile</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.profile.name}
            </dd>
          </div>

          {/* Equipment Information */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">IMEI</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.equipment.imei}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Serial</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.equipment.serial}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Firmware</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.equipment.firmware}
            </dd>
          </div>

          {data.equipment.iccid && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">ICCID</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data.equipment.iccid}
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

          {/* Double Check */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Was checked</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.checked ? "Yes" : "No"}
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
            <dt className="text-sm/6 font-medium text-gray-900">User</dt>
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
                      <div className="ml-4 flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">
                          Request: {cmd.request}
                        </span>
                        {cmd.response &&
                          (typeof cmd.response === "object" ? (
                            <pre className="whitespace-pre-wrap text-gray-400 text-sm/6">
                              {JSON.stringify(cmd.response, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-gray-400">
                              Response: {cmd.response}
                            </span>
                          ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}

          {/* Parsed Profile */}
          {data.parsed_profile && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">
                Parsed Profile
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 py-4 pl-4 pr-5 rounded-md border border-gray-200">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(data.parsed_profile, null, 2)}
                </pre>
              </dd>
            </div>
          )}

          {/* Raw Profile */}
          {data.raw_profile && data.raw_profile.length > 0 && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">
                Raw Profile
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <ul className="list-disc pl-5">
                  {data.raw_profile.map(([key, value], idx) => (
                    <li key={idx}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}

          {/* Not Configured */}
          {data.not_configured && (
            <>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Not Configured
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 py-4 pl-4 pr-5 rounded-md border border-gray-200">
                  {data.not_configured.general && (
                    <DiffRenderer diff={data.not_configured.general} />
                  )}

                  {data.not_configured.specific && (
                    <DiffRenderer diff={data.not_configured.specific} />
                  )}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}

interface DiffRendererProps {
  diff: any;
}

const DiffRenderer = ({ diff }: DiffRendererProps) => {
  // Se diff for do tipo ProfileDiff, renderiza os valores.
  if ("value1" in diff && "value2" in diff) {
    return (
      <div className="ml-2">
        <div>
          Desired: <span className="inline">{JSON.stringify(diff.value1)}</span>
        </div>
        <div>
          Actual: <span className="inline">{JSON.stringify(diff.value2)}</span>
        </div>
      </div>
    );
  }

  return (
    <ul className="pl-5">
      {Object.entries(diff).map(([key, subDiff]) => (
        <li key={key} className="mb-2">
          <span className="font-medium">{key}:</span>
          <DiffRenderer diff={subDiff} />
        </li>
      ))}
    </ul>
  );
};
