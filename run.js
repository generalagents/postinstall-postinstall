const fs = require('fs')
const cwd = require('process').cwd()
const path = require('path')
const { execSync } = require('child_process')

const appPath = path.normalize(cwd.slice(0, cwd.lastIndexOf('node_modules')))

const packageJsonPath = path.join(appPath, 'package.json')

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))

  if (packageJson.scripts && packageJson.scripts.postinstall) {
    const pkgManager = shouldUseYarn() ? 'yarn' : 'npm';
    try {
      execSync(`${pkgManager} run postinstall`, {cwd: appPath})
    } catch (error) {
      console.error('Postinstall failed:')
      if (error.stdout) console.log(`stdout: ${error.stdout.toString()}`)
      if (error.stderr) console.error(`stderr: ${error.stderr.toString()}`)
      process.exit(1)
    }
  }
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
