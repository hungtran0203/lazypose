import { renameProp } from './renameProp'

export const renameProps = nameMap => ownerProps => {
  let rtnProps = ownerProps
  Object.keys(nameMap).map(propName => {
    rtnProps = renameProp(propName, nameMap[propName])(rtnProps)
    return rtnProps
  })
  return rtnProps
}
export default renameProps
