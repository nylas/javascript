import { tv } from "tailwind-variants";

type NylasTw = `ny:${string}`;

export const label = tv({
  base: [
    "ny:text-sm",
    "ny:text-[var(--nylas-calendar-label)]",
    "ny:mb-1",
    "ny:block",
  ],
});

export const button = tv({
  base: [
    "ny:border",
    "ny:text-sm",
    "ny:rounded-lg",
    "ny:px-4",
    "ny:border-[var(--nylas-btn-border)]",
    "ny:text-[var(--nylas-btn-fg)]",
    "ny:bg-[var(--nylas-btn-bg)]",
    "ny:hover:bg-[var(--nylas-btn-bg-hover)]",
    "ny:transition-all",
    "ny:duration-200",
    "ny:transition-colors",
    "ny:h-10",
    "ny:flex",
    "ny:items-center",
    "ny:space-x-1",
    "ny:outline-none",
    "ny:cursor-pointer",
  ] satisfies NylasTw[],
  variants: {
    size: {
      small: ["ny:text-sm", "ny:h-8"] satisfies NylasTw[],
    },
    variant: {
      primary: [
        "ny:bg-[var(--nylas-btn-primary-bg)]",
        "ny:text-[var(--nylas-btn-primary-fg)]",
        "ny:border-[var(--nylas-btn-primary-bg)]",
        "ny:hover:bg-[var(--nylas-btn-primary-bg-hover)]",
        "ny:hover:text-[var(--nylas-btn-primary-fg)]",
        "ny:shadow-[var(--nylas-shadow-primary)]",
        "ny:outline-none",
      ] satisfies NylasTw[],
      link: [
        "ny:bg-transparent",
        "ny:text-[var(--nylas-primary)]",
        "ny:hover:text-[var(--nylas-primary-hover)]",
        "ny:border-none",
        "ny:font-medium",
        "ny:cursor-pointer",
      ] satisfies NylasTw[],
    },
    color: {
      danger: [
        "ny:text-[var(--nylas-danger)]",
        "ny:hover:text-[var(--nylas-danger-hover)]",
      ] satisfies NylasTw[],
    },
    active: {
      true: [
        "ny:bg-[var(--nylas-primary-light)]",
        "ny:border-[var(--nylas-primary)]",
        "ny:text-[var(--nylas-primary)]",
        "ny:hover:bg-[var(--nylas-primary-lighter)]",
        "ny:shadow-[var(--nylas-shadow-primary)]",
      ] satisfies NylasTw[],
    },
    disabled: {
      true: [
        "ny:border-[var(--nylas-btn-border)]",
        "ny:text-[var(--nylas-btn-disabled-fg)]",
        "ny:hover:bg-[var(--nylas-btn-disabled-bg)]",
        "ny:bg-[var(--nylas-btn-disabled-bg)]",
        "ny:shadow-none",
        "ny:cursor-not-allowed",
      ] satisfies NylasTw[],
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      disabled: true,
      class: [
        "ny:bg-[var(--nylas-btn-disabled-bg)]",
        "ny:text-[var(--nylas-btn-disabled-fg)]",
        "ny:cursor-not-allowed",
        "ny:hover:text-[var(--nylas-btn-disabled-fg)]",
        "ny:hover:bg-[var(--nylas-btn-disabled-bg)]",
        "ny:border-[var(--nylas-btn-disabled-bg)]",
      ] satisfies NylasTw[],
    },
    {
      variant: "link",
      disabled: true,
      class: [
        "ny:bg-transparent",
        "ny:hover:bg-transparent",
        "ny:text-[var(--nylas-btn-disabled-fg)]",
        "ny:hover:text-[var(--nylas-btn-disabled-fg)]",
        "ny:hover:bg-none",
        "ny:cursor-not-allowed",
      ] satisfies NylasTw[],
    },
    {
      color: "danger",
      variant: "link",
      class: ["ny:hover:bg-[var(--nylas-error-light)]"],
    },
  ],
});

export const input = tv({
  base: [
    "ny:border",
    "ny:focus:outline-[var(--nylas-input-border-focus)]",
    "ny:block",
    "ny:w-full",
    "ny:rounded-lg",
    "ny:h-8",
    "ny:border-[var(--nylas-input-border)]",
    "ny:bg-[var(--nylas-input-bg)]",
    "ny:px-4",
    "ny:text-[var(--nylas-input-fg)]",
    "ny:py-1",
    "ny:text-sm",
    "ny:placeholder:text-[var(--nylas-input-placeholder)]",
  ] satisfies NylasTw[],
  variants: {
    disabled: {
      true: [
        "ny:bg-[var(--nylas-input-disabled-bg)]",
        "ny:border-[var(--nylas-input-border)]",
        "ny:text-[var(--nylas-input-disabled-fg)]",
        "ny:cursor-not-allowed",
      ] satisfies NylasTw[],
    },
  },
});
