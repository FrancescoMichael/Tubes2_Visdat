import { useState } from 'react'
import View1 from './pages/view1'
import View2 from './pages/view2'
import DropdownsMenu from './components/DropdownsMenu'
import { CATEGORY } from './models/enums'

export default function App() {
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedCategory, setSelectedCategory] = useState<CATEGORY>(CATEGORY.Drivers);
  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  const handleCategoryChange = (category: CATEGORY) => {
    setSelectedCategory(category)
  }

  return (
    <div>
      <DropdownsMenu 
        year={selectedYear}
        category={selectedCategory}
        onYearChange={handleYearChange}
        onCategoryChange={handleCategoryChange}
      />
      {selectedCategory === CATEGORY.Track ? (
        <View2 year={selectedYear} />
      ) : (
        <View1
          year={selectedYear}
          category={selectedCategory}
        />
      )}
    </div>
  )
}
