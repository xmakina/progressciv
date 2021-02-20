import { IComponent } from '../utils'

interface Props {
  label?: string
  sprite?: string
}

export class Display implements IComponent {
  public readonly type: string = 'Display'
  public readonly label: string
  public readonly sprite: string

  constructor (props: Props) {
    this.label = props.label ?? 'unknown'
    this.sprite = props.sprite ?? 'unknown'
  }
}
