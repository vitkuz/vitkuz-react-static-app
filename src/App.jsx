import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Docs from './pages/Docs'
import GettingStarted from './pages/GettingStarted'
import Composition from './pages/Composition'
import Currying from './pages/Currying'
import HigherOrderFunctions from './pages/HigherOrderFunctions'
import Immutability from './pages/Immutability'
import Memoization from './pages/Memoization'
import Maybe from './pages/Maybe'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="docs" element={<Docs />} />
        <Route path="docs/getting-started" element={<GettingStarted />} />
        <Route path="docs/patterns/composition" element={<Composition />} />
        <Route path="docs/patterns/currying" element={<Currying />} />
        <Route path="docs/patterns/higher-order-functions" element={<HigherOrderFunctions />} />
        <Route path="docs/patterns/immutability" element={<Immutability />} />
        <Route path="docs/patterns/memoization" element={<Memoization />} />
        <Route path="docs/patterns/maybe" element={<Maybe />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
