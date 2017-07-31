/**
 * 组件类: 人员选择器
 * 作者: yuronghui
 * 创建日期: 2017/6/29
 */
import './asset/index.scss';

class ComView extends Lego.UI.Baseview {
    constructor(opts = {}) {
        const options = {
            name: '',
            addBtnText: '添加人员+',
            modalTitle: '选择人员',
            deleteAble: true,    //标签是否可以关闭
            readonly: false,    //是否只读
            value: [],
            data: [],
            onDelete(){},
            onChange(){},
            onClean(){}
        };
        Object.assign(options, opts);
        if(!options.data.length && options.value.length) options.data = options.value;
        super(options);
    }
    components(){
        let opts = this.options,
            that = this;
        if(opts.data){
            this.addCom([{
                el: '#tags_' + opts.vid,
                addBtnText: opts.addBtnText,
                addBtnOption: {
                    className: 'btn-capsule'
                },
                readonly: opts.readonly,
                deleteAble: opts.deleteAble,
                data: opts.data,
                onAdd(self, event) {
                    let users = self.getValue();
                    users.forEach((user, index) => {
                        user.key = user.key.toString().indexOf('u_') > -1 ? user.key : ('u_' + user.key);
                    });
                    that.addEmployee(users);
                },
                onDelete(self, id) {
                    Lego.UI.modal({
                        msgType: 'warning',
                        title: '提示信息',
                        content: '你确定要删除此人员吗?',
                        onOk(_self) {
                            that.removeItem(id);
                            if(typeof opts.onDelete == 'function') opts.onDelete(that, id);
                            _self.close();
                        }
                    });
                },
                onClean(self, event){
                    that.cleanAll();
                    if(typeof opts.onClean == 'function') opts.onClean(that, event);
                }
            }]);
        }
    }
    render() {
        let opts = this.options,
            vDom = hx`
        <div class="lego-employee">
            <input type="hidden" name="${opts.name}" value="${opts.value.map(item => item.value).join(',')}"/>
            <tags id="tags_${opts.vid}"></tags>
        </div>
        `;
        return vDom;
    }
    // 清空所有
    cleanAll(){
        let opts = this.options;
        opts.value = [];
        let tagsView = Lego.getView(`#tags_${opts.vid}`);
        if(tagsView) tagsView.cleanAll();
        if(typeof opts.onChange == 'function') opts.onChange(this, this.getValue());
        this.refresh();
    }
    addItem(obj = {}){
        let opts = this.options;
        let hasOne = opts.value.find(item => item.key == obj.key);
        if(!hasOne){
            opts.value.push(obj);
            let tagsView = Lego.getView(`#tags_${opts.vid}`);
            if(tagsView) tagsView.addItem(obj);
            if(typeof opts.onChange == 'function') opts.onChange(this, this.getValue());
            this.refresh();
        }
    }
    removeItem(id){
        let opts = this.options;
        opts.value = opts.value.filter(item => {
            return item.key ? item.key.toString() !== id : false;
        });
        let tagsView = Lego.getView(`#tags_${opts.vid}`);
        if(tagsView) tagsView.removeItem(id);
        if(typeof opts.onChange == 'function') opts.onChange(this, this.getValue());
        this.refresh();
    }
    getValue(){
        let opts = this.options,
            inputEl = this.$('input[name=' + opts.name + ']'),
            theValue = opts.value.map(item => item.value);
        inputEl.val(theValue.join(',')).valid();
        return opts.value;
    }
    // 添加人员
    addEmployee(data) {
        let opts = this.options,
            that = this;
        Lego.UI.modal({
            title: opts.modalTitle,
            content: hx `<transfer id="charger_${opts.vid}"></transfer>`,
            isMiddle: true,
            width: 450,
            height: 300,
            backdrop: true,
            components: [{
                el: '#charger_' + opts.vid,
                titles: ['全部人员', '已添加人员'],
                height: 300,
                onChange(self, result) {
                    this.context.selectedArr = result;
                },
                filterParentNode: true,
                showSearch: 'fixed',
                treeSetting: {
                    data: {
                        simpleData: {
                            enable: true,
                            rootPId: 'd_-1'
                        }
                    },
                },
                treeType: 'userSelect',
                dataSource: {
                    api: 'organization',
                    server: window.publicData
                },
                value: data
            }],
            onOk(self) {
                if (self.selectedArr) {
                    let tagsView = Lego.getView('#tags_' + opts.vid);
                    if (tagsView) {
                        tagsView.options.data = opts.value = self.selectedArr;
                        tagsView.refresh();
                        if(typeof opts.onChange == 'function') opts.onChange(that, that.getValue());
                    }
                }
                self.close();
            }
        });
    }
}
Lego.components('employee', ComView);
export default ComView;
