<template>
  <div class="home">
    <div class="home-card">
      <router-link class="home-link" to="/tablelist">
        数据列表
      </router-link>
    </div>
    <!-- <div class="home-card">
      <router-link class="home-link" to="/canvas">
        Canvas图表
      </router-link>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  text-align: center;
  .home-card {
    width: 200px;
    margin: 50px 50px;
    display: inline-block;
    box-shadow: 1px 1px 5px #999999;
    border-radius: 8px;
    &:hover {
      cursor: pointer;
      box-shadow: 1px 1px 5px #555555;
    }
  }
  .home-link {
    padding: 20px 20px;
    color: #333333;
    text-decoration: none;
    display: block;
  }
}
</style>
