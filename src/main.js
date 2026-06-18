import confetti from 'canvas-confetti'
import Vara from 'vara'
import 'animate.css'
import './style.css'

const scene = document.querySelector('.scene')
const tilt = document.querySelector('.tilt')
const card = document.querySelector('.card')
const intro = document.querySelector('.intro')
const greetTop = document.querySelector('.greet-top')
const roman = document.querySelector('.roman')
const greetBottom = document.querySelector('.greet-bottom')
const handwrite = document.querySelector('.handwrite')
const stamp = document.querySelector('.stamp')
const lights = document.querySelector('.lights')
const sparkles = document.querySelector('.sparkles')
const envelope = document.querySelector('.envelope')
const envFlap = document.querySelector('.env-flap')
const envSeal = document.querySelector('.env-seal')
const frame = document.querySelector('.frame')
const emotion = document.querySelector('.emotion')
const suspense = document.querySelector('.suspense')
const suspenseDim = document.querySelector('.suspense-dim')
const suspenseLine = document.querySelector('.suspense-line')
const drumroll = document.querySelector('.drumroll')
const confettiCanvas = document.querySelector('.confetti-canvas')

const palette = ['#7c2a2a', '#b98a3c', '#d8b877', '#b23a2e', '#c9a24b', '#f4e9d6']
const fire = confetti.create(confettiCanvas, { resize: true })
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const rand = (min, max) => min + Math.random() * (max - min)

/* --- confeti elegante (paleta dorado/vino, sin emojis) --- */
const burst = () => {
  fire({ particleCount: 110, spread: 85, startVelocity: 42, origin: { y: 0.62 }, colors: palette })
  window.setTimeout(() => {
    fire({ particleCount: 55, angle: 60, spread: 65, origin: { x: 0, y: 0.65 }, colors: palette })
    fire({ particleCount: 55, angle: 120, spread: 65, origin: { x: 1, y: 0.65 }, colors: palette })
  }, 150)
}

const rain = (duration) => {
  const end = performance.now() + duration
  const tick = () => {
    fire({ particleCount: 3, angle: 60, spread: 55, startVelocity: 48, origin: { x: 0, y: 0.7 }, colors: palette })
    fire({ particleCount: 3, angle: 120, spread: 55, startVelocity: 48, origin: { x: 1, y: 0.7 }, colors: palette })
    if (performance.now() < end) requestAnimationFrame(tick)
  }
  tick()
}

const fireworks = (duration) => {
  const end = performance.now() + duration
  const launch = () => {
    fire({
      particleCount: 34,
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      scalar: 0.9,
      origin: { x: rand(0.15, 0.85), y: rand(0.15, 0.5) },
      colors: palette,
    })
    if (performance.now() < end) window.setTimeout(launch, 300)
  }
  launch()
}

/* --- cohetes: despegan desde abajo y explotan en el aire --- */
const launchRocket = (x = rand(0.2, 0.8)) => {
  // estela ascendente
  fire({
    particleCount: 14,
    angle: 90,
    spread: 12,
    startVelocity: 60,
    gravity: 1.1,
    ticks: 70,
    scalar: 0.7,
    origin: { x, y: 1 },
    colors: palette,
  })
  // explosión en el ápice
  const apex = rand(0.22, 0.42)
  window.setTimeout(() => {
    fire({ particleCount: 80, spread: 360, startVelocity: 28, gravity: 0.9, ticks: 110, scalar: 1, origin: { x, y: apex }, colors: palette })
  }, 520)
}

const rockets = (count, gap = 360) => {
  for (let i = 0; i < count; i++) {
    window.setTimeout(() => launchRocket(), i * gap)
  }
}

/* --- estrellas para darle más brillo (sin emojis) --- */
const starBurst = () => {
  fire({ particleCount: 42, spread: 120, startVelocity: 32, scalar: 1.1, shapes: ['star'], origin: { y: 0.5 }, colors: ['#d8b877', '#f4e9d6', '#c9a24b', '#b98a3c'] })
}

