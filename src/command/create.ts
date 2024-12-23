//引入终端交互
import { input, select } from '@inquirer/prompts'
import { clone } from '../utils/clone'
import path from 'path'
import fs from 'fs-extra'
import { name, version } from '../../package.json'
import { isOverwrite } from '../utils/isOverwrite'
import { checkVersion } from '../utils/checkVersion'
//项目模版
export interface TemplateInfo {
    name: string;//模版名称
    downloadUrl: string;//下载地址
    description: string;//描述
    branch: string;//分支
}

//模版列表
export const templates: Map<string, TemplateInfo> = new Map([
    ['vite-vue3-typescript-template', {
        name: 'vite-vue3-typescript-template',
        downloadUrl: 'git@gitee.com:sun-kelin/vue-infrastructure.git',
        description: 'Vue3 技术栈开发模版',
        branch: 'master'
    }],
    ['vite-template', {
        name: 'vite-vue3-typescript-template',
        downloadUrl: 'git@gitee.com:sun-kelin/vue-infrastructure.git',
        description: 'Vue 技术栈开发模版',
        branch: 'dev-rocky'
    }],
    ['vite-vue3-Vant-typescript-h5-template', {
        name: 'vite-vue3-Vant-typescript-h5-template',
        downloadUrl: 'git@gitee.com:sun-kelin/vue-infrastructure.git',
        description: 'Vue H5 技术栈开发模版',
        branch: 'h5'
    }]
])


//创建
export async function create(projectName?: string) {
    // console.log('创建项目名称: ', projectName)
    //初始化模版列表
    const templateList = Array.from(templates).map(item => {
        const [name, info] = item
        return {
            name,
            value: name,
            description: info.description
        }
    })
    //如果没有输入项目名称，提示输入
    //需要终端交互 @inquirer/prompts
    if (!projectName) {
        projectName = await input({ message: '请输入项目名称', })
    }

    //如果文件夹已经存在，提示是否覆盖
    const filePath = path.resolve(process.cwd(), projectName)
    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(projectName)
        if (run) {
            //删除文件夹
            fs.removeSync(filePath)
        } else {
            return//取消，不做任何处理
        }
    }
    //检测版本更新
    await checkVersion(name, version)

    //获取响应的模版，选择模版
    const templateName = await select({
        message: '请选择模版',
        choices: templateList //模版列表
    })

    const info = templates.get(templateName)

    if (info) {//如果info存在，clone 代码
        await clone(info.downloadUrl, projectName, ['-b', info.branch])
    }

}