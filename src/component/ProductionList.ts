import { IComponent } from '../utils'

interface ProductionProps {
  productionTime?: number
  progress?: number
  productionComplete?: boolean
  consumed?: boolean
  working?: boolean
}

export class Production {
  public productionTime: number
  public progress: number
  public productionComplete: boolean
  public consumed: boolean
  public working: boolean

  constructor ({ progress, productionTime, productionComplete, consumed, working }: ProductionProps) {
    this.progress = progress ?? 0
    this.productionTime = productionTime ?? 1000
    this.productionComplete = productionComplete ?? false
    this.consumed = consumed ?? false
    this.working = working ?? true
  }
}

interface Props {
  productionTime?: number
  productions?: Production[]
  currentActive?: number
  maximumActive?: number
}

export class ProductionList implements IComponent {
  public readonly type: string = 'ProductionList'
  public productionTime: number
  public productions: Production[]
  public currentActive: number
  public maximumActive: number

  constructor ({ productionTime, productions, currentActive, maximumActive }: Props) {
    this.productionTime = productionTime ?? 1000
    this.productions = productions ?? []
    this.currentActive = currentActive ?? 0
    this.maximumActive = maximumActive ?? 0
  }
}
