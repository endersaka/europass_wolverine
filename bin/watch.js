const fs = require('fs');
const spawn = require('child_process').spawn;

const options = {
  recursive: true // watch everything in the directory
};

fs.watch('src', options, (eventType, file) => {
  // Get the extension of the file.
  const fileExtension = file.split('.').pop();
  let scriptLabel = null;

  switch (fileExtension) {
    case 'js':
    scriptLabel = 'build';
    break;
    case 'less':

    break;
    case 'scss':

    break;
    default:

  }

  if (scriptLabel) {
    // Spawn the process
    const process = spawn('npm', ['run', script], {
      stdio: 'inherit' // pipe output to the console
    });

    // Print something when the process completes
    process.on('close', code => {
      if (code === 1) {
        console.error(`✖ "npm run ${script}" failed.`);
      } else {
        console.log('watching for changes...');
      }
    });
  }
});

console.log('watching for changes...');
