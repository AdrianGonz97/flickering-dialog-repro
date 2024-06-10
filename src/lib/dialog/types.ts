import type { Snippet } from "svelte";
import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { DismissableLayerProps } from "../utilities/dismissable-layer/types.js";
import type { PresenceLayerProps } from "../utilities/presence-layer/types.js";
import type { FocusScopeProps } from "../utilities/focus-scope/types.js";
import type { TextSelectionLayerProps } from "../utilities/text-selection-layer/types.js";
import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
} from "$lib/internal/types.js";
import type { PortalProps } from "$lib/utilities/portal/index.js";
import type { EventCallback } from "$lib/internal/events.js";

type DialogRootPropsWithoutHTML = {
	/**
	 * The open state of the dialog.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	children?: Snippet;
};

export type DialogRootProps = DialogRootPropsWithoutHTML;

type DialogContentPropsWithoutHTML = WithAsChild<
	EscapeLayerProps &
		DismissableLayerProps &
		PresenceLayerProps &
		FocusScopeProps &
		TextSelectionLayerProps & {
			preventScroll?: boolean;
		}
>;

export type DialogContentProps = DialogContentPropsWithoutHTML &
	PrimitiveDivAttributes;

type DialogOverlayPropsWithoutHTML = WithAsChild<PresenceLayerProps>;
export type DialogOverlayProps = DialogOverlayPropsWithoutHTML &
	PrimitiveDivAttributes;

type DialogPortalPropsWithoutHTML = PortalProps;
type DialogPortalProps = DialogPortalPropsWithoutHTML;

type DialogTriggerPropsWithoutHTML = WithAsChild<{
	onclick?: EventCallback<MouseEvent>;
}>;

export type DialogTriggerProps = DialogTriggerPropsWithoutHTML &
	PrimitiveButtonAttributes;

type DialogTitlePropsWithoutHTML = WithAsChild<{
	/**
	 * The heading level of the dialog title.
	 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type DialogTitleProps = DialogTitlePropsWithoutHTML &
	PrimitiveDivAttributes;

type DialogClosePropsWithoutHTML = DialogTriggerPropsWithoutHTML;
export type DialogCloseProps = DialogTriggerProps;

type DialogDescriptionPropsWithoutHTML = WithAsChild<{}>;
export type DialogDescriptionProps = DialogDescriptionPropsWithoutHTML &
	PrimitiveDivAttributes;
