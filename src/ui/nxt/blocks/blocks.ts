import * as motors from './motors'
import * as nxt_brick from './nxt_brick'

export const blocks = Object.assign(
    {},
    motors.blocks,
    nxt_brick.blocks,
)
