import { SearchIcon } from 'lucide-react'
import { motion, useAnimationControls } from 'motion/react'

import { cn } from '~/shared/utils/className'

interface SearchButtonProps {
  isActive: boolean
  onClick: () => void
}

export function SearchButton({ isActive, onClick }: SearchButtonProps) {
  const controls = useAnimationControls()

  const handleClick = async () => {
    onClick()
    await controls.start({
      scale: [0.8, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1],
        type: 'spring',
        stiffness: 500,
        damping: 15,
      },
    })
  }

  return (
    <motion.button
      className={cn(
        'cursor-pointer rounded-full bg-transparent p-2 transition-colors duration-300 hover:bg-white [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[2]',
        isActive && 'bg-white',
      )}
      onClick={handleClick}
      type="button">
      <motion.div
        animate={controls}
        className="text-primary-foreground">
        <SearchIcon />
      </motion.div>
    </motion.button>
  )
}
