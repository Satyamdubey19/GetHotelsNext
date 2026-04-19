import React, { ReactNode } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export default function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        {...props}
        className="w-5 h-5 accent-sky-600 cursor-pointer rounded border-slate-300"
      />
      {label && (
        <label htmlFor={id} className="text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition">
          {label}
        </label>
      )}
    </div>
  );
}
