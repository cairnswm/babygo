import ClassifiedList from './home/ClassifiedList'
import { accessElf } from '../auth/utils/accessElf'

const HomePage = () => {
  accessElf.track('HomePage')
  return <ClassifiedList />
}

export default HomePage