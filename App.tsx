import React, { useState, useCallback, useMemo } from "react"
import TimerSquare from "./components/TimerSquare"
import { TimerItem } from "./types"

const App: React.FC = () => {
  const createTimers = (
    count: number,
    duration: number,
    prefix: string,
    secondaryDuration?: number,
  ): TimerItem[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${i}`,
      duration,
      secondaryDuration,
      label: `${duration} Min`,
    }))

  const [groupA3Min, setGroupA3Min] = useState<TimerItem[]>(() =>
    createTimers(6, 3, "3 Min-a"),
  )
  const [groupB3Min, setGroupB3Min] = useState<TimerItem[]>(() =>
    createTimers(6, 3, "3 Min-b"),
  )
  const [group1Min, setGroup1Min] = useState<TimerItem[]>(() =>
    createTimers(6, 1, "1 Min", 3),
  )
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null)

  const handleStart = (id: string) => {
    if (!activeTimerId) setActiveTimerId(id)
  }

  const handleComplete = useCallback((id: string) => {
    setActiveTimerId(null)
    setGroupA3Min((prev) => prev.filter((t) => t.id !== id))
    setGroupB3Min((prev) => prev.filter((t) => t.id !== id))
    setGroup1Min((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const totalRemaining =
    groupA3Min.length + groupB3Min.length + group1Min.length
  const totalInitial = 18
  const completedCount = totalInitial - totalRemaining

  const sections = useMemo(
    () => [
      {
        key: "sentadillas",
        title: "Sentadillas",
        items: groupA3Min,
        badges: [{ label: "3 min rest", type: "accent" as const }],
      },
      {
        key: "lagartijas",
        title: "Lagartijas",
        items: groupB3Min,
        badges: [{ label: "3 min rest", type: "accent" as const }],
      },
      {
        key: "planchas",
        title: "Planchas",
        items: group1Min,
        badges: [
          { label: "1 min work", type: "accent" as const },
          { label: "3 min rest", type: "recover" as const },
        ],
      },
    ],
    [groupA3Min, groupB3Min, group1Min],
  )

  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-10 lg:p-16 bg-surface">
      {/* ── Header ── */}
      <header className="w-full max-w-3xl pt-8 pb-16 sm:pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-zinc-100">
              Focus<span className="text-accent font-medium">.</span>
            </h1>
          </div>
          {/* Progress pill */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-50 border border-surface-100">
            <div className="w-24 h-1 rounded-full bg-surface-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                style={{ width: `${(completedCount / totalInitial) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
              {completedCount}/{totalInitial}
            </span>
          </div>
        </div>
        <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-md">
          Selecciona una tarea para comenzar. Solo una a la vez.
        </p>
      </header>

      {/* ── Sections ── */}
      <main className="w-full max-w-3xl flex flex-col gap-20 pb-32">
        {sections.map(({ key, title, items, badges }) => (
          <section key={key}>
            {/* Section header */}
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="text-lg font-medium text-zinc-200 tracking-tight">
                {title}
              </h2>
              <div className="h-px flex-1 bg-surface-100/50" />
              <div className="flex gap-2">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className={`font-mono text-[10px] px-2.5 py-1 rounded-full tracking-wider uppercase ${
                      b.type === "recover"
                        ? "text-emerald-400/70 bg-recover-soft border border-recover-border"
                        : "text-amber-400/70 bg-accent-soft border border-accent-border"
                    }`}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid or completion state */}
            {items.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((timer) => (
                  <TimerSquare
                    key={timer.id}
                    id={timer.id}
                    minutes={timer.duration}
                    secondaryMinutes={timer.secondaryDuration}
                    isActive={activeTimerId === timer.id}
                    isGlobalBusy={activeTimerId !== null}
                    onStart={() => handleStart(timer.id)}
                    onComplete={handleComplete}
                  />
                ))}
              </div>
            ) : (
              <div className="animate-fade-in py-16 flex flex-col items-center justify-center border border-dashed border-surface-100 rounded-2xl">
                <span className="text-zinc-600 text-sm font-light tracking-wide">
                  Completado
                </span>
              </div>
            )}
          </section>
        ))}
      </main>

      {/* ── Active indicator (bottom bar) ── */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          activeTimerId
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface-50/80 backdrop-blur-xl border border-surface-100/80 shadow-2xl shadow-black/50">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
          </span>
          <span className="text-[11px] font-medium text-zinc-400 tracking-widest uppercase">
            Enfocado
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
