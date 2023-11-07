import * as Blockly from 'blockly'
import './blockly/nxt/nxt'
import { nxcGenerator } from './blockly/generators/nxc'

const TOOLBOX: Blockly.utils.toolbox.ToolboxInfo = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Blocks',
            contents: [
                {
                    kind: 'block',
                    type: 'nxt_motor_speed',
                    inputs: {
                        SPEED: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: 50,
                                },
                            },
                        },
                    }
                },
                {
                    kind: 'block',
                    type: 'nxt_motor_rotate',
                    fields: {
                        UNIT: "REV"
                    },
                    inputs: {
                        AMOUNT: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: 2
                                }
                            }
                        },
                        POWER: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: 50,
                                },
                            },
                        },
                    }
                },
                {
                    kind: 'block',
                    type: 'math_number'
                }
            ]
        },
    ]
}

const workspace = Blockly.inject("blocklyDiv", { toolbox: TOOLBOX })

const updateCodeEvents = new Set([
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
    Blockly.Events.CHANGE,
])

function debounce<T extends unknown[]>(func: (...args: T) => void, timeout = 300) {
    let timer: NodeJS.Timeout
    return (...args: T): void => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(...args)
        }, timeout)
    }
}

const compileCode = debounce((code: string) => {
    window.api
        .compileFile(code)
        .then(success => console.log("compilation", success))
}, 1000)

export function updateCode(event: Blockly.Events.Abstract) {
    if (workspace.isDragging()) return
    if (!updateCodeEvents.has(event.type)) return

    try {
        const code = nxcGenerator.workspaceToCode(workspace)
        compileCode(code)
    } catch (e) {
        console.error(e)
    }

    const state = Blockly.serialization.workspaces.save(workspace)
    localStorage.setItem('workspace', JSON.stringify(state))
    console.log("saved")
}

workspace.addChangeListener(updateCode)

workspace.addChangeListener(Blockly.Events.disableOrphans)

const state = localStorage.getItem('workspace')
if (state) {
    try {
        Blockly.serialization.workspaces.load(JSON.parse(state), workspace)
    } catch (e) {
        console.error(e)
    }
    console.log("loaded", JSON.parse(state))
}

if (workspace.getBlocksByType('nxt_brick').length == 0)
    Blockly.serialization.blocks.append({ type: 'nxt_brick' }, workspace)
