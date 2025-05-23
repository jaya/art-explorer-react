import { render, screen, fireEvent } from '@testing-library/react'
import SelectDepartment from './index'
import { vi } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'

describe('SelectDepartment', () => {
  const options = [
    { id: 1, name: 'Paintings' },
    { id: 2, name: 'Sculpture' },
  ]

  it('render options', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SelectDepartment options={options} value={null} onChange={() => {}} />
      </I18nextProvider>
    )
    expect(screen.getByRole('option', { name: /paintings/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /sculpture/i })).toBeInTheDocument()
  })

  it('calls onChange with selected value', () => {
    const onChangeMock = vi.fn()

    render(
      <I18nextProvider i18n={i18n}>
        <SelectDepartment options={options} value={null} onChange={onChangeMock} />
      </I18nextProvider>
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '2' } })

    expect(onChangeMock).toHaveBeenCalledWith(2)
  })

  it('calls onChange(null) when clear button is clicked', () => {
    const onChangeMock = vi.fn()

    render(
      <I18nextProvider i18n={i18n}>
        <SelectDepartment options={options} value={1} onChange={onChangeMock} />
      </I18nextProvider>
    )

    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)

    expect(onChangeMock).toHaveBeenCalledWith(null)
  })
})
