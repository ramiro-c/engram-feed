import './index.css'
import { render } from 'preact'
import { LocationProvider } from 'preact-iso'
import { App } from './app.tsx'

render(
  <LocationProvider>
    <App />
  </LocationProvider>,
  document.getElementById('app')!,
)
