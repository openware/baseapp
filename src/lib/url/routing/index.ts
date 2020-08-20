import { compile } from 'path-to-regexp';

export class AppRoute<TParams = any> {
    public readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    public url(params?: TParams): string {
        return compile(this.path)(params);
    }
}
