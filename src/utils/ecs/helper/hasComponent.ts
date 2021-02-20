import { IComponent, Entity } from '..'
export function hasComponent<C extends IComponent> (e: Entity, constr: new(...args: any[]) => C): boolean {
  for (const component of e.components) {
    if (component instanceof constr) {
      return true
    }
  }
  return false
}

export const HasComponent = <C extends IComponent>(constr: new(...args: any[]) => C) => (e: Entity): boolean => {
  for (const component of e.components) {
    if (component instanceof constr) {
      return true
    }
  }
  return false
}
