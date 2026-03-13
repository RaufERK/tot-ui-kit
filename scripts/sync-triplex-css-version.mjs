import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const TRIPLEX_PACKAGE_NAME = '@sberbusiness/triplex-next'
const TOKEN_PATTERN = /(--triplex-next-[A-Za-z0-9_-]+)-\d+-\d+-\d+(?=[:),\s])/g

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..')
const packageJsonPath = resolve(projectRoot, 'package.json')
const globalCssPath = resolve(projectRoot, 'src/global.css')

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const rawTriplexVersion =
  packageJson.devDependencies?.[TRIPLEX_PACKAGE_NAME] ??
  packageJson.dependencies?.[TRIPLEX_PACKAGE_NAME] ??
  packageJson.peerDependencies?.[TRIPLEX_PACKAGE_NAME]

if (!rawTriplexVersion) {
  throw new Error(
    `Cannot find ${TRIPLEX_PACKAGE_NAME} in package.json dependencies`
  )
}

const semverMatch = String(rawTriplexVersion).match(/(\d+)\.(\d+)\.(\d+)/)
if (!semverMatch) {
  throw new Error(
    `Cannot parse semver from ${TRIPLEX_PACKAGE_NAME}: ${rawTriplexVersion}`
  )
}

const [, major, minor, patch] = semverMatch
const targetTokenVersion = `${major}-${minor}-${patch}`
const targetDisplayVersion = `${major}.${minor}.${patch}`

const currentCss = readFileSync(globalCssPath, 'utf8')
let nextCss = currentCss.replace(TOKEN_PATTERN, `$1-${targetTokenVersion}`)

// Keep header comment aligned with installed Triplex version.
nextCss = nextCss.replace(
  /\/\* Triplex [^*]* tokens: базовые цвета текста\/фона для обеих тем \*\//,
  `/* Triplex ${targetDisplayVersion} tokens: базовые цвета текста/фона для обеих тем */`
)

if (nextCss === currentCss) {
  console.log(
    `[sync-triplex-css-version] src/global.css already uses ${targetTokenVersion}`
  )
  process.exit(0)
}

writeFileSync(globalCssPath, nextCss, 'utf8')
console.log(
  `[sync-triplex-css-version] Updated Triplex token suffixes to ${targetTokenVersion}`
)
