import * as monolite from 'monolite';

export class MonoliteHelper<T> {
    private state: T;

    constructor(state: T) {
        this.state = state;
    }

    public set = <U>(accessor: (sourceState: T) => U, value: U): MonoliteHelper<T> => {
        this.state = monolite.set(this.state, accessor)(value);
        return this;
    };

    public get = (): T => {
        return this.state;
    };
}

export function monoliteUtil<TState>(state: TState, accessor: (sourceState: MonoliteHelper<TState>) => void): TState {
    const helper = new MonoliteHelper<TState>(state);
    accessor(helper);
    const result = helper.get();
    return result;
}
