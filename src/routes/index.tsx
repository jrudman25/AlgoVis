/**
 * index.tsx
 * Home route — the sorting algorithm visualizer.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Slider } from '@heroui/react';
import Visualizer from '../components/Visualizer';
import BubbleSort from '../algorithms/BubbleSort';
import InsertionSort from '../algorithms/InsertionSort';
import MergeSort from '../algorithms/MergeSort';
import QuickSort from '../algorithms/QuickSort';
import SelectionSort from '../algorithms/SelectionSort';

type Algorithm = 'BubbleSort' | 'InsertionSort' | 'MergeSort' | 'QuickSort' | 'SelectionSort' | null;
type AlgorithmKey = Exclude<Algorithm, null>;

const MIN_SPEED_LEVEL = 1;
const MAX_SPEED_LEVEL = 20;
const MIN_STEP_DELAY_MS = 10;
const MAX_STEP_DELAY_MS = 500;
const MIN_VOLUME_LEVEL = 0;
const MAX_VOLUME_LEVEL = 100;
const MIN_TONE_FREQUENCY = 160;
const MAX_TONE_FREQUENCY = 960;

const ALGORITHM_DETAILS: Record<AlgorithmKey, {
    name: string;
    best: string;
    average: string;
    worst: string;
    space: string;
}> = {
    BubbleSort: {
        name: 'Bubble Sort',
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
        space: 'O(1)',
    },
    InsertionSort: {
        name: 'Insertion Sort',
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
        space: 'O(1)',
    },
    MergeSort: {
        name: 'Merge Sort',
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)',
        space: 'O(n)',
    },
    QuickSort: {
        name: 'Quick Sort',
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)',
        space: 'O(log n)',
    },
    SelectionSort: {
        name: 'Selection Sort',
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)',
        space: 'O(1)',
    },
};

const generateRandomArray = (length: number, min: number, max: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

const getStepDelay = (speedLevel: number) => {
    const speedPercent = (speedLevel - MIN_SPEED_LEVEL) / (MAX_SPEED_LEVEL - MIN_SPEED_LEVEL);
    return Math.round(MAX_STEP_DELAY_MS - speedPercent * (MAX_STEP_DELAY_MS - MIN_STEP_DELAY_MS));
};

const getToneFrequency = (value: number, maxValue: number) => {
    const valuePercent = Math.max(0, Math.min(value / Math.max(maxValue, 1), 1));
    return MIN_TONE_FREQUENCY + valuePercent * (MAX_TONE_FREQUENCY - MIN_TONE_FREQUENCY);
};

const getSortSteps = (algorithm: AlgorithmKey, array: number[]) => {
    switch (algorithm) {
        case 'BubbleSort':
            return BubbleSort(array);
        case 'InsertionSort':
            return InsertionSort(array);
        case 'MergeSort':
            return MergeSort(array);
        case 'QuickSort':
            return QuickSort(array);
        case 'SelectionSort':
            return SelectionSort(array);
    }
};

function HomePage() {
    const [array, setArray] = useState<number[]>([]);
    const [oldArray, setOldArray] = useState<number[]>([]);
    const [algorithm, setAlgorithm] = useState<Algorithm>(null);
    const [sorting, setSorting] = useState(false);
    const [highlighted, setHighlighted] = useState<number[]>([]);
    const [arraySize, setArraySize] = useState(20);
    const [speedLevel, setSpeedLevel] = useState(14);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [volumeLevel, setVolumeLevel] = useState(60);
    const stopRef = useRef(false);
    const audioContextRef = useRef<AudioContext | null>(null);

    const ensureAudioContext = async () => {
        if (typeof window === 'undefined') {
            return null;
        }

        const audioWindow = window as Window & typeof globalThis & {
            webkitAudioContext?: typeof AudioContext;
        };
        const AudioContextConstructor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

        if (!AudioContextConstructor) {
            return null;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContextConstructor();
        }

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        return audioContextRef.current;
    };

    const playSortTone = (context: AudioContext, values: number[], stepType: 'compare' | 'swap') => {
        const volumePercent = Math.max(0, Math.min(volumeLevel / MAX_VOLUME_LEVEL, 1));

        if (volumePercent <= 0) {
            return;
        }

        const averageValue = values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1);
        const maxValue = Math.max(...array, 1);
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;
        const duration = stepType === 'swap' ? 0.08 : 0.045;
        const peakGain = (stepType === 'swap' ? 0.08 : 0.045) * volumePercent;

        oscillator.type = stepType === 'swap' ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(getToneFrequency(averageValue, maxValue), now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + duration);
        oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
        };
    };

    const generateArray = useCallback(() => {
        const newArray = generateRandomArray(arraySize, 10, 100);
        setArray(newArray);
        setOldArray([...newArray]);
        setHighlighted([]);
    }, [arraySize]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    useEffect(() => {
        return () => {
            void audioContextRef.current?.close();
        };
    }, []);

    const resetArray = () => {
        setArray([...oldArray]);
        setHighlighted([]);
    };

    const startSorting = async () => {
        if (!algorithm) { return; }

        setSorting(true);
        stopRef.current = false;

        const audioContext = soundEnabled ? await ensureAudioContext() : null;
        const stepDelay = getStepDelay(speedLevel);
        const steps = getSortSteps(algorithm, [...array]);
        let currentArray = [...array];

        for (const step of steps) {
            if (stopRef.current) {
                break;
            }

            if (step.type === 'compare') {
                setHighlighted(step.indices);
            } else if (step.type === 'swap' && step.newArray) {
                currentArray = step.newArray;
                setArray(step.newArray);
                setHighlighted(step.indices);
            }

            if (audioContext) {
                playSortTone(
                    audioContext,
                    step.indices.map(index => currentArray[index] ?? 0),
                    step.type
                );
            }

            await new Promise(res => setTimeout(res, stepDelay));
        }

        setHighlighted([]);
        setSorting(false);
    };

    const selectedAlgorithmDetails = algorithm ? ALGORITHM_DETAILS[algorithm] : null;

    return (
        <div className="flex flex-col gap-6">
            {/* Controls Card */}
            <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <Card.Header>
                    <Card.Title className="text-2xl font-bold text-white">
                        {selectedAlgorithmDetails
                            ? `Algorithm: ${selectedAlgorithmDetails.name}`
                            : 'Select a Sorting Algorithm'}
                    </Card.Title>
                </Card.Header>
                <Card.Content className="flex flex-col gap-4">
                    <div className="max-w-sm">
                        <label className="text-sm text-slate-300 mb-1 block">
                            Algorithm
                        </label>
                        <select
                            className="w-full rounded-lg border border-slate-700/70 bg-slate-900 px-3 py-2 text-white outline-none transition-colors focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                            value={algorithm ?? ''}
                            disabled={sorting}
                            onChange={(event) => {
                                setAlgorithm(event.target.value === '' ? null : event.target.value as AlgorithmKey);
                            }}
                        >
                            <option value="">Choose an algorithm</option>
                            {Object.entries(ALGORITHM_DETAILS).map(([key, details]) => (
                                <option key={key} value={key}>
                                    {details.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedAlgorithmDetails && (
                        <div className="grid gap-3 rounded-lg border border-slate-700/50 bg-slate-900/40 p-4 sm:grid-cols-4">
                            <div>
                                <div className="text-xs uppercase tracking-wide text-slate-500">Best</div>
                                <div className="font-semibold text-emerald-300">{selectedAlgorithmDetails.best}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wide text-slate-500">Average</div>
                                <div className="font-semibold text-sky-300">{selectedAlgorithmDetails.average}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wide text-slate-500">Worst</div>
                                <div className="font-semibold text-rose-300">{selectedAlgorithmDetails.worst}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wide text-slate-500">Space</div>
                                <div className="font-semibold text-violet-300">{selectedAlgorithmDetails.space}</div>
                            </div>
                        </div>
                    )}

                    {/* Sliders */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-slate-300 mb-1 block">
                                Array Size: {arraySize}
                            </label>
                            <Slider
                                minValue={10}
                                maxValue={100}
                                step={5}
                                value={arraySize}
                                onChange={(val) => {
                                    if (typeof val === 'number') {
                                        setArraySize(val);
                                    }
                                }}
                                isDisabled={sorting}
                            >
                                <Slider.Track>
                                    <Slider.Fill />
                                    <Slider.Thumb />
                                </Slider.Track>
                            </Slider>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-slate-300 mb-1 block">
                                Speed: {speedLevel}/20
                            </label>
                            <Slider
                                minValue={MIN_SPEED_LEVEL}
                                maxValue={MAX_SPEED_LEVEL}
                                step={1}
                                value={speedLevel}
                                onChange={(val) => {
                                    if (typeof val === 'number') {
                                        setSpeedLevel(val);
                                    }
                                }}
                                isDisabled={sorting}
                            >
                                <Slider.Track>
                                    <Slider.Fill />
                                    <Slider.Thumb />
                                </Slider.Track>
                            </Slider>
                            <div className="mt-1 flex justify-between text-xs text-slate-500">
                                <span>Slow</span>
                                <span>Fast</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-start gap-2">
                        <Button
                            variant="primary"
                            isDisabled={sorting || !algorithm}
                            onPress={startSorting}
                        >
                            ▶ Run
                        </Button>
                        <Button
                            variant="danger"
                            isDisabled={!sorting}
                            onPress={() => { stopRef.current = true; }}
                        >
                            ■ Stop
                        </Button>
                        <Button
                            variant="secondary"
                            className="text-black"
                            isDisabled={sorting}
                            onPress={resetArray}
                        >
                            ↺ Reset
                        </Button>
                        <Button
                            variant="outline"
                            className="text-white"
                            isDisabled={sorting}
                            onPress={generateArray}
                        >
                            ✦ New Array
                        </Button>
                        <div className="flex w-full flex-col gap-2 sm:w-44">
                            <Button
                                variant={soundEnabled ? 'primary' : 'outline'}
                                className="text-white"
                                isDisabled={sorting}
                                onPress={() => setSoundEnabled(enabled => !enabled)}
                            >
                                Sound: {soundEnabled ? 'On' : 'Off'}
                            </Button>
                            {soundEnabled && (
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">
                                        Volume: {volumeLevel}%
                                    </label>
                                    <Slider
                                        minValue={MIN_VOLUME_LEVEL}
                                        maxValue={MAX_VOLUME_LEVEL}
                                        step={5}
                                        value={volumeLevel}
                                        onChange={(val) => {
                                            if (typeof val === 'number') {
                                                setVolumeLevel(val);
                                            }
                                        }}
                                        isDisabled={sorting}
                                    >
                                        <Slider.Track className="h-1">
                                            <Slider.Fill className="h-1" />
                                            <Slider.Thumb className="h-3 w-3" />
                                        </Slider.Track>
                                    </Slider>
                                </div>
                            )}
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Visualizer */}
            <Visualizer array={array} highlighted={highlighted} />
        </div>
    );
}

export const Route = createFileRoute('/')({
    component: HomePage,
});
