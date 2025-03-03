interface GenericLogItem {
  progress: number;
  label?: string;
}

interface ProgressBarProps<T extends GenericLogItem> {
  log: T[];
  inProgress: boolean;
  hintSelector?: (log: T[]) => string;
}

export const ProgressBar = <T extends GenericLogItem>({
  log,
  inProgress,
  hintSelector,
}: ProgressBarProps<T>) => {
  if (!inProgress) return null;

  const totalProgress = log
    .filter((item) => item.progress !== 100)
    .reduce((acc, item) => acc + item.progress, 0);

  const percentage = log.length > 0 ? totalProgress / log.length : 0;
  const hint = hintSelector ? hintSelector(log) : undefined;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-x-3 whitespace-nowrap">
          <div
            className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={1}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="w-6 text-end">
            <span className="text-sm text-gray-800">
              {percentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      {hint && (
        <p className="whitespace-nowrap text-sm text-gray-800">{hint}</p>
      )}
    </div>
  );
};
