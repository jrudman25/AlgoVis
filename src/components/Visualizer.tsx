/**
 * Visualizer.tsx
 * Renders the bar chart visualization of the sorting array.
 */
import { Card } from '@heroui/react';

interface VisualizerProps {
    array: number[];
    highlighted: number[];
}

const Visualizer = ({ array, highlighted }: VisualizerProps) => {
    const maxValue = Math.max(...array, 1);

    return (
        <Card className="w-full bg-slate-800/50 border border-slate-700/50">
            <Card.Content>
                <div
                    className="flex items-end justify-center gap-1"
                    style={{ height: '400px' }}
                >
                    {array.map((value, index) => {
                        const isHighlighted = highlighted.includes(index);
                        const heightPercent = (value / maxValue) * 100;

                        return (
                            <div
                                key={index}
                                className="rounded-t-sm transition-all duration-200 ease-in-out"
                                style={{
                                    height: `${heightPercent}%`,
                                    width: `${Math.max(100 / array.length - 1, 8)}px`,
                                    backgroundColor: isHighlighted
                                        ? 'hsl(0, 85%, 60%)'
                                        : 'hsl(217, 60%, 55%)',
                                    boxShadow: isHighlighted
                                        ? '0 0 12px hsl(0, 85%, 60% / 0.5)'
                                        : 'none',
                                }}
                            />
                        );
                    })}
                </div>
            </Card.Content>
        </Card>
    );
};

export default Visualizer;
