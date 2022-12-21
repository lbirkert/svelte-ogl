<script lang="ts">
	import { writable } from "svelte/store";

	import { createEventDispatcher, onMount, setContext } from "svelte";
	import { browser } from "$app/environment";

	import { Renderer, type RendererOptions } from "ogl";

	import type { OGLContext, Size } from "./types";
	import { useParentSize } from "./hooks/useParentSize";
	import { OGL_CONTEXT } from "./symbols";
	import type { Transform } from "ogl";

	export let dpr: typeof devicePixelRatio = browser ? window.devicePixelRatio : 1;
	export let size: Size | undefined = undefined;
	export let rendererParameters: Partial<Omit<RendererOptions, "size" | "dpr">> = {};

	export let scene: unknown = "default";

	type RenderEvent = {
		frame: number;
		time: number;
		renderer: Renderer;
		size: Size;
	};

	const dispatch = createEventDispatcher<{ render: RenderEvent }>();

	const { parentSize, parentSizeAction } = useParentSize();

	const userSize = writable<Size>();
	$: {
		$userSize = size || $parentSize;
		$renderer?.setSize($userSize.width, $userSize.height);
	}

	let canvas: HTMLCanvasElement | undefined;

	let renderer = writable<Renderer>();

	let initialized = false;

	const scenes = new Map<unknown, Transform>();
	function addScene(id: unknown, sceneobj: Transform) {
		scenes.set(id, sceneobj);
	}

	setContext<OGLContext>(OGL_CONTEXT, {
		renderer,
		userSize,
		addScene
	});

	onMount(() => {
		if (!canvas) return;

		$renderer = new Renderer({
			canvas,
			dpr,
			...size,
			...rendererParameters
		});

		initialized = true;

		requestAnimationFrame(render);
	});

	let frame = 0;
	function render() {
		dispatch("render", { frame, time: performance.now(), size: $userSize, renderer: $renderer });

		if (scenes.has(scene)) {
			$renderer.render({ scene: scenes.get(scene) });
		} else console.warn(`Scene '${scene}' is not defined!`);

		frame++;

		requestAnimationFrame(render);
	}
</script>

<canvas use:parentSizeAction bind:this={canvas}>
	{#if initialized}
		<slot />
	{/if}
</canvas>

<style>
	canvas {
		display: block;
	}
</style>
