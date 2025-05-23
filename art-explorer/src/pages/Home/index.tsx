import SearchInput from '../../components/SearchInput'
import SearchModeToggle from '../../components/SearchModeToggle'
import SelectDepartment from '../../components/SelectDepartment'
import { useGetDepartments, usePaginatedArtworks } from '../../services/metApi/queries'
import { useSearchStore } from '../../store/useSearchStore'
import { buildSearchParams } from '../../utils/buildSearchParams'
import Artwork from '../../components/Artwork'
import { t } from 'i18next'

export default function Home() {
  const { data } = useGetDepartments()

  const query = useSearchStore((s) => s.query)
  const mode = useSearchStore((s) => s.mode)
  const departmentId = useSearchStore((s) => s.departmentId)
  const setDepartmentId = useSearchStore((s) => s.setDepartmentId)

  const queryParams = buildSearchParams({ query, mode, departmentId })

  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePaginatedArtworks(queryParams)

  const departmentOptions = data?.departments.map((dep) => ({
    id: dep.departmentId,
    name: dep.displayName,
  })) || []

  return (
    <div className="flex flex-col items-center gap-6 mt-8 px-4">
      <div className="flex flex-col items-start gap-4 w-full max-w-3xl">
        <div className="flex items-center gap-4 w-full flex-wrap">
          <SearchModeToggle />
          <SelectDepartment
            options={departmentOptions}
            value={departmentId}
            onChange={setDepartmentId}
          />
        </div>
        <SearchInput />
      </div>

      {isLoading && <p className="text-slate-400 text-sm">{t('home.loading')}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-6">
        {paginatedData?.pages.flat().map((id) => (
          <Artwork key={id} id={id} />
        ))}
      </div>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-6 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50"
        >
          {isFetchingNextPage ? t('home.loadingMore') : t('home.loadMore')}
        </button>
      )}
    </div>
  )
}