/* --- brillos/destellos que titilan por toda la pantalla --- */
const SPARKLE_COLORS = ['#ffffff', '#ffe9b0', '#f4e9d6', '#d8b877']
const spawnSparkles = (count) => {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span')
    s.className = 'sparkle'
    s.style.left = `${rand(2, 98)}%`
    s.style.top = `${rand(2, 98)}%`
    s.style.background = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]
    s.style.setProperty('--s', `${rand(8, 24)}px`)
    s.style.setProperty('--d', `${rand(1, 2.2)}s`)
    s.style.setProperty('--delay', `${rand(0, 1.4)}s`)
    sparkles.appendChild(s)
  }
}
const clearSparkles = () => {
  sparkles.innerHTML = ''
}

/* --- helper para animate.css (reinicia y reaplica) --- */
const play = (el, name, speed) => {
  for (const cls of [...el.classList]) {
    if (cls.startsWith('animate__')) el.classList.remove(cls)
  }
  void el.offsetWidth
  el.classList.add('animate__animated', `animate__${name}`)
  if (speed) el.classList.add(`animate__${speed}`)
}

/* --- interacciones de la tarjeta (activas tras el reveal) --- */
const maxTilt = 9

const applyTilt = (event) => {
  const bounds = scene.getBoundingClientRect()
  const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5
  const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5
  tilt.style.transform = `rotateX(${-offsetY * maxTilt}deg) rotateY(${offsetX * maxTilt}deg)`
}

const resetTilt = () => {
  tilt.style.transform = 'rotateX(0deg) rotateY(0deg)'
}

let pointerStart = null
let suppressClick = false
const swipeDistance = 40
const swipeTime = 600

const onPointerDown = (event) => {
  pointerStart = { x: event.clientX, y: event.clientY, t: performance.now() }
}

const onPointerUp = (event) => {
  if (!pointerStart) return
  const dx = event.clientX - pointerStart.x
  const dy = event.clientY - pointerStart.y
  const dt = performance.now() - pointerStart.t
  pointerStart = null
  if (Math.hypot(dx, dy) > swipeDistance && dt < swipeTime) {
    card.classList.toggle('flipped')
    suppressClick = true
  }
}

card.addEventListener('click', () => {
  if (suppressClick) {
    suppressClick = false
    return
  }
  card.classList.toggle('flipped')
})
scene.addEventListener('pointerdown', onPointerDown)
scene.addEventListener('pointerup', onPointerUp)
scene.addEventListener('pointermove', applyTilt)
scene.addEventListener('pointerleave', resetTilt)

/* --- frases manuscritas: el trazo se dibuja como con un pincel (Vara.js) --- */
const HAND_PHRASES = [
    'Porque lo mereces',
    'Porque lo amerita',
    'Por tus grandes gustos'
]

const handFontSize = () => Math.max(26, Math.min(54, Math.round(window.innerWidth / 16)))

const drawPhrase = (text) => new Promise((resolve) => {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    resolve()
  }
  handwrite.innerHTML = ''
  try {
    const vara = new Vara(
      '.handwrite',
      '/Parisienne.json',
      [{ text, fontSize: handFontSize() }],
      { strokeWidth: 1.7, color: '#e3c178', textAlign: 'center', duration: 1600 },
    )
    vara.animationEnd(finish)
  } catch (error) {
    finish()
  }
  window.setTimeout(finish, 5000) // red de seguridad por si la fuente no carga
})

const runPhrases = async () => {
  for (const text of HAND_PHRASES) {
    play(handwrite, 'fadeIn', 'faster')
    await drawPhrase(text)
    await wait(750)
    play(handwrite, 'fadeOut', 'faster')
    await wait(450)
    handwrite.innerHTML = ''
  }
}

