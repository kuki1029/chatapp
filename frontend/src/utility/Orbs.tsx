/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import './orbs.css'
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
const iterate = (count: number, mapper: (i: number) => React.ReactNode) =>
  [...new Array(count)].map((_, i) => mapper(i))

const distance = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1])

const Gooey = ({ id }: { id: string }) => (
  <filter id={id}>
    <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
    <feColorMatrix
      in="blur"
      mode="matrix"
      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -5"
      result="goo"
    />
    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
  </filter>
)

const Blur = ({ id }: { id: string }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
  </filter>
)

const Gradient = ({ id, hue }: { id: string; hue: number }) => {
  const h = hue + random(-40, 40)
  const f = [h, 80, 60]
  const t = [h + 20, 100, 30]
  return (
    <linearGradient id={id} x1="70%" x2="0%" y1="70%" y2="0%">
      <stop
        offset="0%"
        stopColor={`hsl(${t[0].toString()},${t[1].toString()}%,${t[2].toString()}%)`}
        stopOpacity="1"
      />
      <stop
        offset="100%"
        stopColor={`hsl(${f[0].toString()},${f[1].toString()}%,${f[2].toString()}%)`}
        stopOpacity="1"
      />
    </linearGradient>
  )
}

const Orb = ({ hue }: { hue: number }) => {
  const r = random(30, 100)
  const from = [random(0 - r, 1000 + r), random(0 - r, 1000 + r)]
  const to = [random(0 - r, 1000 + r), random(0 - r, 1000 + r)]
  const d = distance(from, to)
  const id = random(0, 1000)
  return (
    <>
      <circle
        cx={from[0]}
        cy={to[0]}
        r={r}
        fill={`url(#grad-${id.toString()})`}
        style={{
          '--duration': `${(d / 15).toString()}s`,
          '--from-x': from[0],
          '--from-y': from[1],
          '--to-x': to[0],
          '--to-y': to[1],
        }}
      />
      <Gradient id={`grad-${id.toString()}`} hue={hue} />
    </>
  )
}

export const Orbs = () => {
  const ORB_COUNT = 20
  const hue = 200
  return (
    <svg
      preserveAspectRatio="xMinYMin slice"
      style={{
        background: `linear-gradient(hsl(${hue.toString()},80%,90%), hsl(${hue.toString()},100%,80%))`,
      }}
    >
      <g filter="url(#blur)">
        <g filter="url(#gooey)">
          {iterate(ORB_COUNT, (i) => (
            <Orb key={i} hue={hue} />
          ))}
        </g>
      </g>
      <defs>
        <Gooey id="gooey" />
        <Blur id="blur" />
      </defs>
    </svg>
  )
}
