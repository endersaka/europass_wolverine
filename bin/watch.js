// Based on https://mikej.codes/post/watching-file-changes-npm-scripts

const fs = require('fs');
const spawn = require('child_process').spawn;

const options = {
  recursive: true // watch everything in the directory
};

fs.watch('src', options, (eventType, file) => {
  console.log('found: ', file);

  // Get the extension of the file.
  const fileExtension = file.split('.').pop();
  let scriptLabel = null;

  switch (fileExtension) {
    case 'js':
    scriptLabel = 'build';
    console.log('i will execute script labeled: ', scriptLabel);
    break;
    case 'less':

    break;
    case 'scss':

    break;
    default:

  }

  if (scriptLabel) {
    console.log('spawning process for label: ', scriptLabel);

    // Spawn the process
    const process = spawn('npm', ['run', scriptLabel], {
      stdio: 'inherit' // pipe output to the console
    });

    // Print something when the process completes
    process.on('close', code => {
      if (code === 1) {
        console.error(`✖ "npm run ${scriptLabel}" failed.`);
      } else {
        console.log('watching for changes...');
      }
    });
  }
});

console.log('watching for changes...');
