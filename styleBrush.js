const E = window.wangEditor;
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E;

let isMouseDown = false;
let isBrushOn = false;

class AlertMenu extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = E.$(
      `<div class="w-e-menu" data-title="格式刷">
      <i class="iconfont icon-geshishua"></i>
            </div>`,
    );
    super($elem, editor);
    this.editor = editor;
  }
  // 菜单点击事件
  clickHandler() {
    if (this.editor.selection.isSelectionEmpty()) return;
    let domToParse = this.editor.selection.getSelectionContainerElem().elems[0];
    this.editor.copyStyleList = parseDom(domToParse);
    // 做任何你想做的事情
    // 可参考【常用 API】文档，来操作编辑器
    if (isBrushOn) {
      this.unActive();
    } else {
      this.active();
    }
    isBrushOn = !isBrushOn;
  }
  // 菜单是否被激活（如果不需要，这个函数可以空着）
  // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
  // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
  tryChangeActive() {
    // 激活菜单
    // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
    // 2. this.this.isActive === true
    //   this.active();
    // // 取消激活菜单
    // // 1. 菜单 DOM 节点会删掉 .w-e-active
    // // 2. this.this.isActive === false
    // this.unActive()
  }
}

//粘贴
function pasteStyle(editor) {
  let text = editor.selection.getSelectionText();
  let targetDom = addStyle(text, editor.copyStyleList);
  editor.cmd.do('insertHTML', targetDom.outerHTML);
}
// 菜单 key ，各个菜单不能重复
const menuKey = 'brushKey';

// 注册菜单
E.registerMenu(menuKey, AlertMenu);
window.onload = function () {
  const editor = new E('#div1');
  // 或者 const editor = new E( document.getElementById('div1') )
  editor.create();
  document.querySelector('.w-e-text').addEventListener('mousedown', () => {
    isMouseDown = true;
  });
  document.querySelector('.w-e-text').addEventListener('mouseup', () => {
    if (isBrushOn && isMouseDown) {
      pasteStyle(editor);
      isBrushOn = false;
      document.querySelector("[data-title='格式刷']").classList.remove('w-e-active');
    }
    isMouseDown = false;
  });
};
