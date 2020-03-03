// This is an optimization along with a custom webpack alias in `config-overrides.js`
// that allows us to circumvent the lack of tree shaking in @ant-design/icons.
//
// We're essentially only importing the specific icons we're using to cut down on
// ~200k unused bundle size.

// outline
export { default as QuestionCircleOutline } from '@ant-design/icons/lib/outline/QuestionCircleOutline'
export { default as UserOutline } from '@ant-design/icons/lib/outline/UserOutline'
export { default as MailOutline } from '@ant-design/icons/lib/outline/MailOutline'
export { default as LockOutline } from '@ant-design/icons/lib/outline/LockOutline'
export { default as LoadingOutline } from '@ant-design/icons/lib/outline/LoadingOutline'
export { default as CopyOutline } from '@ant-design/icons/lib/outline/CopyOutline'
export { default as RightOutline } from '@ant-design/icons/lib/outline/RightOutline'
export { default as LeftOutline } from '@ant-design/icons/lib/outline/LeftOutline'
export { default as EyeOutline } from '@ant-design/icons/lib/outline/EyeOutline'
export { default as EyeInvisibleOutline } from '@ant-design/icons/lib/outline/EyeInvisibleOutline'
export { default as ReloadOutline } from '@ant-design/icons/lib/outline/ReloadOutline'
export { default as Menu } from '@ant-design/icons/lib/outline/MenuOutline'

export { default as LinkedinOutline } from '@ant-design/icons/lib/outline/LinkedinOutline'
export { default as TwitterOutline } from '@ant-design/icons/lib/outline/TwitterOutline'
export { default as GithubOutline } from '@ant-design/icons/lib/outline/GithubOutline'
export { default as GoogleOutline } from '@ant-design/icons/lib/outline/GoogleOutline'

export { default as InfoOutline } from '@ant-design/icons/lib/outline/InfoOutline'
export { default as CheckOutline } from '@ant-design/icons/lib/outline/CheckOutline'
export { default as CloseOutline } from '@ant-design/icons/lib/outline/CloseOutline'
export { default as ExclamationOutline } from '@ant-design/icons/lib/outline/ExclamationOutline'

export { default as InfoCircleOutline } from '@ant-design/icons/lib/outline/InfoCircleOutline'
export { default as CheckCircleOutline } from '@ant-design/icons/lib/outline/CheckCircleOutline'
export { default as CloseCircleOutline } from '@ant-design/icons/lib/outline/CloseCircleOutline'
export { default as ExclamationCircleOutline } from '@ant-design/icons/lib/outline/ExclamationCircleOutline'

export { default as SettingOutline } from '@ant-design/icons/lib/outline/SettingOutline'
export { default as HomeOutline } from '@ant-design/icons/lib/outline/HomeOutline'
export { default as DashboardOutline } from '@ant-design/icons/lib/outline/DashboardOutline'
export { default as ScheduleOutline } from '@ant-design/icons/lib/outline/ScheduleOutline'

// twotone
export { default as CheckCircleTwoTone } from '@ant-design/icons/lib/twotone/CheckCircleTwoTone'

// filled
export { default as CloseCircleFill } from '@ant-design/icons/lib/fill/CloseCircleFill'
