const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      const tsPath = fullPath.replace(/\.js$/, '.ts');
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace requires
      // const x = require('y') -> import x from 'y'
      content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"])(.*?)\2\);?/g, "import $1 from '$3';");
      
      // const { x, y } = require('z') -> import { x, y } from 'z'
      content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\((['"])(.*?)\2\);?/g, "import { $1 } from '$3';");
      
      // let x = require('y') -> import x from 'y'
      content = content.replace(/let\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"])(.*?)\2\);?/g, "import $1 from '$3';");
      
      // module.exports = x -> export default x
      content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, "export default $1;");
      
      // module.exports = { x, y } -> export { x, y }
      content = content.replace(/module\.exports\s*=\s*\{([^}]+)\};?/g, "export { $1 };");
      
      // Basic express typing middleware / controllers
      content = content.replace(/\(req, res\)/g, "(req: any, res: any)");
      content = content.replace(/\(req, res, next\)/g, "(req: any, res: any, next: any)");
      content = content.replace(/\(err, req, res, next\)/g, "(err: any, req: any, res: any, next: any)");
      
      fs.writeFileSync(tsPath, content, 'utf8');
      fs.unlinkSync(fullPath);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Migration completed');
