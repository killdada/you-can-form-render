// 构建前输出mock目录到 vercel当前根目录
const fs = require('fs-extra');

// With a callback:
fs.copy('./mock', 'mock', (err) => {
  if (err) return console.error(err);
  console.log('success!');
}); // copies file
