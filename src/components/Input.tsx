import { ComponentProps, Fragment, FunctionalComponent } from "preact"

interface InputProps extends ComponentProps<"input"> {
    label: string;
}

export const Input: FunctionalComponent<InputProps> = ({ label, ...props }) => {
    return (
        <Fragment>
            <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.id}>{label}</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...props} />
        </Fragment>
  )
}