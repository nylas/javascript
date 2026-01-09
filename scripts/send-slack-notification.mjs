import path from 'node:path';
import { $ } from 'zx';

function markdownToSlackBlocks(markdown) {
  return markdown
    .split('\n')
    .map(line => {
      if (line.startsWith('## ')) {
        return { type: 'header', text: { type: 'plain_text', text: line.replace('## ', '') } };
      }

      if (line.startsWith('### ')) {
        return { type: 'context', elements: [{ type: 'plain_text', text: line.replace('### ', ''), emoji: true }] };
      }

      // Change links to slack links e.g. <https://www.npmjs.com/package/...|...>
      line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<$2|$1>');

      // Remove empty lines
      if (line === '') {
        return;
      }

      return { type: 'section', text: { type: 'mrkdwn', text: line } };
    })
    .filter(Boolean);
}

// Get our arguments
const [publishedPackages, slackWebhookUrl] = process.argv.slice(2);

// If no packages are provided, throw an error
if (!publishedPackages) {
  console.error('No packages that were published provided');
  process.exit(1);
}

if (!slackWebhookUrl) {
  console.error('No Slack webhook URL provided');
  process.exit(1);
}

// Get a list of packages via pnpm nx projects
const _packageNames = await $`pnpm nx show projects --json`.quiet();
const packageNames = JSON.parse(_packageNames.stdout.split('\n').slice(4).join('\n'));

// Get the package root for each package via pnpm nx show project [packageName]
const pkgs = {};
for (const packageName of packageNames) {
  // Remove the first 3 lines of the output
  const _nxPackageInfo = await $`pnpm nx show project ${packageName} --json`.quiet();
  const nxPackageInfo = JSON.parse(_nxPackageInfo.stdout.split('\n').slice(4).join('\n'));

  // Only include the packages that were published
  if (!publishedPackages.includes(packageName)) {
    continue;
  }

  // pkgs[packageName] = nxPackageInfo;
  const packageSourceRoot = nxPackageInfo.sourceRoot;
  // Get the package.json for the package
  const pkgPath = path.resolve(path.join(packageSourceRoot, '..', 'package.json'));
  const _pkg = await $`cat ${pkgPath}`.quiet();
  const pkg = JSON.parse(_pkg.stdout);

  // Add the package to the packages object
  pkgs[packageName] = { ...pkg, root: path.dirname(pkgPath) };
}

// Filter the package list to the packages that have publishConfig.access set to public
const publicPackages = Object.entries(pkgs).filter(([_, pkg]) => pkg.publishConfig?.access === 'public');

// Get the package names for the public packages
const publicPackageNames = publicPackages.map(([name, _]) => name);

// Get the CHANGELOG.md for each package
const changelogs = {};
for (const packageName of publicPackageNames) {
  const packageRoot = pkgs[packageName].root;
  const changelogPath = path.resolve(path.join(packageRoot, 'CHANGELOG.md'));
  const _changelog = await $`cat ${changelogPath}`.quiet();

  // Modify the changelog to only include the latest version
  const changelog = _changelog.stdout.split('\n');
  const latestVersionIndex = changelog.findIndex(line => line.startsWith('## '));
  const latestVersion = changelog[latestVersionIndex].replace('## ', '');

  // Now get the next version index
  const nextVersionIndex = changelog.findIndex((line, index) => {
    return index > latestVersionIndex && line.startsWith('## ');
  });

  // If the next version index is -1, then we are at the end of the file
  let latestVersionChangelog = changelog.slice(latestVersionIndex + 1, nextVersionIndex === -1 ? undefined : nextVersionIndex).join('\n');

  // Remove the section for updated dependencies, e.g:
  // - Updated dependencies
  //   - @nrwl/workspace: 13.0.0 => 13.0.1
  //   - @nrwl/tao: 13.0.0 => 13.0.1
  latestVersionChangelog = latestVersionChangelog.replace(/- Updated dependencies.*(?:\n\s+-.*)*/g, '');

  changelogs[packageName] = {
    version: latestVersion,
    changelog: latestVersionChangelog,
  };
}

// Construct a slack block for each package
const allSlackBlocks = [
  { type: 'header', text: { type: 'plain_text', emoji: true, text: ':tada: New packages published :tada:' } },
  { type: 'divider' },
  ...publicPackageNames.flatMap(packageName => {
    const { version, changelog } = changelogs[packageName];

    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:package: *<https://www.npmjs.com/package/${packageName}/v/${version}|${packageName} - v${version}>*`,
        },
      },
      { type: 'divider' },
      ...markdownToSlackBlocks(changelog),
      { type: 'divider' },
    ];
  }),
];

// Chunk the blocks into groups of 50 or fewer
const MAX_BLOCKS_PER_MESSAGE = 50;
const chunkedBlocks = [];

for (let i = 0; i < allSlackBlocks.length; i += MAX_BLOCKS_PER_MESSAGE) {
  chunkedBlocks.push(allSlackBlocks.slice(i, i + MAX_BLOCKS_PER_MESSAGE));
}

// Send the slack notification(s)
for (const blocks of chunkedBlocks) {
  await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      blocks: blocks,
    }),
  }).then(async res => {
    if (!res.ok) {
      console.error('Failed to send slack notification:', await res.text());
      process.exit(1);
    }
  });
}
