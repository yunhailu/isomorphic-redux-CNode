
// require('babel-register');

require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3']
})

const Webpack_isomorphic_tools = require('webpack-isomorphic-tools')
const project_base_path = require('path').join(__dirname, '..')
global.webpack_isomorphic_tools = new Webpack_isomorphic_tools(require('../webpack/webpack-isomorphic-tools-configuration'))
    .server(project_base_path)
    .then(()=>{
        require('./app');
    })
    