import { IResourceList } from '.'

export interface ProductionBlueprint {
  demands: IResourceList
  products: IResourceList
  time: number
}
