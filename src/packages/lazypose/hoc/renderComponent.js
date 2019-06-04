import { RenderComponentError } from '../utils'

export const renderComponent = Component => ownerProps => {
  throw new RenderComponentError({
    Component,
    props: ownerProps,
  })
}

export default renderComponent
