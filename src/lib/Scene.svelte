<script lang="ts">
	import { getContext, setContext } from "svelte";

	import { Transform } from "ogl";

	import type { OGLSceneContext, OGLContext } from "./types";
	import { OGL_CONTEXT, OGL_SCENE } from "./symbols";

	export let id: unknown = "default";

	const context = getContext<OGLContext>(OGL_CONTEXT);

	let scene = new Transform();

	context.addScene(id, scene);

	setContext<OGLSceneContext>(OGL_SCENE, {
		scene,
		...context
	});
</script>

<slot />
