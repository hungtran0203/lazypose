export const withProps = createProps => ownerProps => {
  const newProps = createProps(ownerProps)
  return { ...ownerProps, ...newProps }
}
