import { IComponent, Entity } from '..'

export function removeComponent<C extends IComponent> (e: Entity, constr: new(...args: any[]) => C): void {
  let index: number = -1
  for (const component of e.components) {
    if (component instanceof constr) {
      index = e.components.indexOf(component)
      break
    }
  }

  if (index > -1) {
    e.components.splice(index, 1)
  } else {
    throw new Error('Component does not exist')
  }
}
