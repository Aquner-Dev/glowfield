import * as react_jsx_runtime from 'react/jsx-runtime';

type GlowfieldProps = {
    colors?: string[];
    speed?: number;
    intensity?: number;
    waveCount?: number;
    debugMode?: boolean;
    className?: string;
};
declare function AuroraCanvas({ colors, speed, intensity, waveCount, debugMode, className }: GlowfieldProps): react_jsx_runtime.JSX.Element;

export { AuroraCanvas, type GlowfieldProps };
