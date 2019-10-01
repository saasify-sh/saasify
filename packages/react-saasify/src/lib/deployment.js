import DefaultDeployment from './default-deployment.json'

if (process.env.NODE_ENV !== 'development' && !window.SAASIFY_DEPLOYMENT) {
  console.error('missing SAASIFY_DEPLOYMENT')
}

export default window.SAASIFY_DEPLOYMENT || DefaultDeployment
