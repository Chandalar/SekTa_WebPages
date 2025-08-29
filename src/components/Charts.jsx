import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Color palette for charts
const COLORS = {
  primary: '#f97316', // orange-500
  secondary: '#06b6d4', // cyan-500
  accent: '#8b5cf6', // violet-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  info: '#3b82f6', // blue-500
  light: '#6b7280', // gray-500
};

const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.light
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Animated Bar Chart Component
export function AnimatedBarChart({ data, title, xKey, yKey, color = COLORS.primary, height = 300 }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis 
            dataKey={xKey} 
            stroke="#ffffff80" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#ffffff80" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey={yKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Animated Stacked Bar Chart Component
export function AnimatedStackedBarChart({ data, title, xKey, barKeys, colors, height = 300 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis 
            dataKey={xKey} 
            stroke="#ffffff80" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#ffffff80" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {barKeys.map((key, index) => (
            <Bar 
              key={key}
              dataKey={key} 
              stackId="a"
              fill={colors[index % colors.length] || COLORS.primary}
              radius={index === barKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Animated Pie Chart Component
export function AnimatedPieChart({ data, title, nameKey, valueKey, height = 300 }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                stroke={activeIndex === index ? "#ffffff" : "none"}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Animated Line Chart Component
export function AnimatedLineChart({ data, title, xKey, yKey, color = COLORS.secondary, height = 300 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey={xKey} stroke="#ffffff80" fontSize={12} />
          <YAxis stroke="#ffffff80" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Animated Area Chart Component
export function AnimatedAreaChart({ data, title, xKey, yKey, color = COLORS.accent, height = 300 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis dataKey={xKey} stroke="#ffffff80" fontSize={12} />
          <YAxis stroke="#ffffff80" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            fill={`${color}40`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Radar Chart Component for Player Stats
export function PlayerRadarChart({ data, title, height = 300 }) {
  // Group data by player name if multiple players data is provided
  const multiplePlayers = data.some(item => item.name);
  
  let chartData = data;
  let playerNames = [];
  
  if (multiplePlayers) {
    // Extract unique player names
    playerNames = [...new Set(data.map(item => item.name))].filter(Boolean);
    
    // Get unique subjects (attributes)
    const subjects = [...new Set(data.map(item => item.subject))];
    
    // Reorganize data for multi-player radar chart
    chartData = subjects.map(subject => {
      const dataPoint = { subject };
      
      playerNames.forEach(name => {
        const playerData = data.find(item => item.name === name && item.subject === subject);
        dataPoint[name] = playerData ? playerData.A : 0;
      });
      
      return dataPoint;
    });
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -5 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#ffffff30" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 12 }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 'auto']} 
            tick={{ fill: '#ffffff60', fontSize: 10 }}
          />
          
          {multiplePlayers ? (
            // Multiple players
            playerNames.map((name, index) => (
              <Radar
                key={name}
                name={name}
                dataKey={name}
                stroke={PIE_COLORS[index % PIE_COLORS.length]}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))
          ) : (
            // Single player
            <Radar
              name="Stats"
              dataKey="A"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          {multiplePlayers && <Legend />}
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Stats Card Component with Counter Animation
export function StatsCard({ title, value, subtitle, icon, color = COLORS.primary, change, changeType = 'positive' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon && <span style={{ color }} className="text-2xl">{icon}</span>}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {subtitle && (
              <div className="text-white/60 text-sm">{subtitle}</div>
            )}
          </div>
        </div>
        {change && (
          <span 
            className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-400' : 
              changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </motion.div>
  );
}