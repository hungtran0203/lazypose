import { RenderComponentError } from '../utils'

const Nothing = () => null

export const renderNothing = () => ownerProps => {
  throw new RenderComponentError({
    Component: Nothing,
    props: ownerProps,
  })
}

export default renderNothing
