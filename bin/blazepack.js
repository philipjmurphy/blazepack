#!/usr/bin/env node
const parseArgs = require('minimist');
const { startDevServer, installPackage, createProject } = require('../src');
const { version } = require('../package.json');
const { logError, logInfo } = require('../src/utils');

const args = parseArgs(process.argv.slice(2));
const commandOrDirectory = args._[0] || process.cwd();
const DEFAULT_PORT = 3000;
const PORT = args.port || DEFAULT_PORT;

function validateNewProject(projectName, template) {
  const availableTemplates = ['react', 'preact', 'angular', 'vue2', 'vue3', 'svelte'];

  if (!projectName) {
    logError(`Required argument project name was not provied`);

    process.exit(1);
  }

  if (!template) {
    logInfo('No template was provided using the default template react');

    template = 'react';
  }

  if (!availableTemplates.includes(template)) {
    logError(`Unknown template ${template}, available options are ${availableTemplates.join(',')}`);

    process.exit(1);
  }

  return template;
}

if (args.version) {
  console.log(`v${version}`);
} else {
  switch (commandOrDirectory) {
    case 'install': {
      const package = args._[1];

      if (!package) {
        logError(`Required argument package name was not provied`);

        process.exit(1);
      }

      installPackage(package);
      break;
    }
    case 'create': {
      const projectName = args._[1];
      let template = args.template;

      template = validateNewProject(projectName, template);

      createProject(projectName, template, false, PORT);

      break;
    }
    case 'start': {
      const projectName = args._[1];
      let template = args.template;

      template = validateNewProject(projectName, template);

      createProject(projectName, template, true, PORT);

      break;
    }
    default: {
      startDevServer(commandOrDirectory, PORT);
    }
  }
}
