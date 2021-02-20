import { Store } from './component'
import { DemandSystem, ProductionListSystem, StorageDemandSystem, SupplyStorageSystem, SupplySystem } from './system'
import { Entity, ISystem, TickInfo, Save, Load, CreateProductionEntities } from './utils'
import { IResourceList, ItemList } from './type'
import { UpgradeSystem } from './system/UpgradeSystem'

export class ProgressCiv {
  public systems: ISystem[] = []
  public entities: Entity[] = []

  private AddSystems (): void {
    const demandSystem: DemandSystem = new DemandSystem()
    const productionSystem: ProductionListSystem = new ProductionListSystem()
    const storageDemandSystem: StorageDemandSystem = new StorageDemandSystem()
    const supplyStorageSystem: SupplyStorageSystem = new SupplyStorageSystem()
    const supplySystem: SupplySystem = new SupplySystem()
    const upgradeSystem: UpgradeSystem = new UpgradeSystem()

    this.systems.push(storageDemandSystem,
      demandSystem,
      productionSystem,
      supplySystem,
      supplyStorageSystem,
      upgradeSystem)
  }

  public Update (delta: TickInfo): void {
    this.systems.forEach((s) => {
      s.update(delta, this.entities)
    })
  }

  public NewGame (itemList: ItemList): void {
    this.systems = []
    this.AddSystems()

    const storeEntity = new Entity()
    const capacities: IResourceList = {}
    itemList.items.map((item) => {
      const k = item.product
      capacities[k] = item.quantity * 100
    })

    const store = new Store({ capacities })
    storeEntity.components.push(store)

    this.entities = []
    this.entities.push(storeEntity)
    this.entities.push(...CreateProductionEntities(itemList))
  }

  public Save (): string {
    return Save(this.entities)
  }

  public Load (state: string): void {
    this.entities = Load(state)
  }
}
