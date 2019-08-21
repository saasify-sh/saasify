import DefaultDeployment from './default-deployment.json'

if (process.env.NODE_ENV === 'development' && !window.FIN_DEPLOYMENT) {
  console.warn('error missing FIN_DEPLOYMENT')
}

export default window.FIN_DEPLOYMENT || DefaultDeployment
