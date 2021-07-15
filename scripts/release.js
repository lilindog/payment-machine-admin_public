/**
 * release 发布脚本
 * 该脚本需要后端配置了webhook，脚本只负责打包推送到制定分支，更新逻辑得有webhooks部分处理。   
 * 
 * created    2021-03-15
 * lastmodify 2021-03-17
 * author     lilindog
 */

const { spawn } = require("child_process");
const { existsSync, mkdirSync, copyFileSync, rmdirSync, unlinkSync } = require("fs");
const ch = require("cmdhelper");
const { Scan } = require("filehelper");
const pkg = require("../package.json");
const ENV = require("parseenv")("env/release.env");

async function main () {
    console.log(`\n开始进行 "${ENV.title}" 发布流程...\n`);
    try {
        await checkOrCompileDist();
        await checkOrCreateTemp();
        await checkTempRelease();
        await copyDistToRelease();
        await push();
    } catch(err) {
        console.error(err);
    }
}

// main(); 若果您不知道怎么用就不要取消注释，这个脚本需要webhook配合。

async function push () {
    if (await runCmds([
        `git add .`,
        `git commit -m ${await lastCommitMessage()}`,
        `git push origin ${ENV.RELEASE_BRANCH}`
    ], ENV.RELEASE_TEMP_DIR + "/" + pkg.name)) {
        console.log(`:) ${ENV.RELEASE_BRANCH} 发布完成！\n`);
    } else {
        console.log(`:( 推送貌似出了点问题，请手动检查一下！`);
    }
}

async function checkOrCompileDist () {
    if (!existsSync(ENV.RELEASE_COMPILE_DIR)) {
        const is = await ch.confirm(`大爷, 您还没有编译资源到 ${ENV.RELEASE_COMPILE_DIR} 目录，需要帮您编译吗？`, {
            confirmText: "好的，帮我编译并执行后续步骤", cancelText: "否，我要自己编译"
        });
        if (is) {
            await compile();
        } else {
            console.log("\n大爷, 您需要自己编译dist后在重试\n");
            process.exit();
        }
    } else {
        if (await ch.confirm(`大爷, 检测到您 ${ENV.RELEASE_COMPILE_DIR} 已有编译, 需要重新编译吗？`, {
            confirmText: "重新编译",
            cancelText: "不需要重新编译"
        })) {
            await compile();
        }
    }
    async function compile () {
        console.log("\n大爷，您就瞧好吧，我这就给您编译......\n");
        await runCmds([ENV.RELEASE_BUILD_CMD], "./");
        console.log(`\n大爷，编译完成，咋接着走下一步...\n`);
    }
}

async function checkOrCreateTemp () {
    if (existsSync(ENV.RELEASE_TEMP_DIR)) return;
    const is = await ch.confirm(
        `\n检测当前目录没有temp文件夹（${ENV.RELEASE_TEMP_DIR} 文件夹用于存放 ${ENV.RELEASE_BRANCH} 发布缓存文件）需要创建吗？\n`,
        { confirmText: "好的，帮我创建并执行后续步骤", cancelText: "不，我要自己创建" }
    );
    if (is) {
        mkdirSync(ENV.RELEASE_TEMP_DIR);
    } else {
        console.log(`\n你需要自己创建temp文件夹，然后在重试！\n`);
        process.exit();
    }
}

async function runCmds (cmds = [], cwd = "./") {
    const codes = [];
    for (cmd of cmds) {
        const cmds = cmd.replace(/\s+/i, " ").split(" ").filter(i => i);
        codes.push(await new Promise((resolve, reject) => {
            const cp = spawn(cmds.shift(), cmds, { stdio: "inherit", cwd });
            cp.on("error", reject);
            cp.on("exit", resolve);
        }));
    }
    return codes.every(i => i === 0);
}

function getSortNodes (dir, excludes = []) {
    return new Promise((resolve, reject) => {
        const files = [], dirs = [];
        const scan = new Scan({
            deep: 1,
            dir,
            excludes
        });
        scan.on("data", node => {
            if (node.deep === 0) return;
            node.path1 = node.path.split(scan.dir)[1];
            if (node.type === "FILE") {
                if (!files[node.deep]) files[node.deep] = [];
                files[node.deep].unshift(node);
            } else if (node.type === "DIR") {
                if (!dirs[node.deep]) dirs[node.deep] = [];
                dirs[node.deep].unshift(node);
            }
        });
        scan.on("done", () => {
            resolve({dirs: dirs.flat(), files: files.flat()});
        });
        scan.parse();
    });
}

async function copyDir (sourceDir, targetDir) {
    const { dirs, files } = await getSortNodes(sourceDir);
    dirs.forEach(node => mkdirSync(targetDir + node.path1));
    files.forEach(node => copyFileSync(node.path, targetDir + node.path1));
}

async function clearDir (dir) {
    const { dirs, files } = await getSortNodes(dir, [".git"]);
    files.reverse().flat().forEach(node => unlinkSync(node.path));
    dirs.reverse().flat().forEach(node => rmdirSync(node.path));
}

async function copyDistToRelease () {
    const targetPath = ENV.RELEASE_TEMP_DIR + "/" + pkg.name;
    await clearDir(targetPath);
    console.log(`\n清空 ${targetPath} 下的旧资源\n`);
    await copyDir(ENV.RELEASE_COMPILE_DIR, ENV.RELEASE_TEMP_DIR + "/" + pkg.name);
    console.log(`\n拷贝 ${ENV.RELEASE_COMPILE_DIR} 的资源到 ${targetPath} 完成\n`);
}

async function checkTempRelease () {
    if (existsSync(ENV.RELEASE_TEMP_DIR + "/" + pkg.name)) return;
    if (!await ch.confirm(
        `\n检测到您的 ${ENV.RELEASE_TEMP_DIR} 目录下没有 ${ENV.RELEASE_BRANCH} 分支。\n这可能会耽误一些时间克隆。\n`,
        { confirmText: "好的我了解并希望继续", cancelText: "真JB麻烦，算了" }
    )) return;
    await runCmds([`git clone -b ${ENV.RELEASE_BRANCH} ${ENV.RELEASE_BRANCH_URL}`], ENV.RELEASE_TEMP_DIR);
}

function lastCommitMessage () {
    return new Promise((resolve, reject) => {
        const cp = spawn("git", ["log"]);
        cp.stdout.on("data", onData);
        cp.on("error", err =>  reject(err));
        function onData (chunk) {
            const spaceReg = /commit[^\n]+\nAuthor[^\n]+\nDate[^\n]+\n/ig;
            cp.stdout.removeListener("data", onData);
            resolve(chunk.toString().replace(spaceReg, "").replace(/\n/i, "").replace(/^\s+/i, "").replace(/\s+$/, ""));
        }
    });
}