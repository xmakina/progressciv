import { Entity } from '.'

export function Save (entities: Entity[]): string {
  return JSON.stringify(entities)
}
