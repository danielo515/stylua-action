# StyLua GitHub Action <a href="https://github.com/JohnnyMorganz/stylua-action/actions"><img alt="stylua-action status" src="https://github.com/JohnnyMorganz/stylua-action/workflows/build-test/badge.svg"></a>

GitHub Action to run [StyLua](https://github.com/JohnnyMorganz/StyLua), a Lua code formatter.

Installs the StyLua binary (from GitHub releases), and caches it. Any StyLua command can then be run.

> **NOTE:** We recommend using a toolchain manager such as [aftman](https://github.com/LPGhatguy/aftman) to manage StyLua, as it allows you to define the version used throughout your project - both on the command line, and in GitHub actions.

## Usage

```yaml
- uses: actions/checkout@v3
- uses: danielo515/stylua-action@v2
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    version: latest # NOTE: we recommend pinning to a specific version in case of formatting changes
```

### Parameters

#### `token` (Required)

GitHub token. Required since the binary is downloaded from GitHub releases (to speed download)

#### `version` (Required)

The version of StyLua to use. Follows semver syntax.
Alternatively, supply `latest` to use the latest available release.

**NOTE: using `latest` may cause the action to fail if StyLua updates and the formatting changes!**

Based off https://github.com/Roblox/setup-foreman, licensed under [MIT](https://github.com/Roblox/setup-foreman/blob/master/LICENSE.txt)
