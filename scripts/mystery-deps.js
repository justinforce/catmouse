const { execSync } = require('child_process')
const chalk = require('chalk')
const { dependencies, devDependencies } = require('../package.json')

const README = 'README.md'

const { warn } = console

const missing = group => {
  const missingDeps = []
  Object.entries(group).forEach(([dependency]) => {
    try {
      execSync(`grep '^- ${dependency} ' README.md`)
    } catch (error) {
      missingDeps.push(dependency)
    }
  })
  return missingDeps
}

const missingDeps = {
  dependencies: missing(dependencies),
  devDependencies: missing(devDependencies),
}

Object.entries(missingDeps).forEach(([group, deps]) => {
  if (deps.length > 0) {
    const summary = `${group} not mentioned in ${README}:`
    warn(`${chalk.yellow(summary)}\n${deps.join('\n')}\n`)
  }
})

const missingDepCount =
  missingDeps.dependencies.length + missingDeps.devDependencies.length

if (missingDepCount > 0) {
  warn(
    chalk.yellow(
      `Found ${missingDepCount} total dependencies not mentioned in ${README}`
    )
  )
}

process.exit(missingDepCount)
