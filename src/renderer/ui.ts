import './ui/blockly';
import App from './ui/components/App.svelte';

const appElem = document.getElementById('app') ?? document.body;

const app = new App({
    target: appElem,
    props: {
        name: 'world'
    }
});
