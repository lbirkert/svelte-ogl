import { getContext } from "svelte";
import type { OGLContext } from "../types";

export const useOGL = (): OGLContext => {
	return getContext<OGLContext>("svelte-ogl");
};
