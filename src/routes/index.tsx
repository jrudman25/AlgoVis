/**
 * index.tsx
 * Home route — the sorting algorithm visualizer.
 */
import { useState, useEffect, useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Slider } from '@heroui/react';
import Visualizer from '../components/Visualizer';
import BubbleSort from '../algorithms/BubbleSort';
import MergeSort from '../algorithms/MergeSort';

type Algorithm = 'BubbleSort' | 'MergeSort' | null;

const generateRandomArray = (length: number, min: number, max: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

function HomePage() {
    const [array, setArray] = useState<number[]>([]);
    const [oldArray, setOldArray] = useState<number[]>([]);
    const [algorithm, setAlgorithm] = useState<Algorithm>(null);
    const [sorting, setSorting] = useState(false);
    const [highlighted, setHighlighted] = useState<number[]>([]);
    const [arraySize, setArraySize] = useState(20);
    const [speed, setSpeed] = useState(150);

    const generateArray = useCallback(() => {
        const newArray = generateRandomArray(arraySize, 10, 100);
        setArray(newArray);
        setOldArray([...newArray]);
        setHighlighted([]);
    }, [arraySize]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    const resetArray = () => {
        setArray([...oldArray]);
        setHighlighted([]);
    };

    const startSorting = async () => {
        if (!algorithm) { return; }

        setSorting(true);

        const steps = algorithm === 'BubbleSort'
            ? BubbleSort([...array])
            : MergeSort([...array]);

        for (const step of steps) {
            if (step.type === 'compare') {
                setHighlighted(step.indices);
            } else if (step.type === 'swap' && step.newArray) {
                setArray(step.newArray);
                setHighlighted(step.indices);
            }

            await new Promise(res => setTimeout(res, speed));
        }

        setHighlighted([]);
        setSorting(false);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Controls Card */}
            <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <Card.Header>
                    <Card.Title className="text-2xl font-bold text-white">
                        {algorithm
                            ? `Algorithm: ${algorithm === 'BubbleSort' ? 'Bubble Sort' : 'Merge Sort'}`
                            : 'Select a Sorting Algorithm'}
                    </Card.Title>
                </Card.Header>
                <Card.Content className="flex flex-col gap-4">
                    {/* Algorithm Selection */}
                    <div className="flex gap-2">
                        <Button
                            variant={algorithm === 'BubbleSort' ? 'primary' : 'outline'}
                            isDisabled={sorting}
                            onPress={() => setAlgorithm('BubbleSort')}
                        >
                            Bubble Sort
                        </Button>
                        <Button
                            variant={algorithm === 'MergeSort' ? 'primary' : 'outline'}
                            isDisabled={sorting}
                            onPress={() => setAlgorithm('MergeSort')}
                        >
                            Merge Sort
                        </Button>
                    </div>

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
                                Speed: {speed}ms
                            </label>
                            <Slider
                                minValue={10}
                                maxValue={500}
                                step={10}
                                value={speed}
                                onChange={(val) => {
                                    if (typeof val === 'number') {
                                        setSpeed(val);
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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            isDisabled={sorting || !algorithm}
                            onPress={startSorting}
                        >
                            ▶ Run
                        </Button>
                        <Button
                            variant="secondary"
                            isDisabled={sorting}
                            onPress={resetArray}
                        >
                            ↺ Reset
                        </Button>
                        <Button
                            variant="outline"
                            isDisabled={sorting}
                            onPress={generateArray}
                        >
                            ✦ New Array
                        </Button>
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
