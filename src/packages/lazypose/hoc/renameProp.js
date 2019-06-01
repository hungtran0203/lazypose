import _ from 'lodash'

export const renameProp = (oldName, newName) => ownerProps => {
  if (_.has(ownerProps, oldName)) {
    const val = _.get(ownerProps, oldName)
    return {
      ..._.omit(ownerProps, [oldName]),
      [newName]: val,
    }
  }
  return ownerProps
}
export default renameProp
