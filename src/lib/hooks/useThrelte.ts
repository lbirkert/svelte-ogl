import { getContext } from "svelte";
import type { OGLContext } from "../types";

export const useThrelte = (): OGLContext => {
	return getContext<OGLContext>("svelte-ogl");
};
