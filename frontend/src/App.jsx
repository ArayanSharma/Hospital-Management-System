import { useState } from 'react'
import Header from './feature/home/components/Header'
import Home from './feature/home/page/Home'
import { Provider } from 'react-redux'
import Store from './redux/Store'


function App() {
  return (
    <>
    <Provider store={Store}>
      <Home />
    </Provider>

    </>
  )
}

export default App
