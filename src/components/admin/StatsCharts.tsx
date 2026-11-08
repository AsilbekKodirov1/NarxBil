// src/components/admin/StatsCharts.tsx
"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sparkles, TrendingUp } from "lucide-react";

interface StatsChartsProps {
  weeklyTrend: Array<{ date: string; skanerlar: number }>;
  top5Products: Array<{
    id: string;
    name: string;
    barcode: string;
    scanCount: number;
  }>;
}

export function StatsCharts({ weeklyTrend, top5Products }: StatsChartsProps) {
  const barData = top5Products.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    soni: p.scanCount,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Haftalik skanerlash dinamikasi (AreaChart) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Oxirgi 7 kunlik skanerlashlar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Mijozlar tomonidan amalga oshirilgan so&apos;rovlar
            </p>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="redNavyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderRadius: "12px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                }}
              />
              <Area
                type="monotone"
                dataKey="skanerlar"
                name="Skanerlashlar"
                stroke="#DC2626"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#redNavyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Eng ko'p qidirilgan tovarlar (BarChart) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Eng mashhur 5 ta mahsulot</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Eng ko&apos;p narxi so&apos;ralgan tovarlar
            </p>
          </div>
        </div>

        <div className="w-full h-64">
          {barData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
              Hozircha skanerlash ma&apos;lumotlari yetarli emas
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="soni" name="Skanerlar" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

