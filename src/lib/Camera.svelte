<script lang="ts">
	import { Camera } from "ogl";
	import { getContext } from "svelte";
	import { bind } from "./util";
	import { writable } from "svelte/store";
	import type { OGLContext, Position, Rotation } from "./types";
	import { OGL_CONTEXT } from "./symbols";

	const { renderer, userSize } = getContext<OGLContext>(OGL_CONTEXT);

	let camera = new Camera($renderer.gl);

	$: if ($userSize)
		camera.perspective({
			aspect: $renderer.gl.canvas.width / $renderer.gl.canvas.height
		});

	export let position: Position | undefined = undefined;
	export let rotation: Position | undefined = undefined;

	const positionStore = writable<Position | undefined>();
	$: $positionStore = position;

	const rotationStore = writable<Rotation | undefined>();
	$: $rotationStore = rotation;

	bind(positionStore, camera.position);
	bind(rotationStore, camera.rotation);
</script>
