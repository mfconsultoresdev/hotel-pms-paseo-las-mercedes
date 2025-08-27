'use client'

import React from 'react'
import { 
  ResponsiveContainer as RechartsResponsiveContainer,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Line as RechartsLine,
  Bar as RechartsBar,
  Pie as RechartsPie,
  Cell as RechartsCell,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts'

// ResponsiveContainer wrapper
interface ResponsiveContainerProps {
  width?: string | number
  height?: string | number
  children: React.ReactNode
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  width = "100%", 
  height = 400, 
  children 
}) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsResponsiveContainer width={width} height={height}>
      {children}
    </RechartsResponsiveContainer>
  )
}

// LineChart wrapper
interface LineChartProps {
  data: any[]
  children: React.ReactNode
}

export const LineChart: React.FC<LineChartProps> = ({ data, children }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsLineChart data={data}>
      {children}
    </RechartsLineChart>
  )
}

// BarChart wrapper
interface BarChartProps {
  data: any[]
  children: React.ReactNode
}

export const BarChart: React.FC<BarChartProps> = ({ data, children }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsBarChart data={data}>
      {children}
    </RechartsBarChart>
  )
}

// PieChart wrapper
interface PieChartProps {
  children: React.ReactNode
}

export const PieChart: React.FC<PieChartProps> = ({ children }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsPieChart>
      {children}
    </RechartsPieChart>
  )
}

// Line wrapper
interface LineProps {
  type?: "monotone" | "linear" | "step" | "stepBefore" | "stepAfter" | "basis" | "basisOpen" | "basisClosed" | "natural" | "monotoneX" | "monotoneY"
  dataKey: string
  stroke: string
  name?: string
}

export const Line: React.FC<LineProps> = ({ type, dataKey, stroke, name }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsLine type={type} dataKey={dataKey} stroke={stroke} name={name} />
  )
}

// Bar wrapper
interface BarProps {
  dataKey: string
  fill: string
  name?: string
}

export const Bar: React.FC<BarProps> = ({ dataKey, fill, name }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsBar dataKey={dataKey} fill={fill} name={name} />
  )
}

// Pie wrapper
interface PieProps {
  data: any[]
  cx: string
  cy: string
  labelLine: boolean
  label: (props: any) => string
  outerRadius: number
  fill: string
  dataKey: string
  children: React.ReactNode
}

export const Pie: React.FC<PieProps> = ({ 
  data, 
  cx, 
  cy, 
  labelLine, 
  label, 
  outerRadius, 
  fill, 
  dataKey, 
  children 
}) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsPie
      data={data}
      cx={cx}
      cy={cy}
      labelLine={labelLine}
      label={label}
      outerRadius={outerRadius}
      fill={fill}
      dataKey={dataKey}
    >
      {children}
    </RechartsPie>
  )
}

// Cell wrapper
interface CellProps {
  key: string
  fill: string
}

export const Cell: React.FC<CellProps> = ({ key, fill }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsCell key={key} fill={fill} />
  )
}

// XAxis wrapper
interface XAxisProps {
  dataKey: string
}

export const XAxis: React.FC<XAxisProps> = ({ dataKey }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsXAxis dataKey={dataKey} />
  )
}

// YAxis wrapper
export const YAxis: React.FC = () => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsYAxis />
  )
}

// CartesianGrid wrapper
interface CartesianGridProps {
  strokeDasharray: string
}

export const CartesianGrid: React.FC<CartesianGridProps> = ({ strokeDasharray }) => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsCartesianGrid strokeDasharray={strokeDasharray} />
  )
}

// Tooltip wrapper
export const Tooltip: React.FC = () => {
  // @ts-ignore - Ignorar conflicto de tipos entre React y Recharts
  return (
    <RechartsTooltip />
  )
}
