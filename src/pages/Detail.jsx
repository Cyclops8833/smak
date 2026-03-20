import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import foods from '../data/foods.json'
import FoodDetail from '../components/FoodDetail'

export default function Detail() {
  const { id } = useParams()
  const food = foods.find(f => f.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!food) {
    return (
      <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center gap-4 px-4">
        <p className="font-heading text-2xl text-text-secondary">Food not found</p>
        <Link
          to="/"
          className="font-body text-sm text-moss hover:text-moss-dark transition-colors duration-150"
        >
          ← Back to all foods
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-base page-enter">
      <FoodDetail food={food} />
    </div>
  )
}
