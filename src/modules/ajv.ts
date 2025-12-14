import Ajv, { JSONSchemaType } from "ajv";
import { Result } from "@/types/result";
import { ValidatorError } from "@/types";

const ajv = new Ajv({
  allErrors: true,
});

ajv.addKeyword({
  keyword: "color",
  type: "string",
  schemaType: "boolean",
  compile: (check) =>
    check ? (color) => /^#(?:[0-9a-fA-F]{3,4}){1,2}$/.test(color) : () => true,
});

export function compileValidator<T>(schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema);

  return (entity: T): Result<void> => {
    if (validate(entity)) {
      return Result.Ok();
    }

    return Result.Error(validate.errors!.map(e => ({
      property: e.instancePath.substring(1),
      code: e.keyword,
      message: e.message,
    } as ValidatorError)));
  }
}
