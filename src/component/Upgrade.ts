import { GenerateDemands } from '../utils'
import { IComponent } from '../utils/ecs/model'

interface SUProps {
  aspect: string
  operation: string
  amount?: number
  demands?: {[index: string]: number | undefined}
  requested?: boolean
}

export class SingleUpgrade {
  public aspect: 'time' | 'quantity' | 'capacity' | 'production'
  public operation: '+' | '/' | '*'
  public amount: number
  public demands: {[index: string]: number}
  public requested: boolean

  constructor ({ aspect, operation, amount, demands, requested }: SUProps) {
    if (aspect !== 'time' && aspect !== 'quantity' && aspect !== 'capacity' && aspect !== 'production') {
      throw new Error(`Aspect ${aspect} is not supported`)
    }

    if (operation !== '+' && operation !== '/' && operation !== '*') {
      throw new Error(`Operation ${operation} is not supported`)
    }

    this.aspect = aspect
    this.operation = operation
    this.amount = amount ?? 0
    this.demands = demands === undefined ? {} : GenerateDemands(demands)
    this.requested = requested ?? false
  }
}

interface Props {
  upgrades: SingleUpgrade[]
}

export class Upgrade implements IComponent {
  type = 'Upgrade'
  upgrades: SingleUpgrade[]

  constructor ({ upgrades }: Props) {
    this.upgrades = upgrades
  }
}
