<template>
  <div class="table-wrap" :ref="tableName">
    <div class="table-list">
      <div class="list-thead">
        <div class="list-th">Num</div>
        <div class="list-th">ID</div>
        <div class="list-th">Title</div>
        <div class="list-th">Code</div>
        <div class="list-th">Create Date</div>
      </div>
      <div
        :class="['list-row',{
          selected:selectedRowNum===item.num
      }]"
        v-for="(item,index) in displayList"
        :key="index"
        :data-id="tableName+'-row-'+item.num"
        @click="selectRowEvent(item.num)"
      >
        <div class="list-cell">{{item.num}}</div>
        <div class="list-cell">{{item.id}}</div>
        <div class="list-cell">{{item.title}}</div>
        <div class="list-cell">{{item.code}}</div>
        <div class="list-cell">{{item.createTime | dateFormat}}</div>
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
      // 数据列表
      list: [],
      // 行数
      rowCount: 5000,
      // 每页数量
      pageSize: 50,
      // 当前页码
      pageNum: 1,
      // 选中行号
      selectedRowNum: 0,
      // 滚动结束定时器
      scrollEndTimer: null
    };
  },
  computed: {
    // 页码总数
    pageCount() {
      return Math.floor(this.rowCount / this.pageSize);
    },
    //   展示列表
    displayList() {
      const list = this.list;
      const pageSize = this.pageSize;
      const pageNum = this.pageNum;
      // // 开始展示页码
      // const startPageNum = pageNum - 2 > 0 ? pageNum - 2 : 0;
      // // 开始展示索引
      // const startIndex = startPageNum > 0 ? startPageNum * pageSize - 1 : 0;
      // 结束展示索引
      const endIndex = pageNum * pageSize;
      // 获取展示列表
      const displayList = list.slice(0, endIndex);
      return displayList;
    }
  },
  filters: {
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
          id: (i + 1).toString().padStart(8, '0'),
          title: String.fromCharCode(i + 30000),
          code: ((Math.random() * Math.pow(36, 4)) << 0).toString(36),
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
      this.bindScrollEvent(this.$refs[this.tableName]);
    },
    // 卸载事件
    unbindEvent() {
      this.unbindKeyDownEvent();
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
          }
          console.log('up');
          break;
        case 39:
          console.log('right');
          break;
        case 40:
          if (this.selectedRowNum < this.rowCount) {
            this.selectedRowNum++;
          }
          console.log('down');
          break;
      }
    },
    // 滚动-事件
    scrollEvent(event) {
      const el = event.target;
      const scrollHeight = el.scrollHeight;
      const scrollTop = el.scrollTop;
      const clientHeight = el.clientHeight;
      const pageNum = this.pageNum;
      const pageCount = this.pageCount;
      // 滚动到底部
      if (clientHeight + scrollTop > scrollHeight - 20) {
        if (pageNum < pageCount) {
          clearTimeout(this.scrollEndTimer);
          this.scrollEndTimer = setTimeout(() => {
            // 改变当前页码
            ++this.pageNum;
            this.$nextTick(() => {
              // 滚动到相应位置
              event.target.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
              });
            });
          }, 50);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table-wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  .table-list {
    width: 100%;
    display: table;
    box-sizing: border-box;
    .list-thead {
      display: table-row;
      background-color: #fdccab;
    }
    .list-th {
      padding: 10px;
      font-weight: bold;
      text-align: center;
      display: table-cell;
      border: 1px solid #beceeb;
    }
    .list-row {
      display: table-row;
      &.selected {
        background-color: #ededed;
      }
    }
    .list-cell {
      padding: 10px;
      text-align: center;
      display: table-cell;
      border: 1px solid #beceeb;
    }
  }
}
</style>