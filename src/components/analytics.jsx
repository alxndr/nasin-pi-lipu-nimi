import * as React from 'react'

export default function Analytics() {
  return <>
    <script>
      {`
        window.goatcounter = {
          path: (location.host + "/" + location.pathname),
        }
      `}
    </script>
    <script
      data-goatcounter="https://alxndr.goatcounter.com/count"
      async
      src="//gc.zgo.at/count.js"
    ></script>
  </>
}
