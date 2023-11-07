import { NXCGenerator } from "./nxc/nxc_generator"
import * as tasks from "./nxc/tasks"
import * as logic from "./nxc/logic"
import * as loops from "./nxc/loops"
import * as main from "./nxc/main"
import * as motors from "./nxc/motors"
import * as math from "./nxc/math"

export const nxcGenerator = new NXCGenerator()

Object.assign(nxcGenerator.forBlock, tasks, logic, loops, main, motors, math)
