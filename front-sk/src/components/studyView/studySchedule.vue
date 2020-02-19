<template>
  <div id="mycal">
    <div v-if="isAuth">
      <v-row class="ml-4" align="center" justify="center">
        <v-col cols="11" sm="12" offset="1" offset-sm="0">
          <v-expansion-panels style="z-Index:0;">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="ex-title">Calendar</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card class="py-0" flat>
                  <!-- 달력 -->
                  <v-row class="fill-height pt-0">
                    <v-col class="pt-0">
                      <v-sheet height="64">
                        <v-toolbar flat color="white">
                          <v-btn
                            outlined
                            class="mr-4"
                            color="grey darken-2"
                            @click="setToday"
                            >오늘날짜로</v-btn
                          >
                          <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="prev"
                          >
                            <v-icon small>mdi-chevron-left</v-icon>
                          </v-btn>
                          <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="next"
                          >
                            <v-icon small>mdi-chevron-right</v-icon>
                          </v-btn>
                          <v-toolbar-title>{{ title }}</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-menu bottom right>
                            <template v-slot:activator="{ on }">
                              <v-btn outlined color="grey darken-2" v-on="on">
                                <span>{{ typeToLabel[type] }}</span>
                                <v-icon right>mdi-menu-down</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item @click="type = 'day'">
                                <v-list-item-title>일</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="type = 'week'">
                                <v-list-item-title>주</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="type = 'month'">
                                <v-list-item-title>월</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="type = '4day'">
                                <v-list-item-title>4일</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-toolbar>
                      </v-sheet>

                      <!-- 달력 메인 -->
                      <v-sheet height="600">
                        <v-calendar
                          ref="calendar"
                          v-model="focus"
                          color="primary"
                          :events="events"
                          :event-color="getEventColor"
                          :now="today"
                          :type="type"
                          @click:event="true"
                          @click:more="viewDay"
                          @click:date="viewDay"
                          @change="updateRange"
                        ></v-calendar>
                        <v-menu
                          v-model="selectedOpen"
                          :close-on-content-click="false"
                          :activator="selectedElement"
                          offset-y
                          :nudge-right="30"
                          max-width="500px"
                          min-width="350px"
                        >
                          <v-card color="grey lighten-4" flat>
                            <v-toolbar :color="selectedEvent.color" dark>
                              <v-toolbar-title
                                v-html="selectedEvent.name"
                              ></v-toolbar-title>
                              <v-spacer></v-spacer>
                              <div>
                                <v-btn
                                  icon
                                  class="dropPanel"
                                  @click="detail = !detail"
                                >
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                                <div
                                  :class="{ menu: detail }"
                                  class="detaildrop"
                                  style="position:absolute"
                                >
                                  <ul class="pl-0">
                                    <li
                                      v-for="item in detailMenus"
                                      :key="item.title"
                                    >
                                      <v-btn
                                        text
                                        @click="
                                          clickDetailMenu(
                                            item.value,
                                            selectedEvent
                                          )
                                        "
                                      >
                                        <span style="color:black">
                                          {{ item.title }}
                                        </span>
                                      </v-btn>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </v-toolbar>
                            <v-card-text>
                              <p
                                v-text="
                                  selectedEvent.start +
                                    ' ~ ' +
                                    selectedEvent.end
                                "
                                class="text-center"
                              ></p>
                              <span v-html="selectedEvent.content"></span>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="secondary"
                                @click="selectedOpen = false"
                                >Cancel</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </v-menu>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- 이슈 -->
          <v-row class="mt-8">
            <v-col cols="4" v-for="(issue, index) in issues" :key="index">
              <p class="issue-container-title text-center">
                {{ issue.title }}
              </p>
              <!-- 이슈 박스 -->
              <div class="issue-container py-2 px-2">
                <!-- 할일 기능 -->
                <div v-if="issue.title == '할 일'">
                  <!-- 등록 버튼 -->
                  <v-btn
                    class="issue-reg-btn primary white--text mb-4"
                    width="100%"
                    @click="(modal = true), (isUpdate = false)"
                    >일정 등록</v-btn
                  >
                  <!-- 등록버튼 끝 -->
                  <!-- 기본 카드 -->
                  <draggable
                    class="list-default-group"
                    :list="default_items"
                    :group="{ name: 'issue', pull: 'clone', put: false }"
                    v-bind="dragOptions"
                  >
                    <transition-group
                      type="transition"
                      :name="!drag ? 'flip-list' : null"
                    >
                      <div
                        class="list-group-item"
                        v-for="(item, index) in default_items"
                        :key="index"
                      >
                        <v-card
                          class="issue-card default-card"
                          color="redC"
                          @click="
                            (isUpdate = true),
                              (propEvent = item),
                              (modal = true)
                          "
                        >
                          <v-container>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.user_nickname }}
                            </p>
                            <p class="issue-card-title" aria-disabled>
                              {{ item.name }}
                            </p>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.dates | filterDate }}
                            </p>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.start_time }} ~ {{ item.end_time }}
                            </p>
                          </v-container>
                        </v-card>
                      </div>
                    </transition-group>
                  </draggable>
                  <!-- 기본 카드 끝 -->
                </div>
                <!-- 할일 기능 끝 -->
                <!-- 등록된 카드 -->
                <div class="issue-list-container">
                  <draggable
                    class="list-group"
                    :list="issue.items"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                    @change="log($event, issue.title)"
                  >
                    <transition-group
                      type="transition"
                      :name="!drag ? 'flip-list' : null"
                    >
                      <div v-for="(item, index) in issue.items" :key="index">
                        <v-card
                          class="issue-card list-group-item"
                          :color="getColor(issue.title)"
                          @click="
                            (isUpdate = true),
                              (propEvent = item),
                              (modal = true)
                          "
                        >
                          <v-container>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.user_nickname }}
                            </p>
                            <p class="issue-card-title" aria-disabled>
                              {{ item.name }}
                            </p>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.dates | filterDate }}
                            </p>
                            <p class="issue-card-text" aria-disabled>
                              {{ item.start_time }} ~ {{ item.end_time }}
                            </p>
                          </v-container>
                        </v-card>
                      </div>
                    </transition-group>
                  </draggable>
                </div>
                <!-- 등록된 카드 끝 -->
              </div>
              <!-- 이슈 박스 끝 -->
            </v-col>
            <!-- 이슈 끝 -->
          </v-row>
        </v-col>
      </v-row>
      <study-cal-modal
        :add-modal="modal"
        :is-update="isUpdate"
        :prop-event="propEvent"
        :study_id="study_id"
        v-on:close="(modal = false), (isUpdate = false)"
        v-on:reload="reload"
      />
    </div>
    <request-signin v-else />
  </div>
