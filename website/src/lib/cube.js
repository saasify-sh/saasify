import cubejs from '@cubejs-client/core'
import { env } from 'react-saasify'

const CUBEJS_API_URL = env.isProd
  ? 'https://analytics.saasify.sh'
  : 'http://localhost:4000'

export const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: CUBEJS_API_URL + '/cubejs-api/v1'
})
