import { Route, Router, useLocation } from 'preact-iso'
import { FeedProvider, useFeed } from './context/FeedContext'
import { SearchBox } from './components/SearchBox'
import { Sidebar } from './components/Sidebar'
import { TypesPanel } from './components/TypesPanel'
import { FeedList } from './components/FeedList'
import { DetailPage } from './components/DetailPage'

function FeedRoute() {
  const { route: navigate } = useLocation()
  const { result, loading, error, prevPage, nextPage, offset, pageSize } = useFeed()
  const hasPrev = offset > 0
  const hasNext = result !== null && offset + pageSize < result.total

  return (
    <>
      {error && <p class="bg-paper shadow-sm px-4 py-2 rounded-xl font-medium text-ink text-sm">{error}</p>}
      {loading && <p class="px-1 text-ash text-sm">Loading...</p>}

      {result && <FeedList items={result.items} onSelect={(id) => navigate(`/observations/${id}`)} />}

      {result && (
        <div class="flex justify-between items-center bg-paper shadow-sm px-4 py-2 rounded-xl text-sm">
          <button
            type="button"
            onClick={prevPage}
            disabled={!hasPrev || loading}
            class="px-3 py-1 font-medium text-ink disabled:text-ash/40 cursor-pointer disabled:cursor-default"
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
            class="px-3 py-1 font-medium text-ink disabled:text-ash/40 cursor-pointer disabled:cursor-default"
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
  return (
    <DetailPage
      id={Number(id)}
      onBack={() => navigate('/')}
      onSelect={(nextId) => navigate(`/observations/${nextId}`)}
    />
  )
}

function TopBar() {
  return (
    <header class="top-0 z-20 sticky bg-paper/80 backdrop-blur-sm border-hairline border-b">
      <div class="flex items-center gap-2 mx-auto px-4 py-3 w-full max-w-6xl">
        <span class="bg-accent rounded-full w-2 h-2" aria-hidden="true" />
        <span class="font-bold text-[15px] text-ink tracking-tight">Engram Feed</span>
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

      <main class="flex flex-col gap-3 min-w-0">
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
      <div class="flex flex-col bg-canvas min-h-screen">
        <TopBar />
        <FeedLayout />
      </div>
    </FeedProvider>
  )
}
