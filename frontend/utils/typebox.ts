export const t = {
  String: (_options?: any) => ({ type: 'string' }),
  Number: (_options?: any) => ({ type: 'number' }),
  Boolean: (_options?: any) => ({ type: 'boolean' }),
  Array: (_itemSchema?: any, _options?: any) => ({ type: 'array' }),
  Object: (properties: any) => ({ type: 'object', properties }),
  Optional: (schema: any) => ({ ...schema, optional: true }),
  Union: (schemas: any[]) => ({ type: 'union', schemas }),
  Null: () => ({ type: 'null' }),
  Any: () => ({ type: 'any' }),
  Partial: (schema: any) => ({ ...schema, partial: true }),
};
