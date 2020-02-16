import { observable } from 'mobx'

class DialogManagerClass {
  @observable
  isSignupDialogOpen = false
}

export const DialogManager = observable(new DialogManagerClass())

export default DialogManager
