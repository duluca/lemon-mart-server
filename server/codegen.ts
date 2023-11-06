import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/graphql',
  generates: {
    'src/graphql/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
}

export default config
