import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";

export type TMaterialProps = {
  name: string;
}

export class Material {
  private props: TMaterialProps;

  private constructor(props: TMaterialProps) {
    this.props = props;
  }

  public static create(props: TMaterialProps): Result<Material> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(props.name, 'name')
    ]);

    if (guardResults.isFailure) {
      return Result.fail(guardResults.getErrorValue());
    }

    return Result.ok(new Material(props));
  }

  public getName(): string {
    return this.props.name;
  }
}
