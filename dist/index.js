/**
 * area-picker.js v0.0.14
 * (c) 2017 yuronghui
 * @license MIT
 */
"use strict";

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

var _templateObject = _taggedTemplateLiteral([ '\n        <div class="lego-employee">\n            <input type="hidden" name="', '" value="', '"/>\n            <tags id="tags_', '"></tags>\n        </div>\n        ' ], [ '\n        <div class="lego-employee">\n            <input type="hidden" name="', '" value="', '"/>\n            <tags id="tags_', '"></tags>\n        </div>\n        ' ]);

var _templateObject2 = _taggedTemplateLiteral([ '<transfer id="charger_', '"></transfer>' ], [ '<transfer id="charger_', '"></transfer>' ]);

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ComView = function(_Lego$UI$Baseview) {
    _inherits(ComView, _Lego$UI$Baseview);
    function ComView() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        _classCallCheck(this, ComView);
        var options = {
            name: "",
            addBtnText: "添加人员+",
            modalTitle: "选择人员",
            deleteAble: true,
            readonly: false,
            value: [],
            data: [],
            onDelete: function onDelete() {},
            onChange: function onChange() {},
            onClean: function onClean() {}
        };
        Object.assign(options, opts);
        if (!options.data.length && options.value.length) options.data = options.value;
        return _possibleConstructorReturn(this, (ComView.__proto__ || Object.getPrototypeOf(ComView)).call(this, options));
    }
    _createClass(ComView, [ {
        key: "components",
        value: function components() {
            var opts = this.options, that = this;
            if (opts.data) {
                this.addCom([ {
                    el: "#tags_" + opts.vid,
                    addBtnText: opts.addBtnText,
                    addBtnOption: {
                        className: "btn-capsule"
                    },
                    readonly: opts.readonly,
                    deleteAble: opts.deleteAble,
                    data: opts.data,
                    onAdd: function onAdd(self, event) {
                        var users = self.getValue();
                        users.forEach(function(user, index) {
                            user.key = user.key.toString().indexOf("u_") > -1 ? user.key : "u_" + user.key;
                        });
                        that.addEmployee(users);
                    },
                    onDelete: function onDelete(self, id) {
                        Lego.UI.modal({
                            msgType: "warning",
                            title: "提示信息",
                            content: "你确定要删除此人员吗?",
                            onOk: function onOk(_self) {
                                that.removeItem(id);
                                if (typeof opts.onDelete == "function") opts.onDelete(that, id);
                                _self.close();
                            }
                        });
                    },
                    onClean: function onClean(self, event) {
                        that.cleanAll();
                        if (typeof opts.onClean == "function") opts.onClean(that, event);
                    }
                } ]);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var opts = this.options, vDom = hx(_templateObject, opts.name, opts.value.map(function(item) {
                return item.value;
            }).join(","), opts.vid);
            return vDom;
        }
    }, {
        key: "cleanAll",
        value: function cleanAll() {
            var opts = this.options;
            opts.value = [];
            var tagsView = Lego.getView("#tags_" + opts.vid);
            if (tagsView) tagsView.cleanAll();
            if (typeof opts.onChange == "function") opts.onChange(this, this.getValue());
            this.refresh();
        }
    }, {
        key: "addItem",
        value: function addItem() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var opts = this.options;
            var hasOne = opts.value.find(function(item) {
                return item.key == obj.key;
            });
            if (!hasOne) {
                opts.value.push(obj);
                var tagsView = Lego.getView("#tags_" + opts.vid);
                if (tagsView) tagsView.addItem(obj);
                if (typeof opts.onChange == "function") opts.onChange(this, this.getValue());
                this.refresh();
            }
        }
    }, {
        key: "removeItem",
        value: function removeItem(id) {
            var opts = this.options;
            opts.value = opts.value.filter(function(item) {
                return item.key ? item.key.toString() !== id : false;
            });
            var tagsView = Lego.getView("#tags_" + opts.vid);
            if (tagsView) tagsView.removeItem(id);
            if (typeof opts.onChange == "function") opts.onChange(this, this.getValue());
            this.refresh();
        }
    }, {
        key: "getValue",
        value: function getValue() {
            var opts = this.options, inputEl = this.$("input[name=" + opts.name + "]"), theValue = opts.value.map(function(item) {
                return item.value;
            });
            inputEl.val(theValue.join(",")).valid();
            return opts.value;
        }
    }, {
        key: "addEmployee",
        value: function addEmployee(data) {
            var opts = this.options, that = this;
            Lego.UI.modal({
                title: opts.modalTitle,
                content: hx(_templateObject2, opts.vid),
                isMiddle: true,
                width: 450,
                height: 300,
                backdrop: true,
                components: [ {
                    el: "#charger_" + opts.vid,
                    titles: [ "全部人员", "已添加人员" ],
                    height: 300,
                    onChange: function onChange(self, result) {
                        this.context.selectedArr = result;
                    },
                    filterParentNode: true,
                    showSearch: "fixed",
                    treeSetting: {
                        data: {
                            simpleData: {
                                enable: true,
                                rootPId: "d_-1"
                            }
                        }
                    },
                    treeType: "userSelect",
                    dataSource: {
                        api: "organization",
                        server: window.publicData
                    },
                    value: data
                } ],
                onOk: function onOk(self) {
                    if (self.selectedArr) {
                        var tagsView = Lego.getView("#tags_" + opts.vid);
                        if (tagsView) {
                            tagsView.options.data = opts.value = self.selectedArr;
                            tagsView.refresh();
                            if (typeof opts.onChange == "function") opts.onChange(that, that.getValue());
                        }
                    }
                    self.close();
                }
            });
        }
    } ]);
    return ComView;
}(Lego.UI.Baseview);

Lego.components("employee", ComView);

module.exports = ComView;
