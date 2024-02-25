import { ChangeEventHandler } from "react";

interface IOption {
  value: string;
  displayValue: string;
}

type Props = {
  label: string;
  options: IOption[] | undefined;
  handleChange: ChangeEventHandler<HTMLSelectElement>;
};

function Select({ label, options, handleChange }: Props) {
  return (
    <div>
      <select
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        defaultValue={""}
      >
        <option value="">{label}</option>
        {options?.map((item: IOption) => {
          return (
            <option key={item.value} value={item.value}>
              {item.displayValue}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Select;
