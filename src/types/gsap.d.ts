// src/types/gsap.d.ts
import { DraggableStatic } from 'gsap/Draggable';

declare module 'gsap' {
    export function registerPlugin(...plugins: DraggableStatic[]): void;
}
