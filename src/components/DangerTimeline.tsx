"use client";

interface DangerTimelineProps {
  clauses: {
    clauseNumber: number;
    timelineMonth: number;
    timelineEvent: string;
    riskLevel: string;
    isIllegal: boolean;
  }[];
  totalMonths?: number;
}

export default function DangerTimeline({ clauses, totalMonths: totalMonthsProp }: DangerTimelineProps) {
  const totalMonths = totalMonthsProp || Math.max(12, ...clauses.map(c => c.timelineMonth));
  const timelineEvents = clauses
    .filter((c) => c.timelineMonth > 0 && c.timelineEvent)
    .sort((a, b) => a.timelineMonth - b.timelineMonth);

  if (timelineEvents.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-medium mb-4">Clause Danger Timeline</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 right-0 top-4 h-px bg-gray-200" />

        {/* Month markers */}
        <div className="flex justify-between mb-8 relative">
          {Array.from({ length: totalMonths + 1 }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-px h-2 bg-gray-300 mb-1" />
              <span className="text-[10px] text-gray-400">{i === 0 ? "Start" : `M${i}`}</span>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="space-y-3">
          {timelineEvents.map((event) => {
            const leftPercent = (event.timelineMonth / totalMonths) * 100;
            const dotColor = event.isIllegal
              ? "bg-red-500"
              : event.riskLevel === "HIGH"
              ? "bg-red-400"
              : event.riskLevel === "MEDIUM"
              ? "bg-amber-400"
              : "bg-green-400";

            return (
              <div key={event.clauseNumber} className="relative flex items-start gap-3 pl-3">
                <div
                  className="absolute top-0 h-full w-px bg-gray-200"
                  style={{ left: `${Math.min(leftPercent, 95)}%` }}
                />
                <div className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      Month {event.timelineMonth}
                    </span>
                    <span className="text-xs text-gray-400">Clause #{event.clauseNumber}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{event.timelineEvent}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
