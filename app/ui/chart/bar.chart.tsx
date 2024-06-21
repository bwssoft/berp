"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  title: string;
  subtitle: string;
  series: { name: string; data: number[]; color?: string }[];
  options: {
    xaxis: {
      categories: string[];
    };
  };
}

export const BarChart = (props: Props) => {
  const { series: _series, options: _options, title, subtitle } = props;
  const [chartOptions, setChartOptions] = useState({});
  const [series, setSeries] = useState<any>([]);

  useEffect(() => {
    const options = {
      chart: {
        type: "bar",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
        },
      },
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 1,
          },
        },
      },
      stroke: {
        show: true,
        width: 0,
        colors: ["transparent"],
      },
      grid: {
        strokeDashArray: 4,
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: _options.xaxis.categories,
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
        floating: false,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
        offsetX: 40,
      },
    };

    setChartOptions(options);
  }, [_options]);

  useEffect(() => {
    setSeries(_series);
  }, [_series]);

  return (
    <div className="flex flex-col w-full h-full bg-white border-x-2 border-x-gray-900/5 dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            {title}
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex-1">
        {series.length > 0 && (
          <Chart
            options={chartOptions}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
};
