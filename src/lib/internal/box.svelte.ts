import type { ReadableBox, WritableBox } from "svelte-toolbelt";
import { untrack } from "svelte";

export type Box<T> = ReadableBox<T> | WritableBox<T>;

export type WritableBoxedValues<T> = {
	[K in keyof T]: WritableBox<T[K]>;
};

export type ReadableBoxedValues<T> = {
	[K in keyof T]: ReadableBox<T[K]>;
};

type WatcherCallback<T> = (
	curr: T,
	prev: T
) => void | Promise<void> | (() => void) | (() => Promise<void>);

type WatchOptions = {
	/**
	 * Whether to eagerly run the watcher before the state is updated.
	 */
	immediate?: boolean;

	/**
	 * Whether to run the watcher only once.
	 */
	once?: boolean;
};

export function watch<T>(box: Box<T>, callback: WatcherCallback<T>, options: WatchOptions = {}) {
	let prev = $state(box.value);
	let ranOnce = false;

	const watchEffect = $effect.root(() => {
		$effect.pre(() => {
			if (prev === box.value || !options.immediate) return;
			if (options.once && ranOnce) return;
			callback(
				box.value,
				untrack(() => prev)
			);
			untrack(() => (prev = box.value));
			ranOnce = true;
		});

		$effect(() => {
			if (prev === box.value || options.immediate) return;
			if (options.once && ranOnce) return;

			callback(
				box.value,
				untrack(() => prev)
			);
			untrack(() => (prev = box.value));
			ranOnce = true;
		});
	});
	return watchEffect;
}
