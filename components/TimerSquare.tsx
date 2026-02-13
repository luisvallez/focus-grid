import React, { useState, useEffect, useRef } from "react"

interface TimerSquareProps {
  id: string
  minutes: number
  secondaryMinutes?: number
  isActive: boolean
  isGlobalBusy: boolean
  onStart: () => void
  onComplete: (id: string) => void
}

const TimerSquare: React.FC<TimerSquareProps> = ({
  id,
  minutes,
  secondaryMinutes,
  isActive,
  isGlobalBusy,
  onStart,
  onComplete,
}) => {
  const [phase, setPhase] = useState<1 | 2>(1)
  const [timeLeft, setTimeLeft] = useState(minutes * 60)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentPhaseMaxSeconds =
    (phase === 1 ? minutes : secondaryMinutes || 0) * 60

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      if (timerRef.current) clearInterval(timerRef.current)
      if (phase === 1 && secondaryMinutes) {
        setPhase(2)
        setTimeLeft(secondaryMinutes * 60)
      } else {
        onComplete(id)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, timeLeft, id, onComplete, phase, secondaryMinutes])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress =
    currentPhaseMaxSeconds > 0
      ? ((currentPhaseMaxSeconds - timeLeft) / currentPhaseMaxSeconds) * 100
      : 0

  const isDisabled = isGlobalBusy && !isActive
  const isRecovery = phase === 2

  // SVG ring dimensions
  const size = 72
  const stroke = 2.5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (progress / 100) * circumference

  const ringColor = isRecovery ? "#34d399" : "#f59e0b"

  return (
    <button
      onClick={!isDisabled ? onStart : undefined}
      disabled={isDisabled}
      className={`
        group relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center
        transition-all duration-500 ease-out cursor-pointer select-none
        ${
          isActive
            ? isRecovery
              ? "bg-recover-soft border border-recover-border animate-recovery-glow"
              : "bg-accent-soft border border-accent-border animate-breathing-glow"
            : isDisabled
              ? "bg-surface-50/40 border border-surface-100/30 opacity-30 cursor-not-allowed"
              : "bg-surface-50 border border-surface-100 hover:border-surface-200 hover:bg-surface-100/50"
        }
      `}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {isActive ? (
          <>
            {/* Circular progress ring */}
            <div className="relative">
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Track */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={stroke}
                  className="text-white/5"
                />
                {/* Progress */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
              </svg>
              {/* Time in center of ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`font-mono text-lg font-light tracking-wider ${isRecovery ? "text-emerald-300" : "text-amber-200"}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            {/* Phase label */}
            <span
              className={`text-[9px] font-medium tracking-[0.2em] uppercase animate-soft-pulse ${
                isRecovery ? "text-emerald-400/60" : "text-amber-400/60"
              }`}
            >
              {isRecovery ? "Rest" : "Active"}
            </span>
          </>
        ) : (
          <>
            {/* Idle state */}
            <span className="text-2xl font-extralight text-zinc-300 tracking-tight group-hover:text-zinc-100 transition-colors duration-300">
              {minutes}
              <span className="text-sm text-zinc-600 ml-0.5">m</span>
            </span>
            {!isDisabled && (
              <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300">
                Start
              </span>
            )}
          </>
        )}
      </div>
    </button>
  )
}

export default TimerSquare
