import { WasteCollector } from "../entities/waste-collector.entity";

export interface IWasteCollectorRepository {
  create(wasteCollector: WasteCollector): Promise<WasteCollector>;
  findById(id: string): Promise<WasteCollector>;
  update(wasteCollector: WasteCollector): Promise<WasteCollector>;
  delete(id: string): Promise<void>;
  findAll(): Promise<WasteCollector[]>;
}
