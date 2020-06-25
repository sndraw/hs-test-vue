<template>
  <div class="table-wrap">
    <div class="table-head">
      <div class="list-th list-num">Num</div>
      <div class="list-th list-title">Title</div>
      <div class="list-th list-id">ID</div>
      <div class="list-th list-code">Code</div>
      <div class="list-th list-percent">Percent</div>
      <div class="list-th list-count">Count</div>
      <div class="list-th list-date">Create Date</div>
    </div>
    <div class="table-body" :ref="tableName">
      <div class="table-list" :style="{ minHeight: listHeight }">
        <div
          :class="[
            'list-row',
            {
              selected: selectedRowNum === item.num
            }
          ]"
          v-for="(item, index) in displayList"
          :key="index"
          :data-id="tableName + '-row-' + item.num"
          :style="getRowStyle(item.num)"
          @click="selectRowEvent(item.num)"
        >
          <div class="list-cell list-num">{{ item.num }}</div>
          <div class="list-cell list-title">{{ item.title }}</div>
          <div class="list-cell list-id">{{ item.id }}</div>
          <div class="list-cell list-code">{{ item.code }}</div>
          <div class="list-cell list-percent">{{ item.percent }}</div>
          <div class="list-cell list-count">{{ item.count }}</div>
          <div class="list-cell list-date">
            {{ item.createTime | dateFormat }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格name
      tableName: 'table-list',
      // 表格滚动Top
      tableScrollTop: 0,
      // 表格高度
      tableHeight: 0,
      // 数据列表
      list: [],
      // 行数
      rowCount: 5000,
      // 行高
      rowHeight: 43,
      // 选中行号
      selectedRowNum: 0,
      // 滚动结束定时器
      scrollEndTimer: null
    };
  },
  computed: {
    // 列表高度
    listHeight() {
      return this.rowHeight * this.rowCount + 'px';
    },
    // 展示列表
    displayList() {
      // 原始列表
      const list = this.list;
      // 表格scrollTop
      const tableScrollTop = this.tableScrollTop;
      // 表格高度
      const tableHeight = this.tableHeight;
      // 行高
      const rowHeight = this.rowHeight;
      // 结束展示索引
      const startIndex =
        Math.ceil(tableScrollTop / rowHeight) > 0
          ? Math.ceil(tableScrollTop / rowHeight - 1)
          : 0;
      // 结束展示索引
      const endIndex = startIndex + Math.floor(tableHeight / rowHeight) + 1;
      // 获取展示列表
      const displayList = list.slice(startIndex, endIndex);
      return displayList;
    }
  },
  filters: {
    // 日期格式化
    dateFormat(time) {
      const date = new Date(time);
      let fmt = 'YYYY-mm-dd HH:MM';
      let ret;
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
      };
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          );
        }
      }
      return fmt;
    }
  },
  mounted() {
    this.initData();
    this.bindEvent();
    this.$nextTick(() => {
      this.changeTableScrollPostion();
    });
  },
  beforeDestroy() {
    this.unbindEvent();
  },
  methods: {
    // 初始化数据
    initData() {
      const list = [];
      for (let i = 0; i < this.rowCount; i++) {
        list.push({
          num: i + 1,
          id: (i + 1).toString().padStart(6, '0'),
          title: String.fromCharCode(i + 30000),
          code: ((Math.random() * Math.pow(36, 4)) << 0).toString(36),
          percent: (Math.random() * 100).toFixed(2) + '%',
          count: (Math.random() * 100000) << 0,
          createTime: new Date().getTime()
        });
      }
      this.list = list;
    },
    // 选择数据行
    selectRowEvent(num) {
      this.selectedRowNum = num;
    },
    // 绑定事件
    bindEvent() {
      this.bindKeyDownEvent();
      this.bindResizeEvent();
      this.bindScrollEvent(this.$refs[this.tableName]);
    },
    // 卸载事件
    unbindEvent() {
      this.unbindKeyDownEvent();
      this.unbindResizeEvent();
      this.unbindScrollEvent(this.$refs[this.tableName]);
    },
    // 绑定-鼠标按键-监听事件
    bindKeyDownEvent() {
      document.addEventListener('keyup', this.keyDownEvent);
    },
    // 卸载-键盘按键-监听事件
    unbindKeyDownEvent() {
      document.removeEventListener('keyup', this.keyDownEvent);
    },
    // 绑定-滚动-监听事件
    bindScrollEvent(el) {
      el.addEventListener('scroll', this.scrollEvent);
    },
    // 卸载-滚动-监听事件
    unbindScrollEvent(el) {
      el.removeEventListener('scroll', this.scrollEvent);
    },
    // 绑定-屏幕缩放-监听事件
    bindResizeEvent() {
      window.addEventListener('resize', this.resizeEvent);
    },
    // 卸载-屏幕缩放-监听事件
    unbindResizeEvent() {
      window.removeEventListener('resize', this.resizeEvent);
    },
    // 键盘按键-事件
    keyDownEvent(event) {
      event.stopPropagation();
      event.preventDefault();
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 37:
          console.log('left');
          break;
        case 38:
          if (this.selectedRowNum > 1) {
            this.selectedRowNum--;
            this.$nextTick(() => {
              this.scrollToRow(this.selectedRowNum);
            });
          }
          console.log('up');
          break;
        case 39:
          console.log('right');
          break;
        case 40:
          if (this.selectedRowNum < this.rowCount) {
            this.selectedRowNum++;
            this.$nextTick(() => {
              this.scrollToRow(this.selectedRowNum);
            });
          }
          console.log('down');
          break;
      }
    },
    // 滚动-事件
    scrollEvent(event) {
      this.changeTableScrollPostion();
    },
    // 屏幕缩放-事件
    resizeEvent(event) {
      this.changeTableScrollPostion();
    },
    // 修改表格滚动条信息
    changeTableScrollPostion() {
      const tableEl = this.$refs[this.tableName];
      this.tableScrollTop = tableEl.scrollTop;
      this.tableHeight = tableEl.clientHeight;
    },
    // 滚动到指定行数据
    scrollToRow(rowNum) {
      const tableEl = this.$refs[this.tableName];
      tableEl.scroll({
        top: rowNum * this.rowHeight - tableEl.clientHeight / 2,
        behavior: 'smooth'
      });
    },
    // 获取行样式
    getRowStyle(rowNum) {
      return {
        top: (rowNum - 1) * this.rowHeight + 'px'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.table-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #161520;
  display: flex;
  flex-direction: column;
  .table-head {
    height: 40px;
    color: #ffffff;
    padding-right: 10px; //右侧滚动条宽度，防止表头和表格列宽不对齐
    background-color: #000000;
    display: flex;
  }
  .table-body {
    flex: 1;
    overflow-x: auto;
    overflow-y: scroll; // 默认滚动条
  }
  .table-list {
    width: 100%;
    box-sizing: border-box;
    color: #ffffff;
    position: relative;
    overflow: hidden;
  }
  .list-th {
    padding: 10px;
    font-weight: bold;
    text-align: center;
    border: 1px solid #0a0d13;
  }
  .list-row {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    &.selected {
      background-color: #27245a;
    }
  }
  .list-cell {
    padding: 10px;
    text-align: center;
    border: 1px solid #0a0d13;
    &.list-percent {
      color: red;
    }
    &.list-count {
      color: orange;
    }
  }
  .list-num {
    width: 10%;
  }
  .list-title {
    width: 15%;
  }
  .list-id {
    width: 20%;
  }
  .list-code {
    width: 10%;
  }
  .list-count {
    width: 15%;
  }
  .list-percent {
    width: 10%;
  }
  .list-date {
    width: 20%;
  }
}
::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #333333;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  // border-radius: 10px;
  background: #161520;
}
</style>
