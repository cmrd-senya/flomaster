import { useState } from 'react'

export const LaunchFileHandler = ({ children }) => {
  const [file, setFile] = useState(null)

  if ('launchQueue' in window) {
    window.launchQueue.setConsumer(async launchParams => {
      if (!launchParams.files.length) { return }

      setFile(await launchParams.files[0].getFile())
    })
  }

  return children(file)
}
