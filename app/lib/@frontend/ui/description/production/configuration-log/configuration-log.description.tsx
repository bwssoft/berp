import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { getStatusProps } from "@/app/lib/util";
import { PaperClipIcon } from "@heroicons/react/20/solid";
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
  const { Icon, statusClass, text } = getStatusProps(data.is_configured);

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
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {/* Configuration Status */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Test Result</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
              <Icon className={`h-5 w-5 ${statusClass}`} />
              <span className={`mr-2 ${statusClass}`}>{text}</span>
            </dd>
          </div>

          {/* Profile Information */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Profile</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.profile.name} (ID: {data.profile.id})
            </dd>
          </div>

          {/* Equipment Information */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">
              Equipment IMEI
            </dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.equipment.imei}
            </dd>
          </div>
          {data.equipment.serial && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Serial</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data.equipment.serial}
              </dd>
            </div>
          )}
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
              {data.technology.name}
            </dd>
          </div>

          {/* Double Check */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">
              Double Check
            </dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              Needed: {data.double_check.need ? "Yes" : "No"} | Completed:{" "}
              {data.double_check.has ? "Yes" : "No"}
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
              {data.user_id}
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
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
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
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <pre className="whitespace-pre-wrap text-sm/6 text-gray-700">
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
              {data.not_configured.general &&
                Object.keys(data.not_configured.general).length > 0 && (
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm/6 font-medium text-gray-900">
                      Not Configured (General)
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <ul className="list-disc pl-5">
                        {Object.entries(data.not_configured.general).map(
                          ([key, diff]) => {
                            const typedDiff = diff as {
                              value1: any;
                              value2: any;
                            };
                            return (
                              <li key={key}>
                                {key}: Desired {typedDiff.value1} vs Actual{" "}
                                {typedDiff.value2}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </dd>
                  </div>
                )}
              {data.not_configured.specific &&
                Object.keys(data.not_configured.specific).length > 0 && (
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm/6 font-medium text-gray-900">
                      Not Configured (Specific)
                    </dt>
                    <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <ul className="list-disc pl-5">
                        {Object.entries(data.not_configured.specific).map(
                          ([key, diff]) => {
                            const typedDiff = diff as {
                              value1: any;
                              value2: any;
                            };
                            return (
                              <li key={key}>
                                {key}: Desired {typedDiff.value1} vs Actual{" "}
                                {typedDiff.value2}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </dd>
                  </div>
                )}
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
