import React from "react";

type Props = {
  label: string;
  value?: string;
  options: Array<{ value: string; label: string }>;
  onSelect: (e: React.ChangeEvent) => void;
};

export default function Select(props: Props) {
  return (
    <div className="py-2">
      <label>
        {props.label}
        <select
          className="ml-2 rounded-md p-2"
          onChange={props.onSelect}
          value={props.value}
        >
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