/* --- efecto "write-on": el cupón se dibuja trazo a trazo al entrar (Trim Paths) --- */
const frontFace = document.querySelector('.face.front')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ritmos del trazado (ms): los contornos se dibujan, textos y rellenos aparecen en cascada
const DRAW = { base: 0, step: 30, dur: 600 }
const FADE = { base: 180, step: 9, dur: 380 }

let couponDraw = null // { draws: [{ el, len }], fades: [{ el, op }] }

// Reemplaza el <img> del frente por el SVG inline para poder animar sus trazos.
const inlineFront = async () => {
  try {
    const res = await fetch('/cupon-frente.svg')
    if (!res.ok) return null
    const parsed = new DOMParser().parseFromString(await res.text(), 'image/svg+xml')
    const svg = parsed.querySelector('svg')
    if (!svg || parsed.querySelector('parsererror')) return null
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    frontFace.replaceChildren(document.importNode(svg, true))
    return frontFace.querySelector('svg')
  } catch (error) {
    return null // si falla, queda el <img> original como respaldo
  }
}

// Clasifica cada elemento: contorno con longitud → se dibuja; el resto → aparece.
const collectStrokes = (svg) => {
  const draws = []
  const fades = []
  for (const el of svg.querySelectorAll('path, line, rect, ellipse, circle, polyline, polygon, text')) {
    if (el.closest('defs')) continue
    const cs = getComputedStyle(el)
    const hasStroke = cs.stroke && cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0
    const dashed = !!el.getAttribute('stroke-dasharray') || (cs.strokeDasharray && cs.strokeDasharray !== 'none')
    const marked = el.getAttribute('marker-end') || el.getAttribute('marker-start') || el.getAttribute('marker-mid')
    let len = 0
    if (hasStroke && !dashed && !marked) {
      try { len = el.getTotalLength() } catch (error) { len = 0 }
    }
    if (len > 1) draws.push({ el, len })
    else fades.push({ el, op: cs.opacity || '1' })
  }
  return { draws, fades }
}

// Estado inicial oculto (antes del reveal, mientras la escena es invisible → sin parpadeo).
const primeCoupon = ({ draws, fades }) => {
  for (const { el, len } of draws) {
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
  }
  for (const { el } of fades) {
    el.style.opacity = '0'
  }
}

const drawCoupon = () => {
  if (!couponDraw) return
  couponDraw.draws.forEach(({ el, len }, i) => {
    el.style.transition = `stroke-dashoffset ${DRAW.dur}ms cubic-bezier(.3,.7,.3,1) ${DRAW.base + i * DRAW.step}ms`
    requestAnimationFrame(() => { el.style.strokeDashoffset = '0' })
    el.addEventListener('transitionend', () => {
      el.style.strokeDasharray = ''
      el.style.strokeDashoffset = ''
      el.style.transition = ''
    }, { once: true })
  })
  couponDraw.fades.forEach(({ el, op }, i) => {
    el.style.transition = `opacity ${FADE.dur}ms ease ${FADE.base + i * FADE.step}ms`
    requestAnimationFrame(() => { el.style.opacity = op })
  })
}

// Inyecta el SVG cuanto antes y deja todo listo (oculto) para el trazado.
inlineFront().then((svg) => {
  if (!svg) return
  couponDraw = collectStrokes(svg)
  if (!reduceMotion) primeCoupon(couponDraw)
})

/* --- secuencia de intro --- */
const revealCard = () => {
  scene.classList.add('reveal')
  intro.classList.add('hide')
  burst()
  starBurst()
  rockets(4, 320)
  fireworks(2400)
  window.setTimeout(drawCoupon, 300) // el trazado acompaña la llegada del cupón
}

const EMOTION_PHRASES = [
  'Todo tu equipo te quiere y estima mucho',
  'Nunca esperábamos conocer a una persona tan maravillosa como tú',
  'Mereces mucho, por lo que das y haces por tu equipo',
  'Gracias por confiar en nosotros, nosotros confiamos en ti',
  'Es un gran honor y privilegio estar contigo',
  'Por tu cariño, corazón y la calidad de persona que eres',
  'Un gran jefe y gran persona merece un gran dia'
]

