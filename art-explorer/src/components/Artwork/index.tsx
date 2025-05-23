import { useState } from 'react'
import { DialogPanel, DialogTitle, Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetObjectDetail } from '../../services/metApi/queries'
import ArtworkSkeleton from './Skeleton'
import { t } from 'i18next'
import FavoriteButton from './FavoriteButton'
import { X } from 'lucide-react'

interface Props {
  id: number
}

export default function Artwork({ id }: Props) {
  const { data, isLoading } = useGetObjectDetail(id)
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) return <ArtworkSkeleton />
  if (!data) return null

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex gap-4 w-full border border-slate-200 dark:border-slate-700 p-4 rounded-lg transition hover:shadow-md dark:hover:shadow-slate-700/40 cursor-pointer"
        data-testid="artwork-card"
      >
        <img
          src={data.primaryImageSmall?.trim() ? data.primaryImageSmall : '/not-found.png'}
          alt={data.objectName}
          className="w-20 min-w-20 h-20 object-cover rounded bg-slate-100 dark:bg-slate-800"
        />

        <div className="flex flex-col justify-between text-sm w-full">
          <div className='flex items-start gap-2 justify-between'>
            <p className="text-neutral-900 dark:text-neutral-100 font-medium">{data.title}</p>
            <FavoriteButton id={id} />
          </div>
          <p className="text-slate-500 dark:text-slate-400">{data.artistDisplayName || data.culture}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs">{data.department}</p>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <motion.div
              className="fixed inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogPanel className="relative bg-white dark:bg-slate-900 max-w-xl w-full rounded p-6 overflow-y-auto max-h-[90vh] shadow-lg">
                  <DialogTitle
                    className="text-xl font-semibold mb-4 text-slate-900 dark:text-white p-2"
                    data-testid="modal-title"
                  >
                    {data.title}
                  </DialogTitle>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    data-testid="close-modal"
                  >
                    <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </button>
                  <img
                    src={data.primaryImage?.trim() ? data.primaryImage : '/not-found.png'}
                    alt={data.objectName}
                    className="w-full max-h-96 object-contain mb-4 rounded"
                  />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>{t('modal.artist')}:</strong> {data.artistDisplayName || data.culture}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>{t('modal.date')}:</strong> {data.objectDate}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>{t('modal.classification')}:</strong> {data.classification}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>{t('modal.department')}:</strong> {data.department}
                  </p>
                  <div className='flex items-center justify-between mt-4'>
                    <a
                      href={data.objectURL}
                      target="_blank"
                      className="text-teal-600 dark:text-teal-400 underline mt-4 inline-block"
                    >
                      {t('modal.seeMore')}
                    </a>
                    <FavoriteButton id={id} />
                  </div>
                </DialogPanel>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
