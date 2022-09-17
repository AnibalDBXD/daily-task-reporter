import type { FunctionalComponent, ComponentProps } from "preact";

export const Button: FunctionalComponent<ComponentProps<"button">> = ({ className, ...props }) => {
    return (
        <button {...props} class={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`} />
    )
}