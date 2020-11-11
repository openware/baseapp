import { compile } from 'path-to-regexp';

export class AppRoute<TParams extends {}> {
    public readonly path: string;

    constructor(path: string) {
        this.path = path;
    }

    public url(): string;
    public url(params: TParams): string;
    public url(params?: any): string {
        if (params) {
            return compile(this.path)(params);
        } else {
            return this.path;
        }
    }
}
