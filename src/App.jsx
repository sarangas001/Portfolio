import React from 'react'
import {Draggable} from 'gsap/Draggable';
import gsap from 'gsap';

import { Navbar, Welcome, Dock  } from './components'
import { Safari, Terminal } from './windows';

gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
      <Terminal />
      <Safari />
    </main>
  )
}

export default App