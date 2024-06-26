<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogContent } from "../dialog.svelte.js";
	import type { ContentProps } from "../index.js";
	import DismissableLayer from "$lib/utilities/dismissable-layer/dismissable-layer.svelte";
	import EscapeLayer from "$lib/utilities/escape-layer/escape-layer.svelte";
	import FocusScope from "$lib/utilities/focus-scope/focus-scope.svelte";
	import PresenceLayer from "$lib/utilities/presence-layer/presence-layer.svelte";
	import TextSelectionLayer from "$lib/utilities/text-selection-layer/text-selection-layer.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import ScrollLock from "$lib/utilities/scroll-lock/scroll-lock.svelte";

	let {
		id = useId(),
		asChild,
		children,
		child,
		el = $bindable(),
		forceMount = false,
		onDestroyAutoFocus = noop,
		onEscapeKeydown = noop,
		onInteractOutside = noop,
		...restProps
	}: ContentProps = $props();

	const state = useDialogContent({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

<PresenceLayer {...mergedProps} present={state.root.open.value || forceMount}>
	{#snippet presence({ present })}
		<ScrollLock {...mergedProps} />
		<FocusScope
			loop
			trapped={present.value}
			{...mergedProps}
			onDestroyAutoFocus={(e) => {
				onDestroyAutoFocus(e);
				if (e.defaultPrevented) return;
				state.root.triggerNode?.value?.focus();
			}}
		>
			{#snippet focusScope({ props: focusScopeProps })}
				<EscapeLayer
					{...mergedProps}
					enabled={present.value}
					onEscapeKeydown={(e) => {
						onEscapeKeydown(e);
						state.root.closeDialog();
					}}
				>
					<DismissableLayer
						{...mergedProps}
						enabled={present.value}
						onInteractOutside={(e) => {
							onInteractOutside(e);
							if (e.defaultPrevented) return;
							state.root.closeDialog();
						}}
					>
						<TextSelectionLayer {...mergedProps} enabled={present.value}>
							{#if asChild}
								{@render child?.({
									props: mergeProps(mergedProps, focusScopeProps, {
										hidden: !present.value,
									}),
								})}
							{:else}
								<div
									{...mergeProps(mergedProps, focusScopeProps, {
										hidden: !present.value,
										style: {
											pointerEvents: "auto",
										},
									})}
									bind:this={el}
								>
									{@render children?.()}
								</div>
							{/if}
						</TextSelectionLayer>
					</DismissableLayer>
				</EscapeLayer>
			{/snippet}
		</FocusScope>
	{/snippet}
</PresenceLayer>
