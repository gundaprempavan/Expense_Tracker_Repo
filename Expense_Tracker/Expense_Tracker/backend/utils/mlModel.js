// // utils/mlModel.js
// const { spawn } = require('child_process');

// // Call the Python script for expense prediction
// const runMLModel = (callback) => {
//   const python = spawn('python3', ['path/to/your/python_script.py']);

//   python.stdout.on('data', (data) => {
//     callback(data.toString());
//   });

//   python.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   python.on('close', (code) => {
//     console.log(`Child process exited with code ${code}`);
//   });
// };

// module.exports = runMLModel;
