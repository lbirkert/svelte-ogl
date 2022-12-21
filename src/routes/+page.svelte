<script lang="ts">
	import { Canvas, Camera, Mesh, Scene } from "$lib";
	import { Program, Plane } from "ogl";

	const uniforms = {
		time: { value: 0 },
		frame: { value: 0 }
	};
</script>

<main>
	<header>
		<h1>SvelteOGL</h1>
		<p>
			This is a port of <a href="https://github.com/oframe/ogl/">ogl</a>
			to svelte. Written and maintained by KotwOSS.
			<a href="https://github.com/KotwOSS/svelte-ogl">Github</a>
		</p>
	</header>

	<div id="canvas">
		<Canvas
			on:render={(e) => {
				uniforms.time.value = e.detail.time / 1000;
				uniforms.frame.value = e.detail.frame;
				console.log(e.detail.size);
			}}
		>
			<Camera />

			<Scene>
				<Mesh
					program={(gl) =>
						new Program(gl, {
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

                            uniform float     time;                 // shader playback time (in seconds)
                            uniform int       frame;                // shader playback frame
                            
                            varying vec2 vUv;
                            
                            float map(vec3 p)
                            {
                                p.xy += sin(p.x*0.1+time*0.8+p.z*1.2)*0.3;
                                p.x += sin(time+p.y*.15)*0.2;
                                vec3 tp = mod(p, 2.0) - 1.0;
                                float t = length(tp.xz) - 0.26;
                                p.y = abs(p.y*(sin(time*0.4+p.z*0.25)*0.25+1.55));
                                t = min(t, 2.0 - dot(p, vec3(sin(p.z+time*0.2)*0.2, 1, 0)));	// tilt
                                return t;
                            }

                            float trace(vec3 p, vec3 d)
                            {
                                float t = 0.0;
                                for(int i = 0 ; i < 22; i++)
                                t += map(p + d * t);
                                return t;
                            }

                            void main() {
                                float tt = step(mod(time+4.0,10.0),3.0);
                                vec3 dir = normalize(vec3(vUv, 1.0));
                                vec3 pos = vec3(0, 0, time*(0.8+tt*4.0));
                                float t = trace(pos, dir);
                                vec3 col = vec3(t*0.1,t*0.07,t*0.07);
                                col -= abs(sin(time+t*2.0)*0.05);
                                if (tt>0.0)
                                    col = 0.7-col;
                                vec2 q = vUv;
                                float v = 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.25 );
                                gl_FragColor = vec4(col*v, 1.0);
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
	</div>
</main>

<style>
	main {
		height: 100vh;
		width: 100vw;
		overflow-y: scroll;
		background-color: black;
	}

	header h1 {
		color: white;
		margin-bottom: 5px;
	}

	header {
		padding: 20px;
		background-color: #111;
		color: #999;
		font-family: sans-serif;
	}

	header a {
		color: white;
		text-decoration: none;
	}

	header a:hover {
		color: #aaa;
	}

	#canvas {
		width: 100vw;
		height: 100vh;
	}
</style>
