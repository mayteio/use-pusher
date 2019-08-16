# react-pusher-hooks

> exposes useChannel and useTrigger hooks for react apps

[![NPM](https://img.shields.io/npm/v/react-pusher-hooks.svg)](https://www.npmjs.com/package/react-pusher-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-pusher-hooks
```

## Usage

```tsx
import * as React from 'react'

import { useMyHook } from 'react-pusher-hooks'

const Example = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
```

## License

MIT © [@mayteio](https://github.com/@mayteio)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