// Toda la fiesta arranca SOLO cuando le pegan al sobre.
const celebrate = async () => {
  // 1) Felices XV años — fiesta de luces, brillos y confeti
  lights.classList.add('on')
  spawnSparkles(45)
  const sparkleTimer = window.setInterval(() => spawnSparkles(6), 550)
  burst()
  rain(6800)
  play(greetTop, 'fadeInDown')
  await wait(450)
  roman.classList.remove('out')
  roman.classList.add('in')
  starBurst()
  rockets(3)
  await wait(650)
  play(greetBottom, 'fadeInUp')
  starBurst()
  for (let i = 0; i < 5; i++) {
    await wait(850)
    if (i % 2 === 0) {
      rockets(2)
    } else {
      burst()
      starBurst()
    }
  }
  fireworks(1500)
  await wait(800)
  window.clearInterval(sparkleTimer)
  lights.classList.remove('on')
  play(greetTop, 'fadeOutUp')
  roman.classList.remove('in')
  roman.classList.add('out')
  play(greetBottom, 'fadeOutDown')
  await wait(750)
  clearSparkles()

  // 2) frases emotivas — sincero e íntimo (baja la fiesta)
  for (const text of EMOTION_PHRASES) {
    emotion.textContent = text
    play(emotion, 'fadeIn')
    spawnSparkles(8)
    await wait(2700)
    play(emotion, 'fadeOut')
    await wait(700)
    clearSparkles()
  }

  // 3) frases manuscritas jocosas (empieza el giro de tono)
  await runPhrases()

  // 4) beat de suspenso
  suspenseDim.classList.add('on')
  await wait(550)
  suspense.classList.add('on')
  suspenseLine.textContent = 'Y para ti, en este día tan importante...'
  play(suspenseLine, 'fadeIn')
  drumroll.classList.add('on')
  await wait(2600)
  play(suspenseLine, 'fadeOut')
  await wait(450)
  suspense.classList.remove('on')
  drumroll.classList.remove('on')

  // 5) SORPRESA: el sello y el cupón
  stamp.classList.add('in')
  fire({ particleCount: 90, spread: 60, scalar: 1.2, startVelocity: 40, origin: { y: 0.5 }, colors: palette })
  rockets(3)
  await wait(1500)
  suspenseDim.classList.remove('on')
  revealCard()
  await wait(700)
  intro.remove()
}

// Cuando le pegan al sobre: reacciona, se rompe el sello, se abre y arranca la fiesta.
const openEnvelope = () => {
  envelope.classList.remove('invite')
  envelope.classList.add('hit')
  burst() // pequeño golpe de confeti como feedback del toque
  window.setTimeout(async () => {
    envSeal.classList.add('break')
    await wait(420)
    envFlap.classList.add('open')
    await wait(680)
    frame.classList.add('on') // el marco dorado se traza y queda de fondo
    envelope.classList.remove('hit')
    envelope.classList.add('out')
    await wait(750)
    await celebrate()
  }, 240)
}

const runIntro = async () => {
  // 0) el sobre aparece y se menea, invitando a que le peguen para abrirlo
  envelope.classList.add('show')
  await wait(700) // deja que termine la entrada antes de empezar a menearse
  envelope.classList.add('invite')
  envelope.addEventListener('pointerdown', openEnvelope, { once: true })
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const portraitGate = window.matchMedia('(orientation: portrait) and (pointer: coarse)')

const start = () => {
  if (prefersReduced) {
    intro.remove()
    scene.classList.add('reveal')
    return
  }
  runIntro()
}

// Espera a que el teléfono esté en horizontal (si aplica) antes de lanzar la intro.
if (portraitGate.matches) {
  const onGateChange = () => {
    if (!portraitGate.matches) {
      portraitGate.removeEventListener('change', onGateChange)
      start()
    }
  }
  portraitGate.addEventListener('change', onGateChange)
} else {
  start()
}
