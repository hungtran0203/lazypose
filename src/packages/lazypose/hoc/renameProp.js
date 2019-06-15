import omit from 'lodash/omit'
import has from 'lodash/has'
import get from 'lodash/get'

export const renameProp = (oldName, newName) => ownerProps => {
  if (has(ownerProps, oldName)) {
    const val = get(ownerProps, oldName)
    return {
      ...omit(ownerProps, [oldName]),
      [newName]: val,
    }
  }
  return ownerProps
}
export default renameProp
