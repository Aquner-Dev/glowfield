import * as react_jsx_runtime from 'react/jsx-runtime';
import * as THREE from 'three';

type LutInput = string[] | number[] | Uint8Array | Float32Array | THREE.DataTexture;
type GlowfieldProps = {
    lut?: LutInput;
    /** @deprecated colors は LUT が未指定の場合のフォールバックとして扱われます。 */
    colors?: string[];
    speed?: number;
    intensity?: number;
    pointerStrength?: number;
    className?: string;
};
declare function AuroraCanvas({ lut, colors, speed, intensity, pointerStrength, className, }: GlowfieldProps): react_jsx_runtime.JSX.Element;

export { AuroraCanvas, type GlowfieldProps };
