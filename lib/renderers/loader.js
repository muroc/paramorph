"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var server_1 = require("react-dom/server");
var vm_1 = require("vm");
var ContextContainer_1 = require("./ContextContainer");
var LoaderRenderer = /** @class */ (function () {
    function LoaderRenderer(history, paramorph, loadSource) {
        this.history = history;
        this.paramorph = paramorph;
        this.loadSource = loadSource;
    }
    LoaderRenderer.prototype.render = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var request, component, element, props, container;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = "@website" + page.source.substring(1);
                        return [4 /*yield*/, this.loadComponent(request)];
                    case 1:
                        component = _a.sent();
                        element = react_1.createElement(component, { respectLimit: false });
                        props = {
                            history: this.history,
                            paramorph: this.paramorph,
                            page: page,
                        };
                        container = react_1.createElement(ContextContainer_1.ContextContainer, props, element);
                        return [2 /*return*/, server_1.renderToStaticMarkup(element)];
                }
            });
        });
    };
    LoaderRenderer.prototype.loadComponent = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var source, componentModule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSource(request)];
                    case 1:
                        source = _a.sent();
                        componentModule = this.eval(request, source);
                        if (!componentModule.hasOwnProperty('default')) {
                            throw new Error("Module '" + request + " must contain a default export...'");
                        }
                        return [2 /*return*/, componentModule.default];
                }
            });
        });
    };
    LoaderRenderer.prototype.eval = function (filename, source) {
        var sandbox = {};
        var exports = {};
        sandbox.exports = exports;
        sandbox.require = require;
        sandbox.module = {
            exports: exports,
            filename: filename,
            id: filename,
            parent: module.parent,
            require: sandbox.require,
        };
        sandbox.global = sandbox;
        var options = {
            filename: filename,
            displayErrors: true,
        };
        var script = new vm_1.Script(source, options);
        script.runInNewContext(sandbox, options);
        return sandbox.module.exports;
    };
    return LoaderRenderer;
}());
exports.LoaderRenderer = LoaderRenderer;
exports.default = LoaderRenderer;
//# sourceMappingURL=loader.js.map