</template>

<script>
import { format } from "date-fns";
import WorkService from "@/services/work.service";

export default {
  props: ["study_id"],
  name: "mycal",
  data: () => ({
    today: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
    focus: "",
    type: "month",
    typeToLabel: {
      month: "월",
      week: "주",
      day: "일",
      "4day": "4일"
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    userOpen: false,
    selectedOpen: false,
    events: [],
    propEvent: {},
    isUpdate: false,
    modal: false,
    detail: false,
    detailMenus: [
      { title: "내 일정에 추가", value: "movemycal" },
      { title: "일정 수정", value: "update" },
      { title: "삭제", value: "delete" }
    ],
    delOpen: false,
    picked: false,
    default_items: [],
    issues: [
      {
        title: "할 일",
        items: []
      },
      {
        title: "진행 중",
        items: []
      },
      {
        title: "완료",
        items: []
      }
    ],
    drag: false,
    removed: "",
    added: ""
  }),
  components: {
    studyCalModal: () => import("@/components/studyView/studyCalModal"),
    requestSignin: () => import("@/components/base/RequestSignin"),
    draggable: () => import("vuedraggable")
  },
  watch: {
    issues() {
      console.log(this.issues);
    }
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year + "년";
      const endYear = end.year + "년";
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + "일";
      const endDay = end.day + "일";

      switch (this.type) {
        case "month":
          return `${startYear} ${startMonth}`;
        case "week":
        case "4day":
          return `${startYear} ${startMonth} ${startDay} ~ ${suffixYear} ${suffixMonth} ${endDay}`;
        case "day":
          return `${startYear} ${startMonth} ${startDay}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    isAuth() {
      return this.$store.getters["auth/isAuth"];
    },
    getBgColor(hover) {
      if (hover) {
        return "grey";
      } else {
        return "white";
      }
    },
    dragOptions() {
      return {
        animation: 200,
        group: "issue",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  mounted() {
    // 마운트시 내 일정 엑시오스 요청
    this.reload();
    // this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      let color;
      if (event.status === "그룹할일") {
        color = "light green";
      } else {
        color = "purple";
      }
      return color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    updateRange({ start, end }) {
      //   const events = [];

      //   const my_events = []; // 내일정 엑시오스 요청

      //   for (var i = 0; i < my_events.length; i++) {
      //     events.push({
      //       name:
      //         my_events.group == "empty"
      //           ? my_events.name
      //           : "[" + my_events.group + "]" + my_events.name,
      //       content: my_events.content,
      //       start:
      //         event.startTime != ""
      //           ? event.startDay + " " + event.startTime
      //           : event.startDay,
      //       end:
      //         event.endTime != ""
      //           ? event.endDay + " " + event.endTime
      //           : event.endDay,
      //       group: event.group,
      //       color: event.color,
      //       event_id: event.event_id
      //     });
      //   }

      this.start = start;
      this.end = end;

      //   console.log(my_events);
      //   console.log(events);
      //   this.events = events;
    },

    async reload() {
      // 일정목록 리로드
      // this.$refs.calendar.checkChange();
      // WorkService.getWorks({ type: "study", study_id: this.study_id }).then(
      //   async works => {
      //     await works.data.map(work => {
      //       work.name = "[" + work.status + "]" + work.name;
      //       work.color = work.color
      //         ? work.color
      //         : "primary"; /* 빨리 여기를 수정해야 한다. */
      //       work.start = work.start_date;
      //       work.end = work.end_date;
      //     });
      //     this.events = works.data;
      //     this.$refs.calendar.checkChange();
      //   }
      // );
      let payload = {
        type: "study",
        study_id: this.study_id
      };
      let res = await WorkService.getWorks(payload);
      this.default_items = [];
      this.issues[0].items = [];
      this.issues[1].items = [];
      this.issues[2].items = [];
      for (let item of res) {
        switch (item.status) {
          case "기본":
            this.default_items.push(item);
            break;
          case "할 일":
            this.issues[0].items.push(item);
            break;
          case "진행 중":
            this.issues[1].items.push(item);
            break;
          case "완료":
            this.issues[2].items.push(item);
            break;
          default:
            console.log(
              "reload method in studyScehdule.vue error",
              item.status
            );
        }
      }
    },

    getColor(title) {
      let colors = {
        "할 일": "greenC",
        "진행 중": "blueC",
        완료: "greyC"
      };

      return colors[title];
    },
    datesToList(dates){
      if(dates == '') return []
      let result = [];
      let arr = dates.split('/')
      if(arr.length == 1) return [dates]

      for(let date of arr){
        result.push(date)
      }
      console.log(result)
      return result
    },
    async update(event) {
      let updateEvent = JSON.parse(JSON.stringify(event));
      updateEvent.work_id = updateEvent.id
      updateEvent.dates = this.datesToList(updateEvent.dates)
      //수정 엑시오스 요청
      let res = await WorkService.updateWork(updateEvent);
        console.log(res)
      if (res.state == "success") {
        this.reload();
      }
    },
    log(evt, title) {
      if (evt.added) {
        this.added = title;
        if (this.removed != "") {
          evt.added.element.status = title;
          this.update(evt.added.element);
          this.removed = "";
        }
      }
      if (evt.removed) {
        this.removed = title;
        if (this.added != "") {
          evt.removed.element.status = this.added;
          this.update(evt.removed.element)
          this.added = "";
        }
      }
    }
  },
  filters: {
    filterDate(values) {
      if (values == "") return;
      let result = "";
      values = values.split("/");
      for (let value of values) {
        let arr = value.split("-");
        result += " " + arr[1] + "/" + arr[2];
      }

      return result;
    }
  }
};
</script>
