import { tv } from "tailwind-variants";

type NylasTw = `ny:${string}`;

export const label = tv({
  base: ["ny:text-sm", "ny:text-gray-500", "ny:mb-1", "ny:block"],
});

export const button = tv({
  base: [
    "ny:border",
    "ny:text-sm",
    "ny:rounded-lg",
    "ny:px-4",
    "ny:border-gray-200",
    "ny:text-gray-700",
    "ny:hover:bg-gray-50",
    "ny:transition-all",
    "ny:duration-200",
    "ny:transition-colors",
    "ny:h-10",
    "ny:flex",
    "ny:items-center",
    "ny:space-x-1",
    "ny:text-sm",
    "ny:text-gray-700",
    "ny:hover:text-gray-900",
    "ny:hover:bg-gray-100",
    "ny:outline-none",
    "ny:cursor-pointer",
  ] satisfies NylasTw[],
  variants: {
    size: {
      small: ["ny:text-sm", "ny:h-8"] satisfies NylasTw[],
    },
    variant: {
      primary: [
        "ny:bg-primary-500",
        "ny:text-white",
        "ny:border-primary-500",
        "ny:hover:bg-primary-600",
        "ny:hover:text-white",
        "ny:shadow-md",
        "ny:shadow-primary-100",
        "ny:outline-none",
      ] satisfies NylasTw[],
      link: [
        "ny:bg-transparent",
        "ny:text-primary-500",
        "ny:hover:text-primary-600",
        "ny:border-none",
        "ny:font-medium",
        "ny:cursor-pointer",
      ] satisfies NylasTw[],
    },
    color: {
      danger: ["ny:text-red-500", "ny:hover:text-red-600"] satisfies NylasTw[],
    },
    active: {
      true: [
        "ny:bg-primary-50",
        "ny:border-primary-500",
        "ny:text-primary-500",
        "ny:hover:bg-primary-100",
        "ny:shadow-md",
        "ny:shadow-primary-100",
      ] satisfies NylasTw[],
    },
    disabled: {
      true: [
        "ny:border-gray-100",
        "ny:text-gray-400",
        "ny:hover:bg-gray-100",
        "ny:bg-gray-100",
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
        "ny:bg-gray-100",
        "ny:text-gray-400",
        "ny:cursor-not-allowed",
        "ny:hover:text-gray-400",
      ] satisfies NylasTw[],
    },
    {
      variant: "link",
      disabled: true,
      class: [
        "ny:bg-transparent",
        "ny:hover:bg-transparent",
        "ny:text-gray-400",
        "ny:hover:text-gray-400",
        "ny:hover:bg-none",
        "ny:cursor-not-allowed",
      ] satisfies NylasTw[],
    },
    {
      color: "danger",
      variant: "link",
      class: ["ny:hover:bg-red-50"],
    },
  ],
});

export const input = tv({
  base: [
    "ny:border",
    "ny:focus:outline-primary-500",
    "ny:block",
    "ny:w-full",
    "ny:rounded-lg",
    "ny:h-8",
    "ny:border-gray-200",
    "ny:px-4",
    "ny:text-gray-900",
    "ny:py-1",
    "ny:text-sm",
  ] satisfies NylasTw[],
  variants: {
    disabled: {
      true: [
        "ny:bg-gray-100",
        "ny:border-gray-200",
        "ny:text-gray-400",
        "ny:cursor-not-allowed",
      ] satisfies NylasTw[],
    },
  },
});
