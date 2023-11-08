/// <reference types="svelte" />

import styles from './app.module.scss'

import './index.css'
import './renderer/ui'

window.api.onBricksChanged(console.log)
