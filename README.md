# svelte-ogl

A port of [OGL](https://github.com/oframe/ogl/) to Svelte. Fully typed.

```
npm i -D svelte-ogl
```

## Example

```html
<script lang="ts">
	import { Canvas, Camera, Mesh, Scene } from "svelte-ogl";
	import { Program, Plane } from "ogl";

	const uniforms = {
		time: { value: 0 },
	};
</script>

<Canvas
	on:render={(e) => uniforms.time.value = e.detail.time / 1000}
>
	<Camera />

	<Scene>
		<Mesh
			program={(gl) => new Program(gl, {
				vertex: /* glsl */ `
                		attribute vec2 uv;
                		attribute vec2 position;
                		varying vec2 vUv;

                		void main() {
               				vUv = uv;
               				gl_Position = vec4(position, 0, 1);
                		}
                		`,
                		fragment: /* glsl */ `
                		precision highp float;
                		uniform float time;

                		void main() {
                    			gl_FragColor = vec4(vUv * sin(time), 1, 1);
                		}
                		`,
				uniforms
			})}
			geometry={(gl) =>
				new Plane(gl, {
				width: 2,
				height: 2
			})}
		/>
	</Scene>
</Canvas>
```

## Report Bug

Please refer to the [issues](https://github.com/KotwOSS/svelte-ogl/issues) page!

## Feature Request

Please refer to the [issues](https://github.com/KotwOSS/svelte-ogl/issues) page!
