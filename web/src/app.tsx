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

      {error && <p class="rounded-xl bg-paper px-4 py-2 text-sm font-medium text-ink shadow-sm">{error}</p>}
      {loading && <p class="px-1 text-sm text-ash">Loading...</p>}

      {result && <FeedList items={result.items} onSelect={(id) => navigate(`/observations/${id}`)} />}

      {result && (
        <div class="flex items-center justify-between rounded-xl bg-paper px-4 py-2 text-sm shadow-sm">
          <button
            type="button"
            onClick={prevPage}
            disabled={!hasPrev || loading}
            class="cursor-pointer px-3 py-1 font-medium text-ink disabled:cursor-default disabled:text-ash/40"
          >
            Previous
          </button>
          <span class="text-ash">
            {offset + 1}-{Math.min(offset + pageSize, result.total)} of {result.total}
          </span>
          <button
            type="button"
            onClick={nextPage}
            disabled={!hasNext || loading}
            class="cursor-pointer px-3 py-1 font-medium text-ink disabled:cursor-default disabled:text-ash/40"
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
  return <DetailPage id={Number(id)} onBack={() => navigate('/')} onSelect={(nextId) => navigate(`/observations/${nextId}`)} />
}

function TopBar() {
  return (
    <header class="sticky top-0 z-20 border-b border-hairline bg-paper/80 backdrop-blur-sm">
      <div class="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3">
        <span class="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        <span class="text-[15px] font-bold tracking-tight text-ink">Engram Feed</span>
      </div>
    </header>
  )
}

function FeedLayout() {
  return (
    <div class="gap-4 grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] mx-auto px-4 py-4 w-full max-w-6xl">
      <div class="lg:top-16 lg:sticky lg:self-start">
        <Sidebar />
      </div>

      <main class="flex min-w-0 flex-col gap-3">
        <Router>
          <Route path="/" component={FeedRoute} />
          <Route path="/observations/:id" component={DetailRoute} />
        </Router>
      </main>

      <div class="lg:top-16 lg:sticky flex flex-col lg:self-start gap-4">
        <SearchBox />
        <TypesPanel />
      </div>
    </div>
  )
}

export function App() {
  return (
    <FeedProvider>
      <div class="flex min-h-screen flex-col bg-canvas">
        <TopBar />
        <FeedLayout />
      </div>
    </FeedProvider>
  )
}
