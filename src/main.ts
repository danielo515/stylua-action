import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as semver from 'semver'
import stylua from './stylua'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const versionString = core.getInput('version')
    let version = semver.clean(versionString)
    core.debug(`Set version: "${versionString}", resolved as ${version}`)

    let releases
    if (!version || versionString === 'latest') {
      releases = await stylua.getReleases(token)
      const latestVersion = stylua.getLatestVersion(releases)
      if (!latestVersion) {
        throw new Error(
          'Could not find latest release version. Please specify an explicit version'
        )
      }
      version = latestVersion
    }

    // See if we already have the tool installed
    core.debug(`Looking for cached version of binary with version ${version}`)
    const styluaDirectory = tc.find('stylua', version ?? versionString)
    if (styluaDirectory) {
      core.debug(`Found cached version of stylua: ${styluaDirectory}`)
      core.addPath(styluaDirectory)
    } else {
      core.debug('No cached version found, downloading new release')

      // If we haven't already looked for the releases, then load them up
      if (!releases) releases = await stylua.getReleases(token)

      core.debug(`Retrieving matching release for user input: ${version}`)
      const release = stylua.chooseRelease(version, releases)

      if (!release) {
        throw new Error(`Could not find release for version ${version}`)
      }

      core.debug(`Chose release ${release.tag_name}`)
      const asset = stylua.chooseAsset(release)

      if (!asset) {
        throw new Error(
          `Could not find asset for ${release.tag_name} on platform ${process.platform}`
        )
      }

      core.debug(`Chose asset ${asset.browser_download_url}`)

      const downloadedPath = await tc.downloadTool(asset.browser_download_url)
      const extractedPath = await tc.extractZip(downloadedPath)
      await tc.cacheDir(extractedPath, 'stylua', version)
      core.addPath(extractedPath)

      if (process.platform === 'darwin' || process.platform === 'linux') {
        await exec(`chmod +x ${extractedPath}/stylua`)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
