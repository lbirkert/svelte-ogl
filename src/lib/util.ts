import type { Position, Rotation } from "./types";
import type { Euler, Vec3 } from "ogl";
import type { Writable } from "svelte/store";

export function bind(store: Writable<Position | Rotation | undefined>, vec: Vec3 | Euler) {
	store.subscribe((v) => {
		if (v) {
			if (v instanceof Array) {
				vec.x = v[0];
				vec.y = v[1];
				vec.z = v[2];
			} else {
				vec.x = v.x;
				vec.y = v.y;
				vec.z = v.z;
			}
		}
	});
}
