import { Route, Router, useLocation } from 'preact-iso'
import { FeedProvider, useFeed } from './context/FeedContext'
import { SearchBox } from './components/SearchBox'
import { Sidebar } from './components/Sidebar'
import { TypesPanel } from './components/TypesPanel'
import { FilterBar } from './components/FilterBar'
import { FeedList } from './components/FeedList'
import { DetailPage } from './components/DetailPage'

function FeedRoute() {
  const { route: navigate } = useLocation()
  const { filters, result, loading, error, prevPage, nextPage, offset, pageSize } = useFeed()
  const hasPrev = offset > 0
  const hasNext = result !== null && offset + pageSize < result.total

  return (
    <>
      <FilterBar project={filters.project} type={filters.type} />

      {error && <p class="bg-white shadow-sm px-4 py-2 rounded-lg font-medium text-black text-sm">{error}</p>}
      {loading && <p class="px-1 text-gray-500 text-sm">Loading...</p>}

      {result && <FeedList items={result.items} onSelect={(id) => navigate(`/observations/${id}`)} />}

      {result && (
        <div class="flex justify-between items-center bg-white shadow-sm px-4 py-2 rounded-lg text-sm">
          <button
            type="button"
            onClick={prevPage}
            disabled={!hasPrev || loading}
            class="px-3 py-1 font-medium text-black disabled:text-gray-300 cursor-pointer disabled:cursor-default"
          >
            Previous
          </button>
          <span class="text-gray-500">
            {offset + 1}-{Math.min(offset + pageSize, result.total)} of {result.total}
          </span>
          <button
            type="button"
            onClick={nextPage}
            disabled={!hasNext || loading}
            class="px-3 py-1 font-medium text-black disabled:text-gray-300 cursor-pointer disabled:cursor-default"
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

function DetailRoute({ id }: { id: string }) {
  const { route: navigate } = useLocation()
  return <DetailPage id={Number(id)} onBack={() => navigate('/')} />
}

function FeedLayout() {
  return (
    <div class="gap-4 grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] mx-auto px-4 py-4 w-full max-w-6xl">
      <div class="lg:top-4 lg:sticky lg:self-start">
        <Sidebar />
      </div>

      <main class="flex min-w-0 flex-col gap-3">
        <Router>
          <Route path="/" component={FeedRoute} />
          <Route path="/observations/:id" component={DetailRoute} />
        </Router>
      </main>

      <div class="lg:top-4 lg:sticky flex flex-col lg:self-start gap-4">
        <SearchBox />
        <TypesPanel />
      </div>
    </div>
  )
}

export function App() {
  return (
    <FeedProvider>
      <div class="flex flex-col bg-gray-50">
        <FeedLayout />
      </div>
    </FeedProvider>
  )
}
