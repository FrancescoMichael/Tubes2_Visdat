import DropdownCard from '../components/DropdownCard'
import useFetch from '../hooks/useFetch'
import type { YearsResponse } from '../models/meta'
import { API_YEARS } from '../constant'
import { CATEGORY } from '../models/enums'

interface DropdownsMenuProps {
  year: string
  category: CATEGORY
  onYearChange?: (year: string) => void
  onCategoryChange?: (arg0: CATEGORY) => void
}

export default function DropdownsMenu({ year, category, onYearChange, onCategoryChange }: DropdownsMenuProps) {
  const optionview = Object.values(CATEGORY)

  const { data: years, loading, error } = useFetch<YearsResponse>(`${API_YEARS}`)

  const handleYearChange = (newYear: string) => {
    onYearChange?.(newYear)
  }

  const handleCategoryChange = (newCategory: string) => {
    if (onCategoryChange && Object.values(CATEGORY).includes(newCategory as CATEGORY)) {
      onCategoryChange(newCategory as CATEGORY)
    }
  }

  if (loading) return <p>Loading years...</p>
  if (error) return <p>Error loading years: {error}</p>
  if (!years) return <p>No years available</p>

  return (
    <div className="WRAPPER grid grid-cols-2 gap-4 w-full bg-red-600">
      <div>
        <DropdownCard
          title="Select Year"
          options={years.years.map((year: number) => year.toString())}
          selectedOption={year}
          onChange={handleYearChange}
          headingFontFamily="Formula1Bold"
          dropdownFontFamily="Formula1"
        />
      </div>
      <div>
        <DropdownCard
          title="Select Category"
          options={optionview}
          selectedOption={category}
          onChange={handleCategoryChange}
          headingFontFamily="Formula1Bold"
          dropdownFontFamily="Formula1"
        />
      </div>
    </div>
  )
}
