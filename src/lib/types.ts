import type { Renderer, Transform } from "ogl";
import type { Writable } from "svelte/store";

export type Size = {
	width: number;
	height: number;
};

export type OGLContext = {
	renderer: Writable<Renderer>;
	userSize: Writable<Size>;
	addScene: (id: unknown, sceneobj: Transform) => void;
};

export type OGLSceneContext = OGLContext & {
	scene: Transform;
};

export type Position =
	| {
			x: number;
			y: number;
			z: number;
	  }
	| number[];

export type Rotation = Position;
