import { v4 as uuidv4 } from 'uuid'
import { IComponent } from './component'

interface Props {
  id?: string
}

export class Entity {
  id: string
  components: IComponent[] = []

  constructor (props: Props = {}) {
    this.id = props.id ?? uuidv4()
  }
}
