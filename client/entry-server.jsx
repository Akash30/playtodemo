import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './components/App'

export function render(url) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App url={url} />
      </StaticRouter>
    </React.StrictMode>
  )
}
