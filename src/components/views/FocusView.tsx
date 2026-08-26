import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNum, toIsoDateString } from '../../utils/jalali';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Maximize2,
  Minimize2,
  CheckSquare,
} from 'lucide-react';

type Mode = 'work' | 'shortBreak' | 'longBreak';

export const FocusView: React.FC = () => {
  const {
    activeFocusTask,
    setActiveFocusTask,
    tasks,
    addFocusSession,
    focusSessions,
    settings,
    t,
  } = useApp();

  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(settings.pomodoroWorkMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'whitenoise' | 'rain' | 'binaural'>('none');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Sync initial timer when mode or settings change
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'work') setTimeLeft(settings.pomodoroWorkMinutes * 60);
      else if (mode === 'shortBreak') setTimeLeft(settings.pomodoroShortBreakMinutes * 60);
      else setTimeLeft(settings.pomodoroLongBreakMinutes * 60);
    }
  }, [mode, settings.pomodoroWorkMinutes, settings.pomodoroShortBreakMinutes, settings.pomodoroLongBreakMinutes, isRunning]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // Log completed session if work mode
      if (mode === 'work') {
        addFocusSession({
          taskId: activeFocusTask?.id,
          durationMinutes: settings.pomodoroWorkMinutes,
          completedAt: toIsoDateString(),
          mode: 'work',
        });
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, activeFocusTask, settings.pomodoroWorkMinutes, addFocusSession]);

  // Synthesizer Web Audio for ambient sound
  useEffect(() => {
    if (ambientSound === 'none') {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate White Noise Buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter depending on selected sound
      const filter = ctx.createBiquadFilter();
      if (ambientSound === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 800;
      } else if (ambientSound === 'binaural') {
        filter.type = 'bandpass';
        filter.frequency.value = 432;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
      }

      const gain = ctx.createGain();
      gain.gain.value = 0.05;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn('Audio Context not allowed without interaction', e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [ambientSound]);

  const totalDuration =
    mode === 'work'
      ? settings.pomodoroWorkMinutes * 60
      : mode === 'shortBreak'
      ? settings.pomodoroShortBreakMinutes * 60
      : settings.pomodoroLongBreakMinutes * 60;

  const progressPct = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') setTimeLeft(settings.pomodoroWorkMinutes * 60);
    else if (mode === 'shortBreak') setTimeLeft(settings.pomodoroShortBreakMinutes * 60);
    else setTimeLeft(settings.pomodoroLongBreakMinutes * 60);
  };

  return (
    <div
      id="plantom-focus-view"
      className={`space-y-6 transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 flex flex-col justify-center items-center bg-neutral-950 p-6 text-white'
          : ''
      }`}
    >
      {/* Header (when not fullscreen) */}
      {!isFullscreen && (
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
                {t.navFocus} (اتاق تمرکز عمیق)
              </h2>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              تکنیک پومودورو با طراحی مینیمال و نویز سفید اختصاصی برای بازدهی حداکثری
            </p>
          </div>

          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
          >
            <Maximize2 className="h-4 w-4" />
            <span>حالت تمام‌صفحه ذن</span>
          </button>
        </div>
      )}

      {/* Main Pomodoro Clock Card */}
      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:p-12">
        {/* Fullscreen Exit Button */}
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 rounded-2xl bg-neutral-800 p-2 text-neutral-400 hover:text-white"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 rounded-2xl bg-neutral-100 p-1.5 dark:bg-neutral-800">
          <button
            onClick={() => {
              setMode('work');
              setIsRunning(false);
            }}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              mode === 'work'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {t.pomodoroWork} ({settings.pomodoroWorkMinutes}m)
          </button>
          <button
            onClick={() => {
              setMode('shortBreak');
              setIsRunning(false);
            }}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {t.pomodoroShortBreak} ({settings.pomodoroShortBreakMinutes}m)
          </button>
          <button
            onClick={() => {
              setMode('longBreak');
              setIsRunning(false);
            }}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              mode === 'longBreak'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {t.pomodoroLongBreak} ({settings.pomodoroLongBreakMinutes}m)
          </button>
        </div>

        {/* Active Task Attached */}
        <div className="mt-8 flex items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
          <CheckSquare className="h-4 w-4 text-indigo-500" />
          <span className="truncate max-w-xs">
            {activeFocusTask ? activeFocusTask.title : 'تمرکز آزاد بدون تسک مشخص'}
          </span>
        </div>

        {/* Big Time Display */}
        <div className="my-10 text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-7xl">
          {formatNum(formattedTime, settings.usePersianNumerals)}
        </div>

        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95"
          >
            {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5 rtl:mr-0.5 rtl:ml-0" />}
          </button>

          <button
            onClick={handleReset}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
            title="شروع مجدد"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Ambient Sound Selector */}
        <div className="mt-8 flex items-center gap-2 pt-6 border-t border-neutral-100 dark:border-neutral-800 w-full justify-center">
          <span className="text-xs font-bold text-neutral-400">موسیقی محیطی:</span>
          {(['none', 'whitenoise', 'rain', 'binaural'] as const).map((snd) => (
            <button
              key={snd}
              onClick={() => setAmbientSound(snd)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                ambientSound === snd
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {snd === 'none' ? 'خاموش' : snd === 'whitenoise' ? 'نویز سفید' : snd === 'rain' ? 'باران' : 'امواج آلفا'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
