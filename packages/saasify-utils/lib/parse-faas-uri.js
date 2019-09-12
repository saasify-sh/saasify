'use strict'

// namespace/projectName.serviceName@deploymentHash
// project.serviceName@deploymentHash
const projectServiceDeploymentRe = /^([a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64})\.([a-zA-Z_][a-zA-Z0-9_]*)@([a-z0-9]{8})$/

// namespace/projectName.serviceName@version
// project.serviceName@version
const projectServiceVersionRe = /^([a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64})\.([a-zA-Z_][a-zA-Z0-9_]*)@([^/?@]+)$/

// namespace/projectName.serviceName
// project.serviceName (latest version)
const projectServiceRe = /^([a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64})\.([a-zA-Z_][a-zA-Z0-9_]*)$/

// ---

// namespace/projectName@deploymentHash
// project@deploymentHash
const projectDeploymentRe = /^([a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64})@([a-z0-9]{8})$/

// namespace/projectName@version
// project@version
const projectVersionRe = /^([a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64})@([^/?@]+)$/

// namespace/projectName
// project (latest version)
const projectRe = /^([a-zA-Z0-9-]{1,64}\/[a-zA-Z0-9-]{3,64})$/

module.exports = (uri) => {
  // ---
  // test cases where serviceName is explicitly specified
  // ---

  const psdMatch = uri.match(projectServiceDeploymentRe)

  if (psdMatch) {
    return {
      projectId: psdMatch[1],
      serviceName: psdMatch[2],
      deploymentHash: psdMatch[3]
    }
  }

  const psvMatch = uri.match(projectServiceVersionRe)

  if (psvMatch) {
    return {
      projectId: psvMatch[1],
      serviceName: psvMatch[2],
      version: psvMatch[3]
    }
  }

  const psMatch = uri.match(projectServiceRe)

  if (psMatch) {
    return {
      projectId: psMatch[1],
      serviceName: psMatch[2],
      version: 'latest'
    }
  }

  // ---
  // test cases where serviceName is not explicitly specified
  // (deployment must have a single service)
  // ---

  const pdMatch = uri.match(projectDeploymentRe)

  if (pdMatch) {
    return {
      projectId: pdMatch[1],
      deploymentHash: pdMatch[2]
    }
  }

  const pvMatch = uri.match(projectVersionRe)

  if (pvMatch) {
    return {
      projectId: pvMatch[1],
      version: pvMatch[2]
    }
  }

  const pMatch = uri.match(projectRe)

  if (pMatch) {
    return {
      projectId: pMatch[1],
      version: 'latest'
    }
  }

  // no match found; return undefined
}
