<script lang="ts">
	import { getContext } from "svelte";
	import { writable } from "svelte/store";

	import { Mesh, type MeshOptions, Program, Geometry } from "ogl";

	import type { OGLSceneContext, Position, Rotation } from "./types";
	import { bind } from "./util";
	import { OGL_SCENE } from "./symbols";
	import type { OGLRenderingContext } from "ogl";

	export let options: Partial<Omit<MeshOptions, "geometry" | "programm">> = {};
	export let geometry: ((gl: OGLRenderingContext) => Geometry) | undefined = undefined;
	export let program: ((gl: OGLRenderingContext) => Program) | undefined = undefined;
	export let notifyParent: boolean | undefined = undefined;

	const { renderer, scene } = getContext<OGLSceneContext>(OGL_SCENE);

	const mesh = new Mesh($renderer.gl, {
		geometry: geometry?.call($renderer.gl, $renderer.gl),
		program: program?.call($renderer.gl, $renderer.gl),
		...options
	});

	mesh.setParent(scene, notifyParent);

	export let position: Position | undefined = undefined;
	export let rotation: Position | undefined = undefined;

	const positionStore = writable<Position | undefined>();
	$: $positionStore = position;

	const rotationStore = writable<Rotation | undefined>();
	$: $rotationStore = rotation;

	bind(positionStore, mesh.position);
	bind(rotationStore, mesh.rotation);
</script>

<slot />
