"use client";

import { useState } from "react";

interface Batch {
  name: string;
  startDate: string;
  studentsCount: string;
  progress: number;
  color: string;
}

interface WordPack {
  name: string;
  words: number;
  units: number;
  views: string;
  status: "Active" | "Draft";
  thumbnail: string;
}

export default function AdminDashboardPage() {
  const [timeFilter, setTimeFilter] = useState<"week" | "month">("month");

  const stats = [
    {
      label: "Total Students",
      value: "1,284",
      change: "+12%",
      isPositive: true,
      icon: "ti-users",
      colorClass: "text-primary bg-primary/10",
      borderClass: "group-hover:bg-primary"
    },
    {
      label: "Active Learners",
      value: "856",
      change: "+5.2%",
      isPositive: true,
      icon: "ti-bolt",
      colorClass: "text-secondary bg-secondary/10",
      borderClass: "group-hover:bg-secondary"
    },
    {
      label: "Avg Pass Rate",
      value: "92.4%",
      change: "-1.4%",
      isPositive: false,
      icon: "ti-certificate",
      colorClass: "text-tertiary bg-tertiary/10",
      borderClass: "group-hover:bg-tertiary"
    },
    {
      label: "Active Packs",
      value: "48",
      change: "+3",
      isPositive: true,
      icon: "ti-package",
      colorClass: "text-primary-fixed-dim bg-primary-fixed-dim/10",
      borderClass: "group-hover:bg-primary-fixed-dim"
    }
  ];

  const batches: Batch[] = [
    {
      name: "IELTS Advanced A1",
      startDate: "Oct 12, 2026",
      studentsCount: "24/30",
      progress: 78,
      color: "bg-secondary"
    },
    {
      name: "TOEFL Morning Prep",
      startDate: "Oct 15, 2026",
      studentsCount: "18/20",
      progress: 42,
      color: "bg-primary"
    },
    {
      name: "SAT Verbal Sprint",
      startDate: "Oct 20, 2026",
      studentsCount: "12/15",
      progress: 10,
      color: "bg-primary"
    }
  ];

  const wordPacks: WordPack[] = [
    {
      name: "Business Idioms A2",
      words: 240,
      units: 12,
      views: "1.2k",
      status: "Active",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo4Em8zNeqwwzANsHbAsKyUT4VwRGSELwyZ-N8MNKntGPI0wbwhsrEORJFMvIzfAwMw9QsmhmeeuWHrZ5Lx363KJWt7RwimWmPembWxpL29feyhZlEdNL31fYLtN8VusuGp3miSFYyN1atkn_EBQhNyaGm-9l_2VoYDbq4_YYAWWV_ATC4bXWYILkcuBrKBconGHwArEIlzO7phZm62ONdRWJ8tr6kM4dkSPbl9P5xQ-2maPz21pPOA1MZjfgH_9VDwkgX7O0RB0M"
    },
    {
      name: "Academic Vocab Master",
      words: 500,
      units: 20,
      views: "840",
      status: "Draft",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuZT4S-3g6-2YSlxqW3T-6HnYHJ36VvEaIMBZxj5ifD75qIJDuBYnZDPAUfA8w-u1l-01DO7N8FqikFMaory8N6N5YgOmw2KCJN9QezX3-Ek2tbXz1l1RHtwd3G3xZmK9bgh7YPDAd9wGUtsN3tWTEQBpvxmlIqu7yXsiLif9pkyn5AtD5jYoVXfFwvgX8c_qQGORTO3GfPjc3XOySB9NP0ZlSgA5FYs4sxflrrtWzfXGUq9qtFxdRePZn0Cn12do50ZCbKAAi-HU"
    }
  ];

  return (
    <div className="space-y-8 pb-16 select-none font-sans text-on-surface">
      {/* Summary Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 flex flex-col gap-2 relative overflow-hidden group hover:bg-surface-container transition-all"
          >
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.colorClass} text-base`}>
                <i className={`ti ${stat.icon}`} />
              </div>
              <span
                className={`text-xs font-bold ${
                  stat.isPositive ? "text-secondary" : "text-error"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-xl font-bold text-on-surface mt-0.5">{stat.value}</h3>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-primary/10 ${stat.borderClass} transition-colors`} />
          </div>
        ))}
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Batches Table Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Active Batches</h4>
            <button className="text-primary font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer border-none bg-transparent">
              <span>View All Batches</span>
              <i className="ti ti-arrow-right" />
            </button>
          </div>
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden shadow-lg shadow-black/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/40 border-b border-outline-variant/20">
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Batch Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {batches.map((batch) => (
                    <tr
                      key={batch.name}
                      className="hover:bg-surface-container/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-on-surface">{batch.name}</span>
                          <span className="text-[9px] text-on-surface-variant mt-0.5">
                            Starts: {batch.startDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                        {batch.studentsCount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-28">
                          <span className="text-[9px] font-bold text-on-surface-variant">
                            {batch.progress}%
                          </span>
                          <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div
                              className={`h-full ${batch.color} rounded-full`}
                              style={{ width: `${batch.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-1.5 hover:bg-surface-container rounded-lg text-primary transition-colors border-none bg-transparent cursor-pointer"
                            title="Add Student"
                          >
                            <i className="ti ti-user-plus text-base" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors border-none bg-transparent cursor-pointer"
                            title="Edit Batch"
                          >
                            <i className="ti ti-edit text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Custom Word Packs Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider px-1">Word Packs</h4>
          <div className="space-y-4">
            {/* Create New CTA */}
            <div className="bg-primary-container/5 border-2 border-dashed border-primary/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-primary-container/10 transition-all group">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-primary/10">
                <i className="ti ti-plus text-base" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-primary">Create New Pack</h5>
                <p className="text-[9px] text-on-surface-variant mt-0.5">
                  Design custom curriculum modules
                </p>
              </div>
            </div>

            {/* Pack Cards */}
            {wordPacks.map((pack) => (
              <div
                key={pack.name}
                className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 space-y-4 hover:border-primary/45 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-outline-variant/10">
                    <img src={pack.thumbnail} alt={pack.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-on-surface truncate">{pack.name}</h5>
                    <p className="text-[9px] text-on-surface-variant mt-0.5">
                      {pack.words} Words • {pack.units} Units
                    </p>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary border-none bg-transparent cursor-pointer">
                    <i className="ti ti-dots-vertical" />
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-3 border-t border-outline-variant/10">
                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <i className="ti ti-eye text-xs" /> {pack.views} views
                  </span>
                  <span
                    className={`font-semibold ${
                      pack.status === "Active" ? "text-secondary" : "text-primary"
                    }`}
                  >
                    {pack.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Visualization Space */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Institution Growth</h4>
          <div className="flex bg-surface-container p-0.5 rounded-lg border border-outline-variant/20">
            <button
              onClick={() => setTimeFilter("week")}
              className={`px-3 py-1 rounded-md text-[10px] font-bold cursor-pointer border-none ${
                timeFilter === "week" ? "bg-primary text-white" : "text-on-surface-variant"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFilter("month")}
              className={`px-3 py-1 rounded-md text-[10px] font-bold cursor-pointer border-none ${
                timeFilter === "month" ? "bg-primary text-white" : "text-on-surface-variant"
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl h-56 border border-outline-variant/10 flex items-center justify-center relative overflow-hidden shadow-lg shadow-black/10">
          {/* Faux Graph Background SVG */}
          <svg className="absolute bottom-0 left-0 w-full opacity-10 h-40" viewBox="0 0 800 200" preserveAspectRatio="none">
            <path
              d="M0 150 Q 100 120 200 140 T 400 80 T 600 110 T 800 50 L 800 200 L 0 200 Z"
              fill="url(#grad1)"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "var(--primary)", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
          </svg>
          <div className="z-10 flex flex-col items-center gap-2">
            <i className="ti ti-chart-line text-3xl text-primary animate-pulse" />
            <p className="text-xs font-semibold text-on-surface-variant">
              Engagement growth analytics active...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
