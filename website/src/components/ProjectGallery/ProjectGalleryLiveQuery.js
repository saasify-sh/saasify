import { API, ReactLiveQuery } from 'react-saasify'

export class ProjectGalleryLiveQuery extends ReactLiveQuery {
  constructor(opts) {
    super({
      model: 'project',
      key: 'id',
      limit: 25,
      network: {
        find: async (opts) => {
          return API.listProjects(opts)
        }
      },
      ...opts
    })
  }
}
