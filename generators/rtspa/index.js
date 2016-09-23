var generators = require('yeoman-generator')
var mkdirp = require('mkdirp');
var utils = require('../utils');
var path = require('path');

module.exports = generators.Base.extend({
  prompting: function () {
    var prompts = [{
      type: 'confirm',
      name: 'createFeDir',
      message: 'Create files in `fe` dir?'
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  default: function () {
    this.composeWith('incpad:babel', {
      options: {}
    }, {
      local: require.resolve('../babel')
    })
  },

  writing: function () {
    var self = this;
    var isFeDir = this.props.createFeDir;
    var createPath = utils.createPath.bind(null, isFeDir);
    [
      'src',
      'src/page',
      'src/page/app',
      'src/page/home',
      'src/page/list',
      'src/page/detail',
      'src/module',
      'src/component',
      'demo'
    ].forEach(function(item) {
      mkdirp(createPath(item));
    });

    [
      'src/index.js',
      'src/index.less',
      'src/page/app/index.js',
      'src/page/app/index.less',
      'src/page/home/index.js',
      'src/page/detail/index.js',
      'src/page/list/index.js',
      'demo/index.html'
    ].forEach(function(item) {
      utils.copyFile(self, item, createPath(item));
    });

    utils.copyFile(this, isFeDir ? 'fe.webpack.config.js' : 'webpack.config.js', 'webpack.config.js');

    var deps = {
      "babel-polyfill": "^6.9.1",
      "react": "^15.3.0",
      "react-dom": "^15.3.0",
      "react-router": "^2.6.1"
    };
    var devDeps = {
      "assets-webpack-plugin": "^3.4.0",
      "autoprefixer": "^6.4.0",
      "babel-core": "^6.11.4",
      "babel-loader": "^6.2.4",
      "babel-preset-es2015": "^6.9.0",
      "babel-preset-react": "^6.11.1",
      "babel-preset-stage-0": "^6.5.0",
      "css-loader": "^0.23.1",
      "extract-text-webpack-plugin": "^1.0.1",
      "file-loader": "^0.9.0",
      "less": "^2.7.1",
      "less-loader": "^2.2.3",
      "postcss-loader": "^0.9.1",
      "mustache-loader": "^0.3.1",
      "style-loader": "^0.13.1",
      "url-loader": "^0.5.7",
      "webpack": "^1.13.1",
      "webpack-dev-server": "^1.14.1"
    };
    utils.writeDependencies(this, deps, devDeps)
    utils.extendPackageJSON(this, {
      "main": "src/index.js",
      "scripts": {
        "dev": "webpack-dev-server --port 8823 --inline --content-base " + path.join((isFeDir ? './fe' : './'), 'demo'),
        "watch": "webpack --progress --colors --watch",
        "build": "webpack -p"
      }
    });
  },

  install: function () {
    this.npmInstall();
  }
})
