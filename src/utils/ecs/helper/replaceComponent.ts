import { IComponent, Entity } from '..'

export function replaceComponent<C extends IComponent> (e: Entity, constr: new(...args: any[]) => C, replacement: C): void {
  let index: number = -1
  for (const component of e.components) {
    if (component instanceof constr) {
      index = e.components.indexOf(component)
      break
    }
  }

  if (index > -1) {
    e.components[index] = replacement
  } else {
    throw new Error('Component does not exist')
  }
}
