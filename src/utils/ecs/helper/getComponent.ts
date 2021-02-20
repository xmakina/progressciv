import { IComponent, Entity } from '..'
export function getComponent<C extends IComponent> (e: Entity, constr: new(...args: any[]) => C): C {
  for (const component of e.components) {
    if (component instanceof constr) {
      return component
    }
  }

  throw new Error('Component does not exist')
}
