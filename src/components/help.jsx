import * as React from 'react'
import cn from 'classnames'

import './help.scss'

export default function Help({children, name}) {
  return <div className={cn('help', `help-${name}`)}>
    {children}
  </div>
}
