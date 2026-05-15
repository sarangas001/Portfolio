import React from 'react'
import WindowWrapper from '../hoc/WindowWrapper'
import { WindowControlls } from '../components'

const Resume = () => {
  return (
    <>
        <div id="window-header">
            <WindowControlls target="resume" />
            <h2>Resume.pdf</h2>
        </div>
        
    </>
  )
}

const ResumeWindow = WindowWrapper(Resume, 'resume')

export default ResumeWindow;