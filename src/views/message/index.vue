<template>
  <div class="message">
    <h3 class="page-title">
      消息
      <!-- <span class="create">创建聊天</span> -->
    </h3>
    <div class="top-func">
      <span
        v-for="item in feature"
        :key="item.key"
        @click="iconPage(item.key)"
      >
        <!-- <i :class="item['icon']"></i> -->
        <!-- <img :src="item.icon" alt=""> -->
        <svg-icon :icon-class="item.icon"></svg-icon>
        <span>{{ item.text }}</span>
      </span>
    </div>
    <div class="frame">
      <div class="message-item" v-for="item in chatRecord" :key="item.receiver._id" @click="enterChatFrame(item)">
        <span class="avatar"><img :src="item.receiver.avatar" alt=""></span>
        <span class="text">
          <p>{{ item.receiver.name }}</p>
          <p>{{ item.chat_record[item.chat_record.length - 1].content[item.chat_record[item.chat_record.length - 1].content.length - 1].data }}</p>
          <p class="date">{{ item.chat_record[item.chat_record.length - 1].date }}</p>
          <a-icon type="delete" @click.stop="handlerDelete(item)" />
        </span>
      </div>
    </div>
    <a-drawer
      placement="right"
      :visible="drawerData.isShow"
      height="100%"
      width="100%"
      :closable="false"
      @close="drawerData.isShow = false"
    >
      <a-page-header
        :title="drawerData.data.receiver.name"
        @back="drawerData.isShow = false"
        slot="title"
      />
      <scroll class="chat-scroll" ref="chat-scroll">
        <div v-for="item in drawerData.data.chat_record" :key="item.date">
          <div style="color: #666;text-align: center;margin-bottom:10px;">{{ item.date }}</div>
            <div class="chat-box" v-for="(msg, index) in item.content" :key="index">
              <!-- 用户1发的信息且当前用户为用户1，用户2发的信息且当前用户为用户2 -->
              <div class="right-box" v-if="(msg.isUser1 && drawerData.data.isUser1) || (!msg.isUser1 && !drawerData.data.isUser1)">
                <div class="message">
                  {{ msg.data }}
                </div>
                <span class="avatar">
                  <img :src="user.avatar" alt="">
                </span>
              </div>
              <div class="left-box" v-else>
                <span
                  class="avatar"
                  @click="$router.push({ name: 'userDetail', params:{ id: drawerData.data.receiver._id } })"
                >
                  <img :src="drawerData.data.receiver.avatar" alt="">
                </span>
                <div class="message">
                  {{ msg.data }}
                </div>
              </div>
          </div>
        </div>
      </scroll>
      <div class="input-box">
        <a-input placeholder="请输入文字..." v-model="message" />
        <a-button type="primary" @click="emitMsg">发送</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import Api from '@/api';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      feature: [
        {
          icon: 'aixin',
          text: '赞和收藏',
          key: 'appreciates',
        },
        {
          icon: 'user',
          text: '新增关注',
          key: 'focus',
        },
        {
          icon: 'message',
          text: '评论和@',
          key: 'comment',
        },
      ],
      message: '',
      chatRecord: [],
      drawerData: {
        isShow: false,
        data: {
          chat_record: [],
          receiver: {},
          isUser1: false,
        },
      },
      refreshKey: Math.random(),
      ws: new WebSocket('ws://192.168.0.110:8001'),
    };
  },
  watch: {
    drawerData: {
      handler(newVal, oldVal) {
        console.log(this.$refs['chat-scroll']);
        if (this.$refs['chat-scroll']) {
          this.$nextTick(() => {
            this.$refs['chat-scroll'] && this.$refs['chat-scroll'].refresh();
            this.$refs['chat-scroll'] && this.$refs['chat-scroll'].scrollToBottom();
          })
        } else {
          setTimeout(() => {
            this.$refs['chat-scroll'] && this.$refs['chat-scroll'].scrollToBottom(500);
          }, 1000);
        }

      },
      deep: true,
    }
  },
  computed: {
    ...mapGetters('user', {
      user: 'GET_USER_INFO',
    }),
  },
  methods: {
    iconPage(key) {
      const map = {
        appreciates: 'newAppreciates',
        focus: 'newFocus',
        comment: 'newComment',
      }
      this.$router.push({ name: map[key] });
    },
    async emitMsg() {      
      await this.ws.send(JSON.stringify({
        type: "message",        // type:message 表示发送信息 后端逻辑判断用
        to: this.drawerData.data.receiver._id,     // 需要发送给谁
        from: this.user._id,
        date: this.$moment().format('YYYY-MM-DD'),
        message: this.message, // 需要发送的内容
      }))
      this.refreshMsg({
        msg: this.message,
        isUser1: this.drawerData.data.isUser1,
        from: this.user._id,
      }, true);
      this.message = '';
    },
    handlerDelete(data) {
      const params = {
        data: {
          user1_id: data.isUser1 ? this.user._id : data.receiver._id,
          user2_id: data.isUser1 ? data.receiver._id : this.user._id,
        }
      }
      Api.chat.deleteChat(params)
        .then(res => {
          if (res.status === 200) {
            this.chatRecord = this.chatRecord.filter(item => item.receiver._id !== data.receiver._id);
          }
        });
    },
    getUserChatRecord() {
      Api.chat.getChatList(this.user._id)
        .then(async res => {
          this.chatRecord = res.data;
          const id = this.$route.params.id;
          // 若路由携带id则直接进入聊天框
          if (id) {
            this.drawerData.isShow = true;
            if (this.chatRecord.some(item => item.receiver._id === id)) {
              this.drawerData.data = this.chatRecord.find(item => item.receiver._id === id);
            } else {
              const data = await Api.chat.createChat({
                user1_id: this.user._id,
                user2_id: id,
                date: this.$moment().format('YYYY-MM-DD'),
              });
              this.drawerData.data = data.data;
              this.chatRecord.push(data.data);
              this.ws.send(JSON.stringify({
                type: 'refresh',
                to: this.drawerData.data.receiver._id,     // 需要发送给谁
                from: this.user._id,
              }))
            }
          }
        })
    },
    enterChatFrame(data) {
      this.drawerData.isShow = true;
      this.drawerData.data = data;
      console.log(data);
    },
    refreshMsg(res, isSend = false) {
      let user;
      if (isSend) {
        user = this.drawerData.data
      } else {
        user = this.chatRecord.find(item => item.receiver._id === res.from);
      }
      const { length } = user.chat_record;
      
      if (user.chat_record[length - 1].date === this.$moment().format('YYYY-MM-DD')) {
        const data = user.chat_record[length - 1];
        data.content.push({
          data: res.msg,
          isUser1: res.isUser1,
        });
      } else {
        const data = {
          date: this.$moment().format('YYYY-MM-DD'),
          content: [{
            data: res.msg,
            isUser1: res.isUser1,
          }]
        };
        user.chat_record.push(data);
      }
    },
  },
  created() {
    this.getUserChatRecord();
    // 连接服务器
    this.ws.onopen = () => {
      console.log(this.ws);
      
      this.ws.send(JSON.stringify({
        type: 'login',
        user: this.user._id,
      }))
    }  
    this.ws.onmessage = (message) => {
      const res = JSON.parse(message.data);
      // 新消息刷新列表
      console.log(res);
      
      if (res.type === 'refresh') {
        this.getUserChatRecord();
      } else {
        this.refreshMsg(res);
      }
      // let user = this.chatRecord.find(item => item.receiver._id === res.from);
      // const { length } = user.chat_record;
      
      // if (user.chat_record[length - 1].date === this.$moment().format('YYYY-MM-DD')) {
      //   const data = user.chat_record[length - 1];
      //   data.content.push({
      //     data: res.msg,
      //     isUser1: res.isUser1,
      //   });
      // } else {
      //   const data = {
      //     date: this.$moment().format('YYYY-MM-DD'),
      //     content: [{
      //       data: res.msg,
      //       isUser1: res.isUser1,
      //     }]
      //   };
      //   user.chat_record.push(data);
      // }
    }
  },
  mounted() {

  },
};
</script>

