import styled from '@emotion/styled';
import { format, subDays } from 'date-fns';
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { TooltipContent, tooltipWrapperStyle } from './Tooltip';

const getRandomInteger = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getWeek = () => {
  const today = new Date();
  return [...Array(7)]
    .map((_, daysToGoBack) => subDays(today, daysToGoBack))
    .reverse();
};

const generateExampleData = () => {
  const week = getWeek();

  let data: { name: string; views: number; uniqueViews: number }[] = [];

  data = data.concat(
    week.flatMap((date) => {
      const views = getRandomInteger(56, 100);
      return [
        {
          name: format(date, 'yyyy-MM-dd'),
          views: views,
          uniqueViews: getRandomInteger(views / 4, views),
        },
      ];
    }),
  );

  return data;
};
const exampleData = generateExampleData();

export const PageViewChart = () => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={exampleData}>
          <defs>
            <linearGradient id="views-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0048ff" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#5de4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="views-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0052D4" />
              <stop offset="25%" stopColor="#2F80ED" />
              <stop offset="50%" stopColor="#65C7F7" />
              <stop offset="75%" stopColor="#56CCF2" />
              <stop offset="100%" stopColor="#9CECFB" />
            </linearGradient>
            <linearGradient
              id="uniqueViews-stroke"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fff" stopOpacity={0.6} />
              <stop offset="25%" stopColor="#fff" stopOpacity={0.65} />
              <stop offset="50%" stopColor="#fff" stopOpacity={0.8} />
              <stop offset="75%" stopColor="#fff" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#fff" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="3 3"
          />
          <XAxis dataKey="name" style={{ fontSize: 14 }} />
          <YAxis width={32} />
          <Tooltip
            content={({ payload, label }) => (
              <TooltipContent
                payload={payload}
                label={label}
                colors={['#65C7F7', '#fff']}
              />
            )}
            wrapperStyle={tooltipWrapperStyle}
          />
          <Area
            type="natural"
            name="Views"
            dataKey="views"
            fill="url(#views-fill)"
            fillOpacity={1}
            stroke="url(#views-stroke)"
            strokeWidth="4px"
          />
          <Area
            type="natural"
            name="Unique Views"
            dataKey="uniqueViews"
            fillOpacity={0}
            stroke="url(#uniqueViews-stroke)"
            strokeWidth="4px"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  padding: 16px;
  padding-right: 24px;
  background-color: black;
  border-radius: 8px;
  margin: 32px 20px 0;
`;
