import { Badge } from '@tremor/react'

import { ExtendedStatus, STATUS_COLORS, STATUS_ICONS, translateExtendedStatus} from '@/utils'

interface Props {
  status: ExtendedStatus
}

const StatusBadge: React.FC<Props> = ({ status }) => (
  <Badge color={STATUS_COLORS[status]} icon={STATUS_ICONS[status]}>
    {translateExtendedStatus(status)}
  </Badge>
)

export default StatusBadge