<style lang="scss">
.ant-drawer {
  &-header {
    z-index: 9999;
    .ant-page-header {
      position: relative;
      padding: 0;
    }
  }
  .chat-scroll {
    height: calc(100vh - 96px - 24px - 20px);
    overflow: hidden;
    .chat-box {
      .right-box,.left-box {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        .avatar {
          width: 5vh;
          height: 5vh;
          border-radius: 50% 50%;
          overflow: hidden;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .message {
          max-width: calc(100% - 10vh - 8vw);
        }
        &:nth-last-child(1) {
          margin-bottom: 24px;
        }
      }
      .right-box {
        display: flex;
        justify-content: flex-end;
        .avatar {
          margin-left: 4vw;
        }
      }
      .left-box {
        .avatar {
          margin-right: 4vw;
        }
      }
    }
  }
  .input-box {
    width: 100%;
    position: fixed;
    bottom: -2px;
    left: 0;
    display: flex;
    padding: 0 10px 10px;
    background-color: #fff;
    z-index: 9999;
    .ant-btn {
      margin-left: 10px;
    }
  }
}
</style>

<style lang='scss' scoped>
.message {
  .top-func {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 5vh 10vw 0;
    padding-bottom: 5vh;    
    & > span {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 66px;
      height: 66px;
      // font-size: 20px;
      text-align: center;
      svg {
        font-size: 35px;
      }
      &:nth-child(2) {
        svg {
          margin-top: -5px;
          font-size: 46px;
        }
      }
    }
  }
  .frame {
    height: 10vh;
    margin: 0 4vw;
    border-top: 1px solid #ccc;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 8vh;
    padding: 2vh;
    // border-bottom: 1px solid #eee;
    box-sizing: content-box;
    .message-item {
      position: relative;
      width: 100%;
      margin-bottom: 10px;
      .avatar {
        display: inline-block;
        width: 6vh;
        height: 6vh;
        margin: 0 3vw;
        border-radius: 50% 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .text {
        display: inline-block;
        p {
          line-height: 3vh;
          margin: 0;
          &:nth-child(1) {
            margin-bottom: 4px;
          }
          &:nth-child(2) {
            color: #999;
          }
        }
        .date {
          position: absolute;
          right: 3vw;
          top: 50%;
          transform: translateY(-50%);
        }
        .anticon-delete {
          position: absolute;
          right: -3vw;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

  }
}
</style>
