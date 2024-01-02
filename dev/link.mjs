import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

// 获取旧的 PATH 环境变量
const oldPath = process.env.PATH;

// 获取脚本的路径
const repoPath = join(__dirname, '..')

// 切换到用户的主目录
process.chdir(process.env.USERPROFILE);

// 测试node_modules/jsstp是否存在
if(!existsSync(join(process.env.USERPROFILE, 'node_modules', 'jsstp'))) {
	// 如果不存在则创建软链接
	execSync(`npm link ${repoPath}`);
}

// 测试node_modules是否存在
if(!existsSync(join(repoPath, 'node_modules'))) {
	// 如果不存在则创建软链接
	execSync(`cmd /c mklink /j "${join(repoPath, 'node_modules')}" "${join(process.env.USERPROFILE, 'node_modules')}"`);
}

// 切换回旧的路径
process.chdir(oldPath);
