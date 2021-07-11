import useImage from 'use-image'
import { useSelector } from 'react-redux'
import { imageSelector } from './selectors'

export const useImageExt = () => {
  const [image] = useImage(useSelector(imageSelector))
  const width = (image && image.width) || 1000
  const height = (image && image.height) || 1000
  return [
    image, {
      width, height
    }
  ]
}
