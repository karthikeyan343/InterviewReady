declare module "three/addons/loaders/GLTFLoader.js" {
  import { AnimationClip, Group, Loader, LoadingManager } from "three";

  export interface GLTF {
    scene: Group;
    scenes: Group[];
    animations: AnimationClip[];
    cameras: unknown[];
    asset: Record<string, unknown>;
    parser: unknown;
    userData: Record<string, unknown>;
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);

    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (error: unknown) => void
    ): void;
  }
}
