export const flattenProp = propName => ownerProps => {
  const newProps = ownerProps[propName]

  return { ...ownerProps, ...newProps }
}

export default flattenProp
