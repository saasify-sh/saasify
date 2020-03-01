import { ReactLiveQuery } from '../../store/ReactLiveQuery'
import { API } from '../../lib/api'

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
