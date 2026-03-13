import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";
import { WasteCollector } from "./waste-collector.entity";

export type TEnterpriseProps = {
  commercialName: string;
  companyName: string;
}


export class Enterprise {
  private id: string
  private props: TEnterpriseProps

  private constructor(props: TEnterpriseProps) {
    this.props = props
  }

  public static create(enterprise: TEnterpriseProps) {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(enterprise.commercialName, 'commercialName'),
      Guard.againstNullOrUndefined(enterprise.companyName, 'companyName'),
    ])

    if (guardResults.isFailure) {
      return Result.fail<Enterprise>(guardResults.getErrorValue());
    }

    return Result.ok<Enterprise>(new Enterprise(enterprise));
  }

  public getId() {
    return this.id
  }

  public getCommercialName() {
    return this.props.commercialName
  }

  public getCompanyName() {
    return this.props.companyName
  }

  public setCommercialName(commercialName: string) {
    this.props.commercialName = commercialName
  }

  public setCompanyName(companyName: string) {
    this.props.companyName = companyName
  }

  public setId(id: string) {
    this.id = id
  }
}
