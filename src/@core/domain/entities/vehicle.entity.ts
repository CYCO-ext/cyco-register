import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";

export type TVehicleProps = {
  modelId?: string;
  colorId?: string;
  type: string; //create type
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string; //create value object
}

export class Vehicle {
  private id: string
  private props: TVehicleProps

  private constructor(props: TVehicleProps) {
    this.props = props
  }

  public static create(vehicle: TVehicleProps) {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(vehicle.type, 'type'),
      Guard.againstNullOrUndefined(vehicle.brand, 'brand'),
      Guard.againstNullOrUndefined(vehicle.model, 'model'),
      Guard.againstNullOrUndefined(vehicle.year, 'year'),
      Guard.againstNullOrUndefined(vehicle.color, 'color'),
      Guard.againstNullOrUndefined(vehicle.plate, 'plate')
    ])

    if (guardResults.isFailure) {
      return Result.fail<Vehicle>(guardResults.getErrorValue());
    }

    return Result.ok<Vehicle>(new Vehicle(vehicle));
  }

  public getId() {
    return this.id
  }

  public getType() {
    return this.props.type
  }

  public getBrand() {
    return this.props.brand
  }

  public getModel() {
    return this.props.model
  }

  public getModelId() {
    return this.props.modelId
  }

  public getYear() {
    return this.props.year
  }

  public getColor() {
    return this.props.color
  }

  public getColorId() {
    return this.props.colorId
  }

  public getPlate() {
    return this.props.plate
  }

  public setId(id: string) {
    this.id = id
  }

  public setType(type: string) {
    this.props.type = type
  }

  public setBrand(brand: string) {
    this.props.brand = brand
  }

  public setModel(model: string) {
    this.props.model = model
  }

  public setModelId(modelId: string) {
    this.props.modelId = modelId
  }

  public setYear(year: number) {
    this.props.year = year
  }

  public setColor(color: string) {
    this.props.color = color
  }

  public setColorId(colorId: string) {
    this.props.colorId = colorId
  }

  public setPlate(plate: string) {
    this.props.plate = plate
  }
}
