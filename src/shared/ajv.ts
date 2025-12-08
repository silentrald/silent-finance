import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv();
ajv.addKeyword({
  keyword: "color",
  type: "string",
  schemaType: "boolean",
  compile: (check) =>
    check ? (color) => /^#(?:[0-9a-fA-F]{3,4}){1,2}$/.test(color) : () => true,
});

export function compileValidator<T>(schema: JSONSchemaType<T>) {
  return ajv.compile(schema);
}
