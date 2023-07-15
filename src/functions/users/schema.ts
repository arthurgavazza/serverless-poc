export default {
  type: "object",
  properties: {
    id: {type: 'string'},
    name: { type: 'string' }
  },
  required: ['name']
} as const;
