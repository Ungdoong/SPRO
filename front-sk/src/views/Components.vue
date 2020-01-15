<template>
    <div>
        <topBlock></topBlock>
        <b-container class="bv-example-row">
          <b-row class="justify-content-md-center">
            <b-col col lg="8">
              <main-contents></main-contents>
            </b-col>
            <b-col col lg="4">
              <member-aside></member-aside>
            </b-col>
          </b-row>
        </b-container>
    </div>
</template>
<script>
import topBlock from "./components/TopBlock";
import mainContents from "./components/MainContents"
import memberAside from "./components/MemberAside"

export default {
  name: "components",
  components: {
    topBlock,
    mainContents,
    memberAside
  }
};
</script>
