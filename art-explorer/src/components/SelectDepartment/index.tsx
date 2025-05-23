import { t } from 'i18next'
import { X } from 'lucide-react'

interface Props {
  options: { id: number; name: string }[]
  value: number | null
  onChange: (id: number | null) => void
}

export default function SelectDepartment({ options, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label className="text-xs text-slate-600 dark:text-slate-300 font-bold">
        {t('home.department')}
      </label>

      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? null : Number(e.target.value))
          }
          className="appearance-none bg-neutral-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 
                    text-slate-700 dark:text-slate-200 text-sm rounded-full px-4 py-2 pr-10 focus:outline-none 
                    focus:ring-2 focus:ring-teal-500 transition w-full"
        >
          <option value="">{t('home.selectDepartment')}</option>
          {options.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        {value !== null && (
          <button
            onClick={() => onChange(null)}
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-300" />
          </button>
        )}
      </div>
    </div>
  )
}
